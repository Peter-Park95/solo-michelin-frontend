import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import axios from "axios";
import { FaHeart, FaRegHeart, FaFire } from "react-icons/fa";

const HomePage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 🔹 배너 관련 state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const banners = [
    { img: "/icons/banner1.png" },
    { img: "/icons/banner2.png" },
    { img: "/icons/banner3.png" },
  ];

  // 리뷰 데이터 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/reviews/highlights?limit=9", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setAllReviews(res.data))
      .catch((err) => console.error("리뷰 불러오기 실패", err));
  }, []);

  // 리뷰 자동 슬라이드
  useEffect(() => {
    if (allReviews.length < 9) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSetIndex((prev) => (prev + 1) % 3);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [allReviews, isPaused]);

  // 배너 자동 슬라이드
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5초마다 배너 변경

    return () => clearInterval(bannerInterval);
  }, []);

  const getCurrentReviewSet = () => {
    const start = currentSetIndex * 3;
    return allReviews.slice(start, start + 3);
  };

  const handleLikeToggle = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    const prevReviews = [...allReviews];
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
      setAllReviews(prevReviews);
      alert("좋아요 반영에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="home-container">
      <Header title="나혼자 미슐랭" showMenu={true} />

      {/* 🔹 자동 배너 캐러셀 */}
      <div className="banner">
        <img
          src={banners[currentBannerIndex].img}
          alt={`banner-${currentBannerIndex}`}
        />

        {(banners[currentBannerIndex].title ||
          banners[currentBannerIndex].desc) && (
          <div className="banner-text">
            {banners[currentBannerIndex].title && (
              <h3>{banners[currentBannerIndex].title}</h3>
            )}
            {banners[currentBannerIndex].desc && (
              <p>{banners[currentBannerIndex].desc}</p>
            )}
          </div>
        )}
      </div>

      {/* 리뷰 하이라이트 */}
      {allReviews.length >= 9 && (
        <div
          className="highlight-list-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="highlight-title">
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            HOT PLACE
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
            <FaFire className="fire-icon" />
          </div>
          {getCurrentReviewSet().map((review, idx) => (
            <div className="highlight-card fade-in" key={idx}>
              <img src={review.imageUrl || "/icons/default_review.png"} alt="리뷰" />
              <div className="highlight-info">
                <div className="highlight-top">
                  <strong>{review.restaurantName}</strong>
                  <button
                    className="like-button"
                    onClick={() => handleLikeToggle(review.id)}
                  >
                    {review.likedByMe ? (
                      <FaHeart className="heart filled" />
                    ) : (
                      <FaRegHeart className="heart" />
                    )}
                    <span className="like-count">{review.likeCount ?? 0}</span>
                  </button>
                </div>
                <span>⭐ {review.rating}</span>
                <p>{review.comment}</p>
                <div className="highlight-bottom">
                  <span className="username">{review.userName}</span>
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
