import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import Book from "./models/book.js";
import Author from "./models/author.js";
import User from "./models/user.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

dotenv.config();

mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        }
      }
      if (args.genre) {
        filter.genres = args.genre;
      }
      return Book.find(filter).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        // Buscar si el autor ya existe en la base de datos
        let author = await Author.findOne({ name: args.author });

        // Si no existe, crearlo y guardarlo
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        // Crear el libro con referencia al autor
        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres,
        });

        // Guardar el libro en la base de datos
        await book.save();

        // Poblar el autor y retornar el libro
        return book.populate("author");
      } catch (error) {
        // Manejo de errores de validación de Mongoose
        if (error.name === "ValidationError") {
          throw new GraphQLError("Validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: Object.keys(error.errors),
              details: error.message,
            },
          });
        }

        // Manejo de otros errores inesperados
        throw new GraphQLError("Failed to add book", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      try {
        // Buscar al autor por nombre
        const author = await Author.findOne({ name: args.name });

        if (!author) {
          throw new GraphQLError("Author not found", {
            extensions: {
              code: "NOT_FOUND",
              invalidArgs: args.name,
            },
          });
        }

        // Actualizar el campo 'born'
        author.born = args.setBornTo;
        await author.save();

        return author;
      } catch (error) {
        // Captura errores específicos de validación
        if (error.name === "ValidationError") {
          throw new GraphQLError("Validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: Object.keys(error.errors),
              details: error.message,
            },
          });
        }

        // Captura errores inesperados
        throw new GraphQLError("Failed to update author", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre || "Unknown",
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id)

      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
