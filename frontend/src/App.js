import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {
  const [refresh, setRefresh] = useState("");
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await axios.post("http://localhost:3001/auth/google", {
        code,
      });
      console.log(tokens.data);
      setRefresh(tokens.data.refresh_token);
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
    console.log(tokens.data);
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={googleLogin}>Login</button>
        {refresh && (
          <button onClick={() => getRefreshToken(refresh)}>Refresh</button>
        )}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
