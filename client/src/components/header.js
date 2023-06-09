import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header-component">
      <div className="button-w">
        <Link className="tasksManager" to="/">
          Tasks Manager
        </Link>
        <Link to="/">Calendar</Link>
        <Link to="/tasks">Tasks</Link>
      </div>
      <div className="search-w">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Find a Task" className="search" />
      </div>
    </div>
  );
}
