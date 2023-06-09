import React from "react";
import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <div className="header-component">
      <div className="button-w">
        <Link className="tasksManager" to="/" onClick={props.handleLinkClick}>
          Tasks Manager
        </Link>
        <Link to="/" onClick={props.handleLinkClick}>
          Calendar
        </Link>
        <Link to="/tasks" onClick={props.handleLinkClick}>
          Tasks
        </Link>
      </div>
      <div className="search-w">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Find a Task" className="search" />
      </div>
    </div>
  );
}
