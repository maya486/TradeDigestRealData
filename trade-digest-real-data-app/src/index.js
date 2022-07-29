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
  uri: "https://msc-krnl-prod-hasura.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFDbjlqSU9jS3BPdWRPYk4zaDNMNiJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsInZpZXdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ2aWV3ZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiZW1haWx8NjJlMmJlZDdiNDIzMDY4MWIzMDY2ZTNhIn0sImlzcyI6Imh0dHBzOi8vbW9zYWljLWJ1aWxkZXJzLXByb2QudXMuYXV0aDAuY29tLyIsInN1YiI6ImVtYWlsfDYyZTJiZWQ3YjQyMzA2ODFiMzA2NmUzYSIsImF1ZCI6WyJoYXN1cmEiLCJodHRwczovL21vc2FpYy1idWlsZGVycy1wcm9kLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NTkxMDI1MTksImV4cCI6MTY1OTcwNzMxOSwiYXpwIjoibW9kNFNJUHJoQkhKZERBSmJveU9ER0NzUWtDWGwyb0wiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIiwicGVybWlzc2lvbnMiOltdfQ.RGo1KtFoSbc0W6oo6Xk7NX495ykcvu9QEtHW77M9qRZcX5RHHXD3Wzt5mTZnQ63JVtcVU2ZAH10D9I1bIKVEZUuFUh3tXCM0d8BIWiKzaA5Jv-e-fq6matdwnSUNlOzMIpbLXartWJFbi6Q63CW9g-TCCHuhh3QEoxSaX8ZCZcTWRROJamyouRYXrCvtD0rpX1qNfuS5RKEreJ1Qqa2_ybdYHAHHX46A_VVhy7JtsZVlrH54_xVLMDNGP7_6IQSDkrFbJ1DYrcg2546M6fXW-sa_E1WUohnZNSUzMlzXcsgGkPgmGaMcqpvN8FvzKSXb7eBxO-685k5LbHMtoO_LHA",
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
