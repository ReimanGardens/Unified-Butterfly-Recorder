import * as React from "react";
import { useState } from "react";
import Login from "../../contexts/Auth/Login";
import Register from "../../contexts/Auth/Register";

const LoginRegister = () => {
  const [isSignIn, toggleSignIn] = useState(false);

  const toggleFunction = () => {
    return toggleSignIn((isSignIn) => !isSignIn);
  };

  return (
    <div>
      {isSignIn ? (
        <Register toggleFunction={toggleFunction} />
      ) : (
        <Login toggleFunction={toggleFunction} />
      )}
    </div>
  );
};

export default LoginRegister;
