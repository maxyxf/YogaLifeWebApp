import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.css";
import Header from "./components/Header.js";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProductDetail from "./screens/ProductDetail";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import CartScreen from "./screens/CartScreen";
import NotFound from "./components/NotFound";

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const requestedScopes = [
  "profile",
  "email",
  "read:todoitem",
  "read:user",
  "edit:todoitem",
  "edit:user",
  "delete:todoitem",
  "delete:user",
  "write:user",
  "write:todoitem",
];

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/products" element={<ProductScreen />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <CartScreen />
                </RequireAuth>
              }
            />
            <Route
              path="/debugger"
              element={
                <RequireAuth>
                  <AuthDebugger />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
