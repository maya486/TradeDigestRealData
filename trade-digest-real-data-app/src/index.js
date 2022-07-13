import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
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
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBmTmp3QWo2d3gzVzVQOHNxMng0byJ9.eyJodHRwczovL2tlcm5lbC1hcGkuYXBwcy5kZXYubW9zYWljLnVzL3JvbGVzIjpbImFkbWluIl0sImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwidmlld2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiZW1haWx8NjI5ZTQzMDY2ZjFhMWE1Y2JiNTBjZTIyIn0sImlzcyI6Imh0dHBzOi8vbW9zYWljLWJ1aWxkZXJzLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw2MjllNDMwNjZmMWExYTVjYmI1MGNlMjIiLCJhdWQiOlsiaGFzdXJhIiwiaHR0cHM6Ly9tb3NhaWMtYnVpbGRlcnMudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1NzU2NDU5NiwiZXhwIjoxNjU4MTY5Mzk2LCJhenAiOiI3SWp3a2tGdXMzaU1wcmpWbjZLN1pIbjdONWNDRmNaeCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJwZXJtaXNzaW9ucyI6W119.lFOfv-zbXq3mJCUmZRVKxGr3piAV0WNqNLP-s1toCJMrichvkyHmQOjWlkDXxLaQ6N-EcZJPUR-83mNBWgaLAlTWGufwjrYDNG6wW7PWMNsR5YFTxQsafACDvaCfdTsSd1pWR6D8MNgowpV2AeP9kV0_bVNJHqZX-QvKjkLoBq3_5yAatcMPEwJ1piFdiUQO7XWjcH54EDwhAfdkDF1ECVtki_QKvT8CCmmcDjq3VF9_LIMLV4-g5hs5F8tFjrPtIsjqxRkXOUilcwsxGMLuqVY0KvyBngMQ8XKfozSwQDIyGe_7EsHFx3eKrrP3kis2B8LDzAUdHcRTe9j0avdmng",
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
