import React from "react";

const AppColumn = ({ children }) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
    </>
  );
};

export default AppColumn;
