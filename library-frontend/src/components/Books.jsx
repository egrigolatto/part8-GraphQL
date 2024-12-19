import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";
import { BookList } from "./BookList";

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState(null);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    console.error("Error loading books:", error);
    return <div>Error loading books</div>;
  }

  const books = data.allBooks || [];

  // Extraer géneros únicos
  const genres = Array.from(new Set(books.flatMap((book) => book.genres)));

  // Filtrar libros por género seleccionado
  const filteredBooks = selectedGenre
    ? books.filter((book) => book.genres.includes(selectedGenre))
    : books;

  return (
    <div>
      <h2>books</h2>

      <div>
        <button onClick={() => setSelectedGenre(null)}>All Genres</button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              fontWeight: selectedGenre === genre ? "bold" : "normal",
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      <br />

      <BookList books={filteredBooks} />

    </div>
  );
};

export { Books };
