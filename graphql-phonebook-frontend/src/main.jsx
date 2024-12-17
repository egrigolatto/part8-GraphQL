import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"; 

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

// const query = gql`
//   query {
//     allPersons {
//       name
//       phone
//       address {
//         street
//         city
//       }
//       id
//     }
//   }
// `;

// client.query({ query }).then((response) => {
//   console.log(response.data);
// });

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
