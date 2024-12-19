import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS } from "../queries";
import { BookList } from "./BookList";

const Recommendations = (props) => {
  const { loading, error, data } = useQuery(ME);

  const favoriteGenre = data.me.favoriteGenre;

  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });


  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    console.error("Error loading user data:", error);
    return <div>Error loading recommendations</div>;
  }

  
  if (booksLoading) {
    return <div>Loading books...</div>;
  }

  if (booksError) {
    console.error("Error loading books:", booksError);
    return <div>Error loading books</div>;
  }

  const books = booksData.allBooks;

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre: <strong>{favoriteGenre}</strong>
      </p>
      <BookList books={books} />
    </div>
  );
};

export { Recommendations };
