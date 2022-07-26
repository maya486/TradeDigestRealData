import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import GraphApp from "./graph";
import reportWebVitals from "./reportWebVitals";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://msc-krnl-test-hasura.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBmTmp3QWo2d3gzVzVQOHNxMng0byJ9.eyJodHRwczovL2tlcm5lbC1hcGkuYXBwcy5kZXYubW9zYWljLnVzL3JvbGVzIjpbImFkbWluIl0sImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwidmlld2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiZW1haWx8NjI5ZTQzMDY2ZjFhMWE1Y2JiNTBjZTIyIn0sImlzcyI6Imh0dHBzOi8vbW9zYWljLWJ1aWxkZXJzLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw2MjllNDMwNjZmMWExYTVjYmI1MGNlMjIiLCJhdWQiOlsiaGFzdXJhIiwiaHR0cHM6Ly9tb3NhaWMtYnVpbGRlcnMudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1ODc4MjI5NSwiZXhwIjoxNjU5Mzg3MDk1LCJhenAiOiI3SWp3a2tGdXMzaU1wcmpWbjZLN1pIbjdONWNDRmNaeCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJwZXJtaXNzaW9ucyI6W119.h-wXnh5uUnGIWqRHsVZ4yS3Z_MkqKngdyF7LSiRBmO-F3NoNWaP2iid80HisK4zxtKGIHzyHCCakexSoPyd5CZjQtliVJ_LZCE6m-rykZZrLvK7T1ZS3oq70Ea0sIkpInJfbY6VeOJYpg9c4P1Q7RGnbghFo0-bf5yERz8byWeZS4TG4i8ZMFpdZbBmpXblMwBZy6ZChbtmyUhy8GEknjGUx5359P9t4krEHnsF1tHfPj5AcRX-Rl6VdsNGhpIHH8jyMRi2ZHX68GLoIqcP2Nt9fZiwhbShaPUaxj6VaiT7dKjxhGYys5jRABPC7h0FsUNzydXEFiUY8TO4Zx-BVMw",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <ApolloProvider client={client}>
      <App />
      {/* <GraphApp /> */}
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
