import React from "react";
import "./HomePage.css";
import Header from "../../components/Header";

const HomePage = () => {
  console.log("🔥 HomePage 렌더링됨");
  return (
    <div className="home-container">
      <Header title="나혼자 미슐랭" showMenu={true} />

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

      {/* 카테고리 3x2 - 현재 개발 중 */}
      {/*
      <div className="category-grid">
        {["한식", "양식", "중식", "일식", "뷔페", "카페"].map((name, i) => (
          <div className="category-item" key={i}>
            <img src={`/icons/icon${i + 1}.png`} alt={name} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      */}

      <div className="dev-placeholder">
        <div className="spinner"></div>
        <p> Home 기능 개발 중이에요! </p>
      </div>
    </div>
  );
};

export default HomePage;
