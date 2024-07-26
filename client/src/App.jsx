import React from "react";
import "./App.css";
import "./responsive.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./screen/tasks.jsx";
import Login from "./screen/login.jsx";
import Home from "./screen/home.jsx";
import Profile from "./screen/profile.jsx";
import Calendar from "./screen/calendar.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/tasks" element={<Test />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;
