import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [currentHour, setCurrentHour] = useState(new Date());

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date());
    }, 1000); // Update the time every second (you can adjust the interval as needed)

    return () => clearInterval(intervalId);
  }, []);

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
      <div className="sidebar-hour">
        {currentHour.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
    </div>
  );
}
