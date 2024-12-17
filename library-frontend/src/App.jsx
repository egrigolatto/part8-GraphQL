
import { useState } from "react";
// import { Notify } from "./components/Notify";
import { Authors } from "./components/Authors";
import { Books } from "./components/Books";
import { NewBook } from "./components/NewBook";

const App = () => {
  // const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");

  // const result = useQuery(ALL_AUTHORS, {
  //   // pollInterval: 2000, // esto hace que se actualice cada 2 segundos
  // });

  // if (result.loading) {
  //   return <div>loading...</div>;
  // }

  // const notify = (message) => {
  //   setErrorMessage(message);
  //   setTimeout(() => {
  //     setErrorMessage(null);
  //   }, 10000);
  // };

  return (
    <>
      {/* <Notify errorMessage={errorMessage} /> */}
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
    </>
  );
};

export { App };
