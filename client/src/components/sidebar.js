import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  const currentHour = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo"></div>
      <div className="sidebar-button">
        <Link to="/" className={isActive("/") ? "active" : ""}>
          <i className="fa-solid fa-house"></i>
          {isActive("/") && <span className="page-bar"></span>}
        </Link>
        <Link to="/user" className={isActive("/user") ? "active" : ""}>
          <i className="fa-solid fa-user"></i>
          {isActive("/user") && <span className="page-bar"></span>}
        </Link>
        <Link to="/chart" className={isActive("/chart") ? "active" : ""}>
          <i className="fa-solid fa-chart-pie"></i>
          {isActive("/chart") && <span className="page-bar"></span>}
        </Link>
        <Link to="/calendar" className={isActive("/calendar") ? "active" : ""}>
          <i className="fa-solid fa-calendar"></i>
          {isActive("/calendar") && <span className="page-bar"></span>}
        </Link>
      </div>
      <div className="sidebar-hour">{currentHour}</div>
    </div>
  );
}
