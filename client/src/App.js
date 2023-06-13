import React from "react";
import "./App.css";
import "./responsive.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./screen/tasks";
import Login from "./screen/login";
import Home from "./screen/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/tasks" element={<Test />} exact />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
