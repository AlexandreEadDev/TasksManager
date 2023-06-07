import React from "react";
import "./App.css";
import "./responsive.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./screen/test";
import Login from "./screen/login";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} exact />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
