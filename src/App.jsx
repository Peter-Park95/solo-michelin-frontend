// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ListPage from "./pages/ListPage";
import MyPage from "./pages/MyPage";
import BottomTab from "./components/BottomTab";
import ReviewAddPage from "./pages/ReviewAddPage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  return (
    <Router>
      <div className="AppWrapper">
        <div className="AppContainer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/add-review" element={<ReviewAddPage />} />
             <Route path="/mypage" element={<MyPage />} />
             <Route path="/edit-profile" element={<EditProfilePage />} />
          </Routes>
          <BottomTab />
        </div>
      </div>
    </Router>
  );
}

export default App;
