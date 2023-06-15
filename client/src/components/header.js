import React from "react";
import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <div className="header-component">
      <div className="button-w">
        <Link className="tasksManager" to="/" onClick={props.handleLinkClick}>
          Tasks Manager
        </Link>
        <Link to="/calendar" onClick={props.handleLinkClick}>
          Calendar
        </Link>
        <Link to="/profile" onClick={props.handleLinkClick}>
          Profile
        </Link>
      </div>
      <div className="search-w">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Find a Task" className="search" />
      </div>
    </div>
  );
}
