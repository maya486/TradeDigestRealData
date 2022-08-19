import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";

function useToken() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    getAccessTokenSilently()
      .then(setToken)
      .catch(() => loginWithRedirect());
    console.log("useeffect running");
  }, [getAccessTokenSilently, setToken, loginWithRedirect]);

  return token;
}

const httpLink = new HttpLink({
  uri: ({ operationName }) =>
    `${process.env.REACT_APP_GRAPHQL_ENDPOINT}?op=${operationName}`,
});

const authMiddleware = (token) =>
  new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }));

    return forward(operation);
  });

export const ApolloProviderWithAuth = ({ children }) => {
  const token = useToken();

  const clientRef = useRef(null);
  console.log(token);
  if (token && !clientRef.current) {
    clientRef.current = new ApolloClient({
      link: concat(authMiddleware(token), httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    });
  }
  if (!clientRef.current) return null;

  return <ApolloProvider client={clientRef.current}>{children}</ApolloProvider>;
};
