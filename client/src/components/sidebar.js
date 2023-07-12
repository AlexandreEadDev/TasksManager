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
      <nav className="sidebar-button">
        <Link to="/" className={isActive("/") ? "active" : ""}>
          <i className="fa-solid fa-house"></i>
        </Link>
        <Link to="/user" className={isActive("/user") ? "active" : ""}>
          <i className="fa-solid fa-user"></i>
        </Link>
        <Link to="/chart" className={isActive("/chart") ? "active" : ""}>
          <i className="fa-solid fa-chart-pie"></i>
        </Link>
        <Link to="/calendar" className={isActive("/calendar") ? "active" : ""}>
          <i className="fa-solid fa-calendar"></i>
        </Link>
        <div className="deco-bar start-home"></div>
      </nav>
      <div className="sidebar-hour">{currentHour}</div>
    </div>
  );
}
