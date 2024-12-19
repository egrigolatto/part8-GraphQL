import { useState } from "react";
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.error("Error adding book:", error.message);
    },
    /*update: (cache, response) => {
      // Actualizar el caché de los libros
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        };
      });

      // Actualizar el caché de los autores
      const addedAuthor = response.data.addBook.author;
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        // Verificamos si el autor ya está en el caché y si no, lo agregamos
        if (!allAuthors.some((author) => author.name === addedAuthor.name)) {
          return {
            allAuthors: allAuthors.concat(addedAuthor),
          };
        }
        return { allAuthors };
      });
    },*/
  });


  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    console.log("add book...");

    const publishedInt = parseInt(published, 10);

    if (!title || !author || isNaN(publishedInt) || genres.length === 0) {
      alert("All fields are required, and published must be a number");
      return;
    }

    await addBook({ variables: { title, author, published: publishedInt, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");

    props.setPage("books");
  };

  const addGenre = () => {
    if (genre.trim() !== "") {
      setGenres(genres.concat(genre.trim()));
      setGenre("");
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export {NewBook};
