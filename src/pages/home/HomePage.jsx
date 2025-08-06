import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import axios from "axios";

const HomePage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    axios
      .get("/api/reviews/highlights?limit=9")
      .then((res) => setAllReviews(res.data))
      .catch((err) => console.error("리뷰 불러오기 실패", err));
  }, []);

  useEffect(() => {
    if (allReviews.length < 9) return;

    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % 3); // 0 → 1 → 2 → 0 반복
    }, 6000);

    return () => clearInterval(interval);
  }, [allReviews]);

  const getCurrentReviewSet = () => {
    const start = currentSetIndex * 3;
    return allReviews.slice(start, start + 3);
  };

  const handleLikeToggle = async (reviewId) => {
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기

    if (!token) {
      console.error("JWT 토큰이 없습니다.");
      return;
    }

    try {
      const updatedReviews = allReviews.map((r) => {
        if (r.id !== reviewId) return r;

        const liked = !r.likedByMe;
        const currentCount = Number(r.likeCount) || 0;
        const newCount = liked ? currentCount + 1 : currentCount - 1;

        return { ...r, likedByMe: liked, likeCount: newCount };
      });

      // 서버 요청 (토큰을 포함한 헤더로 요청)
      await axios.post(`/api/review_like/${reviewId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllReviews(updatedReviews);
    } catch (err) {
      console.error("좋아요 토글 실패", err);
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
        <div className="highlight-list-wrapper">
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
