import React from "react";
import AppColumn from "../components/AppColumn";
import ForgotPass from "../contexts/Auth/ForgotPW";

const ForgotPassword = () => {
  return (
    <>
      <AppColumn>
        <div style={{ width: "100%", textAlign: "center" }}>
          <ForgotPass />
        </div>
      </AppColumn>
    </>
  );
};

export default ForgotPassword;
