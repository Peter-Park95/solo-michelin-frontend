import React, { useEffect, useState } from "react";
import "./MyPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MyPage = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [userInfo, setUserInfo] = useState({ username: "", introduction: "", region: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("token");
    try {
      const decoded = jwtDecode(token);
        console.log("decoded:", decoded);
      setUserId(decoded.userId); // 백엔드 JWT에 따라 key 조정 필요
    } catch (err) {
      console.error("토큰 디코딩 실패:", err);
      localStorage.removeItem("token");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!userId) return;
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUserInfo(res.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };
    fetchUserInfo();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchRecentReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/user/${userId}`, {
          params: {
            page: 0,
            size: 3,
            orderBy: "created",
          },
        });
        setReviews(res.data.reviews);
        setReviewCount(res.data.totalCount);
      } catch (err) {
        console.error("최근 리뷰 불러오기 실패:", err);
      }
    };
    fetchRecentReviews();
  }, [userId]);
    const handleSignUpClick = () => {
      navigate("/signup");
    };
  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", { email, password });
      localStorage.setItem("token", response.data);
      window.location.reload();
    } catch (error) {
      alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="mypage">
      {!isLoggedIn ? (
        <div className="login-prompt">
          <img src="/public/login_logo.png" alt="나혼자미슐랭" className="login-logo" />
          <div className="login-box">
            <input type="text" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="login-buttons">
              <button className="signup-btn"  onClick={handleSignUpClick}>회원가입</button>
              <button className="disabled-btn">비밀번호 찾기</button>
            </div>
            <button className="login-btn" onClick={handleLogin}>로그인</button>
          </div>
<div className="kakao-login-section">

<button
  className="kakao-login-btn"
  onClick={() => {
    window.location.href = "http://localhost:8080/api/auth/kakao";
  }}
>
    <img src="/public/icons/kakao_icon.png" alt="kakao" className="kakao-icon" />
    <span>카카오로 시작하기</span>
  </button>
</div>
        </div>
      ) : (
        <>
<h2 className="mypage-title">
  마이페이지
  <button className="logout-btn" onClick={() => {
    localStorage.removeItem("token");
    navigate("/login"); // 또는 navigate("/") 등 원하는 경로
  }}>
    로그아웃
  </button>
</h2>
          <div className="profile-box">
            <div className="profile-img">🙎‍♂️</div>
            <div className="profile-info">
              <div className="name-region-box">
                <span className="name">{userInfo.username}</span>
                {userInfo.region && <span className="region"> | {userInfo.region}</span>}
              </div>
              <div className="follow">내 맛집 {reviewCount}</div>
            </div>
            <button className="edit-profile" onClick={() => navigate("/edit-profile")}>프로필 수정</button>
          </div>

          <div className="section-title">최근 내가 간 곳</div>
          <div className="restaurant-list">
            {reviews.map((review) => (
              <div className="restaurant-card" key={review.id}>
                <img src={review.restaurantImageUrl} alt={review.restaurantName} />
                <div className="restaurant-info">
                  <h4>{review.restaurantName}</h4>
                  <p>{review.comment}</p>
                  <p className="rating">⭐ {review.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPage;
