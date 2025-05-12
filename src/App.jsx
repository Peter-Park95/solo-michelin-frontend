// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage"; // 추가 확인!
import BottomTab from "./components/BottomTab";

function App() {
  return (
    <Router>
      <div className="AppWrapper">
        <div className="AppContainer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} /> {/* ✅ 이거 필수 */}
          </Routes>
          <BottomTab />
        </div>
      </div>
    </Router>
  );
}

export default App;
