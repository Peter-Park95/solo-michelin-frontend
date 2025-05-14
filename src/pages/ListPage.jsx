import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import { getMyReviews } from "../api/review";
import "./ListPage.css";

function ListPage() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate(); // ✅ 추가
  const userId = 5; // 예시 유저 ID

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyReviews(userId);
      setReviews(data);
    };
    fetchData();
  }, []);

  return (
    <div className="list-page">
      <h2 className="list-title">내 맛집 리스트</h2>

      <div className="search-box">
        <input type="text" placeholder="음식점을 검색하세요" />
      </div>

      <div className="filter-buttons">
        <button>⭐ 4.0 이상</button>
        <button>한식</button>
        <button>중식</button>
        <button>일식</button>
      </div>

      <div className="restaurant-list">
        {reviews.map((review) => (
          <div className="restaurant-card" key={review.id}>
            <img src={review.restaurantImageUrl} alt={review.restaurantName} />
            <div className="restaurant-info">
              <h4>{review.restaurantName}</h4>
              <p>{review.comment}</p>
              <p className="rating">내 평점: ⭐ {review.rating}</p>
              <p>가게 평점: ⭐ {review.restaurantAvgRating}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="add-button-wrapper">
        <button
          className="add-button"
          onClick={() => navigate("/add-review")} // ✅ 여기 핵심
        >
          추가하기
        </button>
      </div>
    </div>
  );
}

export default ListPage;
