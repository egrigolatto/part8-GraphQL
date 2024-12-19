import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import YearForm from "./YearForm";

const Authors = (props) => {

  const { loading, error, data } = useQuery(ALL_AUTHORS);
  
  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading authors...</div>;
  }

  if (error) {
    console.error("Error loading authors:", error);
    return <div>Error loading authors</div>;
  }

  const authors = data.allAuthors || [];

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || ""}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      {props.token && <YearForm />}
    </div>
  );
};

export { Authors };
