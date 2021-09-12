import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <Link to="/">
        <span className="header-text">Game of</span>
        <span className="header-text">dragon</span>
      </Link>
    </header>
  );
}

export default Header;
