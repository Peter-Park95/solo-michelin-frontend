// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SearchPage from "./pages/SearchPage";
import ListPage from "./pages/review/ListPage";
import MyPage from "./pages/user/MyPage";
import BottomTab from "./components/BottomTab";
import ReviewAddPage from "./pages/review/ReviewAddPage";
import EditReviewPage from "./pages/review/EditReviewPage";
import EditProfilePage from "./pages/user/EditProfilePage";
import KakaoCallbackPage from "./pages/user/KakaoCallbackPage";
import KakaoRedirectHandler from "./pages/user/KakaoRedirectHandler";
import SignUpPage from "./pages/user/SignUpPage";

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
            <Route path="/edit-review/:id" element={<EditReviewPage />} />
             <Route path="/mypage" element={<MyPage />} />
             <Route path="/edit-profile" element={<EditProfilePage />} />
             <Route path="/api/auth/kakao/callback" element={<KakaoCallbackPage />} />
             <Route path="/kakao-redirect" element={<KakaoRedirectHandler />} />
             <Route path="/signup" element={<SignUpPage />} />
          </Routes>
          <BottomTab />
        </div>
      </div>
    </Router>
  );
}

export default App;
