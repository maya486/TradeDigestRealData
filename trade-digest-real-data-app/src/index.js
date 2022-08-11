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
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFDbjlqSU9jS3BPdWRPYk4zaDNMNiJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsInZpZXdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ2aWV3ZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiZW1haWx8NjJlMmJlZDdiNDIzMDY4MWIzMDY2ZTNhIn0sImlzcyI6Imh0dHBzOi8vbW9zYWljLWJ1aWxkZXJzLXByb2QudXMuYXV0aDAuY29tLyIsInN1YiI6ImVtYWlsfDYyZTJiZWQ3YjQyMzA2ODFiMzA2NmUzYSIsImF1ZCI6WyJoYXN1cmEiLCJodHRwczovL21vc2FpYy1idWlsZGVycy1wcm9kLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NTk3MTIwNjksImV4cCI6MTY2MDMxNjg2OSwiYXpwIjoibW9kNFNJUHJoQkhKZERBSmJveU9ER0NzUWtDWGwyb0wiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIiwicGVybWlzc2lvbnMiOltdfQ.ZJ_XeOXjxjy0cx-pi-0ZsjSmHpLZsmAcWP7zLzLhPA8Ay42Vxkm8roOqLpYsqx6IYysRo7u498tX0r-YTdc5pV28MTmEDU5tx4eaS_0QA1_oZkANlazb-uBP89AZy0T-au1yhF8mS4IvhNl_txUq55WXiMVzF6AHm8W7l-C5voPBXjSD1a2GgHd-cVXiPZLEbb0jxDlChkPUchn_UOPr8O2YRNjSIpq_n8N4IrsUzUnGIuJJbZwzqqRq1IJxRcwbej_rqjvt2R8Tgnxsb5vOJwfPtzWGnPKYXz-yzsF2LXJr1maDNlx0lOseE0H6IGa6vNX4LCaUHjwCaGmIJdbHFA",
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
