import React, { useState } from "react";
import "./App.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt_decode from "jwt-decode";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState("");
  const [initialCode, setInitialCode] = useState("");
  const [beTokens, setBeTokens] = useState({});
  const [decoded, setDecoded] = useState({});
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setInitialCode(code);
      const tokens = await axios.post("http://localhost:3001/auth/google", {
        code,
      });
      setBeTokens(tokens.data);
      setRefresh(tokens.data.refresh_token);
      setDecoded((decoded) => ({
        ...decoded,
        ...jwt_decode(tokens.data.id_token),
      }));
      setIsLoggedIn(true);
    },
    flow: "auth-code",
  });

  const getRefreshToken = async (refreshToken) => {
    const tokens = await axios.post(
      "http://localhost:3001/auth/google/refresh-token",
      {
        refreshToken: refreshToken,
      }
    );
    setBeTokens(tokens.data);
    setRefresh(tokens.data.refresh_token);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setRefresh("");
    setInitialCode("");
    setDecoded({});
    setBeTokens({});
  };

  const Log = ({ value, replacer = null, space = 2 }) => (
    <pre>
      <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
  );
  return (
    <div style={{ margin: "0 auto", maxWidth: "80ch" }}>
      <header>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {isLoggedIn ? (
            refresh && (
              <>
                <button onClick={() => getRefreshToken(refresh)}>
                  Refresh
                </button>
                <div>
                  <p>
                    Logged in as: {decoded.name}{" "}
                    <button onClick={handleSignOut}>Sign Out</button>
                  </p>
                </div>
              </>
            )
          ) : (
            <button onClick={googleLogin}>Login</button>
          )}
        </div>
      </header>
      <hr />
      <section>
        <>
          {initialCode && (
            <p>
              Login response from Google (POST response.code to backend)
              <code>response.code:&nbsp;{initialCode}</code>
            </p>
          )}
          <hr />
          {beTokens.access_token && (
            <>
              <p>
                The backend recieves response.code and returns an object with
                three tokens
              </p>
              <p>
                tokens.access_token: <code>{beTokens.access_token}</code>
              </p>
              <p>
                tokens.id_token: <code>{beTokens.id_token}</code>
              </p>
              <p>
                tokens.refresh_token: <code>{beTokens.refresh_token}</code>
              </p>
            </>
          )}
        </>
      </section>
      <hr />
      <section>
        {Object.keys(decoded).length !== 0 && (
          <>
            <p>The id_token can be decoded with jwt-decode to the following:</p>
            <pre>
              <code>iss: {decoded.iss}</code>
              <code>azp: {decoded.azp}</code>
              <code>aud: {decoded.aud}</code>
              <code>sub: {decoded.sub}</code>
              <code>email: {decoded.email}</code>
              <code>email_verified: {decoded.email_verified.toString()}</code>
              <code>at_hash: {decoded.at_hash}</code>
              <code>name: {decoded.name}</code>
              <code>picture: {decoded.picture}</code>
              <code>given_name: {decoded.given_name}</code>
              <code>family_name: {decoded.family_name}</code>
              <code>locale: {decoded.locale}</code>
              <code>iat: {decoded.iat}</code>
              <code>exp: {decoded.exp}</code>
            </pre>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
