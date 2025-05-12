import React from "react";
import "./HomePage.css";

const HomePage = () => {
  console.log("🔥 HomePage 렌더링됨");
  return (
    <div className="home-container">
      {/* 로고 + 메뉴 */}
      <header className="home-header">
        <div className="logo">🍽️ <strong>나홀로 미슐랭</strong></div>
        <div className="menu">☰</div>
      </header>

      {/* 검색창 */}
      <div className="search-box">
        <input type="text" placeholder="찾고 싶은 음식점을 검색하세요" />
      </div>

      {/* 추천 배너 */}
      <div className="banner">
        <div className="banner-text">
          <h3>부산/제주 봄맞이 추천 맛집</h3>
          <p>화사한 요즘 가기 좋아요</p>
        </div>
        <img src="/icons/steak.jpg" alt="steak" />
      </div>

      {/* 카테고리 3x2 */}
      <div className="category-grid">
        {["한식", "양식", "중식", "일식", "뷔페", "카페"].map((name, i) => (
          <div className="category-item" key={i}>
            <img src={`/icons/icon${i + 1}.png`} alt={name} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
