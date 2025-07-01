// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"


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
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import FindEmailPage from "./pages/user/FindEmailPage";

//JWT 만료 확인
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
}

//토큰 검사
function AuthChecker() {
  const navigate = useNavigate();
  const location = useLocation(); //페이지 바뀔 때 감지

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      navigate("/myPage");
    }
  }, [location.pathname]);

  return null;
}

//실제 App
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

//Router 안에서 사용할 수 있게 Wrapper로 분리
function AppWrapper() {
  return (
    <div className="AppWrapper">
      <div className="AppContainer">
        <AuthChecker />
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/find-email" element={<FindEmailPage />} />
        </Routes>
        <BottomTab />
      </div>
    </div>
  );
}

export default App;
