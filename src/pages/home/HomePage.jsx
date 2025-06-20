import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import axios from "axios";

const HomePage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState([0, 1, 2]);

  // 리뷰 불러오기
  useEffect(() => {
    axios
      .get("/api/reviews/highlights?limit=9")
      .then((res) => setAllReviews(res.data))
      .catch((err) => console.error("리뷰 불러오기 실패", err));
  }, []);

  // 인덱스 슬라이드 순환
  useEffect(() => {
    if (allReviews.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndexes((prev) => {
        const next = prev.map((i) => (i + 1) % allReviews.length);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [allReviews]);

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

      {/* 카테고리 (비활성화 상태) */}
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

      {/* 리뷰 하이라이트 */}
      {allReviews.length >= 3 && (
        <div className="highlight-list-wrapper">
            <div className="highlight-title">🔥 Hot Reviews</div>
          {currentIndexes.map((idx) => {
            const review = allReviews[idx];
            return (
              <div className="highlight-card fade-in" key={idx}>
                <img src={review.imageUrl} alt="리뷰" />
                <div className="highlight-info">
                  <strong>{review.restaurantName}</strong>
                  <span>⭐ {review.rating}</span>
                  <p>{review.comment}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
