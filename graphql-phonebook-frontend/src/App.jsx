import { useQuery } from "@apollo/client";
import  Persons  from "./components/Persons";
import PersonForm from "./components/PersonForm";
import { ALL_PERSONS } from "./queries";
import { useState } from "react";
import PhoneForm from "./components/PhoneForm";



const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_PERSONS, {
    // pollInterval: 2000,
  });

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

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <br />
      <PersonForm setError={notify} />
      <br />
      <PhoneForm setError={notify}/>
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
