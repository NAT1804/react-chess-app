import React from "react";

const Square = ({ children, black }) => {
  const bgClass = black ? "square-black" : "square-white";

  return <div className={`${bgClass} board-square`}>{children}</div>;
};

export default Square;
