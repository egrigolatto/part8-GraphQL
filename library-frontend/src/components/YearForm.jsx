import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const YearForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [year, setYear] = useState("");

  const { data } = useQuery(ALL_AUTHORS);
  const [editYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS },
    ],
  });

  const handleSubmit =  (event) => {
    event.preventDefault();

    const yearInt = parseInt(year, 10);

       editYear({
        variables: { name: selectedOption.value, setBornTo: yearInt },
      });


    setSelectedOption(null);
    setYear("");
  };

  const options =
    data && data.allAuthors
      ? data.allAuthors.map((author) => ({
          value: author.name,
          label: author.name,
        }))
      : [];

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Seleccionar Nombre:{" "}
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born:{" "}
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">
          Update Author
        </button>
      </form>
    </div>
  );
};

export default YearForm;
