import { useQuery } from "@apollo/client";
import  Persons  from "./components/Persons";
import PersonForm from "./components/PersonForm";
import { ALL_PERSONS } from "./queries";
import { useState } from "react";
import PhoneForm from "./components/PhoneForm";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";



const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_PERSONS, {
    // pollInterval: 2000,
  });
  const client = useApolloClient();

  const [token, setToken] = useState(null);

  // console.log(result);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <h2>login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </>
    );
  }
  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <br />
      <PersonForm setError={notify} />
      <br />
      <PhoneForm setError={notify} />
    </>
  );
};

export default App;

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};
