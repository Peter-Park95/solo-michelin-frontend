import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListPage.css";

function ListPage() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("latest");
  const navigate = useNavigate();
  const userId = 5;
  const pageSize = 5;

  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/user/${userId}`, {
        params: {
          page,
          size: pageSize,
          orderBy: filter === "latest" ? "created" : filter === "rating" ? "rating" : undefined,
          minRating: filter === "min4" ? 4.0 : undefined,
          category: filter === "korean" ? "한식" : filter === "japanese" ? "일식" : undefined,
        },
      });

      if (page === 0) {
        setReviews(res.data.reviews);
      } else {
        setReviews((prev) => {
          const newReviews = res.data.reviews.filter(
            (r) => !prev.some((p) => p.id === r.id)
          );
          return [...prev, ...newReviews];
        });
      }
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("리뷰 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    setPage(0);
    setReviews([]);
    setHasMore(true);
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [page, filter]);

  const handleFilterClick = (type) => {
    if (type === filter) return;
    setFilter(type);
  };

  return (
    <div className="list-page">
      <div className="list-page-header">
        <h2 className="list-title">내 맛집 리스트</h2>
        <button
          className="add-button-top"
          onClick={() => navigate("/add-review")}
        >
          + 추가하기
        </button>
      </div>

      <div className="search-box">
        <input type="text" placeholder="음식점을 검색하세요" />
      </div>

      <div className="filter-buttons">
        <button className={filter === "latest" ? "active" : ""} onClick={() => handleFilterClick("latest")}>🕘 최신순</button>
        <button className={filter === "rating" ? "active" : ""} onClick={() => handleFilterClick("rating")}>📈 랭킹순</button>
        <button className={filter === "min4" ? "active" : ""} onClick={() => handleFilterClick("min4")}>🌟 4.0 이상</button>
        <button className={filter === "korean" ? "active" : ""} onClick={() => handleFilterClick("korean")}>🍚 한식</button>
        <button className={filter === "japanese" ? "active" : ""} onClick={() => handleFilterClick("japanese")}>🍣 일식</button>
      </div>

      <div className="restaurant-list">
        {reviews.map((review, index) => {
          const imageUrl = review.imageUrl || review.restaurantImageUrl;
          return (
            <div
              className="restaurant-card"
              key={review.id}
              ref={index === reviews.length - 1 ? lastItemRef : null}
            >
              {imageUrl && (
<img
  src={review.reviewImageUrl || review.restaurantImageUrl}
  alt={review.restaurantName}
/>
              )}
              <div className="restaurant-info">
                <h4>{review.restaurantName}</h4>
                <p>{review.comment}</p>
                <p className="rating">내 평점: ⭐ {review.rating}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListPage;
