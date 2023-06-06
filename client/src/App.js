import React from "react";
import "./App.css";
import "./responsive.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./screen/test";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} exact />
      </Routes>
    </Router>
  );
}

export default App;
