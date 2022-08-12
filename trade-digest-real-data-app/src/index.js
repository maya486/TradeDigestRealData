import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://msc-krnl-prod-hasura.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFDbjlqSU9jS3BPdWRPYk4zaDNMNiJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsInZpZXdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ2aWV3ZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiZW1haWx8NjJlMmJlZDdiNDIzMDY4MWIzMDY2ZTNhIn0sImlzcyI6Imh0dHBzOi8vbW9zYWljLWJ1aWxkZXJzLXByb2QudXMuYXV0aDAuY29tLyIsInN1YiI6ImVtYWlsfDYyZTJiZWQ3YjQyMzA2ODFiMzA2NmUzYSIsImF1ZCI6WyJoYXN1cmEiLCJodHRwczovL21vc2FpYy1idWlsZGVycy1wcm9kLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NjAzMjI2ODUsImV4cCI6MTY2MDkyNzQ4NSwiYXpwIjoibW9kNFNJUHJoQkhKZERBSmJveU9ER0NzUWtDWGwyb0wiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIiwicGVybWlzc2lvbnMiOltdfQ.Cv9KOfWes7jFNnJ9wOiEGLJlD_UeldY9e3hJzV5a382wQz4gdnO2TYESUZ3346DIqxa1S9uaPNWNg5v0GOyntd86yJUCzc3GJk5i5xeN8aw_V2trJLP5Dv2elRdcv06Y4fjBYHA4puPgXBhPAugo7UwjtHkjibe6qfbNXO3V9Wu_93cVouhx-qPxvlLGRQMoOQxwCpuZ6SZtYa1HLQTm2c2dWIbdDGuY5Xrq65ndKmyyGRiZ5cjL6yHR9QgLWSUIsUrjmsMqoglgMIlTC6I379HIq8sIDBobTqJtdbBpZCHJ3KQ1ExSp-yVlztZwPsIoTEoIG5hdELQ405tu_TQ-FQ",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
