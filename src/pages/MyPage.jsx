// src/pages/MyPage.jsx
import React from "react";
import "./MyPage.css";

const MyPage = () => {
  return (
    <div className="mypage">
      <h2 className="mypage-title">마이페이지</h2>

      {/* 프로필 간략 표시 */}
      <div className="profile-box">
        <div className="profile-img">🙎‍♂️</div>
        <div className="profile-info">
          <div className="name">희범박</div>
          <div className="follow">내 맛집 1</div>
        </div>
      </div>

      {/* 저장한 레스토랑 영역 */}
      <div className="section-title">내 맛집</div>
      <div className="restaurant-list">
        <div className="restaurant-card">
          <img src="/icons/steak.jpg" alt="맛집" />
          <div className="restaurant-info">
            <h4>일 베키오(Il vecchio)</h4>
            <p>정통 이탈리안 파인다이닝, 분위기 좋은 스테이크</p>
            <p className="rating">⭐ 4.8 (560)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
