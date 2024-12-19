import { useState } from "react";
// import { Notify } from "./components/Notify";
import { Authors } from "./components/Authors";
import { Books } from "./components/Books";
import { NewBook } from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";
import { Recommendations } from "./components/Recommendations";

const App = () => {
  // const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

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

  // if (!token) {
  //   return (
  //     <div>
  //       <Notify errorMessage={errorMessage} />
  //       <h2>Login</h2>
  //       <LoginForm setToken={setToken} setError={notify} />
  //     </div>
  //   );
  // }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  return (
    <>
      {/* <Notify errorMessage={errorMessage} /> */}
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} setPage={setPage } />

      <LoginForm
        setToken={setToken}
        setPage={setPage}
        show={page === "login"}
      />

      <Recommendations show={page === "recommend"} />
    </>
  );
};

export { App };
