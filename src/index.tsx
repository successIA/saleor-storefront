import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import * as React from "react";
import { render } from "react-dom";

import { App, UserProvider } from "./components";
import {
  authLink,
  invalidTokenLinkWithTokenHandlerComponent
} from "./core/auth";

const devMode = process.env.NODE_ENV !== "production";
const cache = new InMemoryCache();
const {
  component: UserProviderWithTokenHandler,
  link: invalidTokenLink
} = invalidTokenLinkWithTokenHandlerComponent(UserProvider);

const link = ApolloLink.from([
  invalidTokenLink,
  authLink,
  new HttpLink({
    uri: process.env.APP_GRAPHQL_URL || "/graphql/"
  })
]);

persistCache({
  cache,
  debug: devMode,
  storage: window.localStorage
});

const apolloClient = new ApolloClient({ cache, link });

render(
  <UserProviderWithTokenHandler apolloClient={apolloClient} refreshUser>
    <App apolloClient={apolloClient} />
  </UserProviderWithTokenHandler>,
  document.getElementById("root")
);