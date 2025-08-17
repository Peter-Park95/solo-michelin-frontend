import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import axios from "axios";

const HomePage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 리뷰 데이터 불러오기
  useEffect(() => {
    axios
      .get("/api/reviews/highlights?limit=9")
      .then((res) => setAllReviews(res.data))
      .catch((err) => console.error("리뷰 불러오기 실패", err));
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (allReviews.length < 9) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSetIndex((prev) => (prev + 1) % 3);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [allReviews, isPaused]);

  const getCurrentReviewSet = () => {
    const start = currentSetIndex * 3;
    return allReviews.slice(start, start + 3);
  };

  // 좋아요 토글 (낙관적 업데이트 + 실패 시 롤백)
  const handleLikeToggle = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 기존 상태 저장 (롤백용)
    const prevReviews = [...allReviews];

    // 즉시 UI 업데이트
    setAllReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              likedByMe: !r.likedByMe,
              likeCount: (r.likeCount ?? 0) + (r.likedByMe ? -1 : 1),
            }
          : r
      )
    );

    try {
      await axios.post(`/api/review_like/${reviewId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("좋아요 토글 실패", err);
      // 실패 시 롤백
      setAllReviews(prevReviews);
      alert("좋아요 반영에 실패했습니다. 다시 시도해주세요.");
    }
  };

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

      {/* 리뷰 하이라이트 */}
      {allReviews.length >= 9 && (
        <div
          className="highlight-list-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="highlight-title">🔥 Hot Reviews</div>
          {getCurrentReviewSet().map((review, idx) => (
            <div className="highlight-card fade-in" key={idx}>
              <img src={review.imageUrl} alt="리뷰" />
              <div className="highlight-info">
                <div className="highlight-top">
                  <strong>{review.restaurantName}</strong>
                  <span className="username">{review.userName}</span>
                </div>
                <span>⭐ {review.rating}</span>
                <p>{review.comment}</p>
                <div className="highlight-bottom">
                  <button
                    className="like-button"
                    onClick={() => handleLikeToggle(review.id)}
                  >
                    {review.likedByMe ? "❤️" : "🤍"} {review.likeCount ?? 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
