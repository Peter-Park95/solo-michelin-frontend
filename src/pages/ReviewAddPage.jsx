import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';
import './ReviewAddPage.css';
import {useNavigate} from 'react-router-dom';

function ReviewAddPage() {
  const [search, setSearch] = useState('');
  const [restaurantList, setRestaurantList] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [foodRating, setFoodRating] = useState(0);
  const [moodRating, setMoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (search.length < 2) return;
      try {
        const res = await axios.get(`/api/restaurants?query=${search}`);
        setRestaurantList(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('음식점 검색 실패:', error);
        setRestaurantList([]);
      }
    };

    fetchRestaurants();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratings = [foodRating, moodRating, serviceRating].filter((r) => r > 0);

    if (!selectedRestaurant || ratings.length === 0) {
      alert('음식점과 최소 1개 이상의 별점을 입력해주세요!');
      return;
    }

    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const finalRating = Math.ceil(avg * 10) / 10;

    try {
      await axios.post('/api/reviews', {
        userId: 5, // 향후 로그인 기능 구현시 수정
        restaurantId: selectedRestaurant.id,
        rating: finalRating,
        comment,
      });
      alert('리뷰가 저장되었습니다!');
      navigate('/list')
    } catch (error) {
      console.error('리뷰 저장 실패:', error);
      alert('리뷰 저장 중 오류가 발생했습니다.');
    }
  };

  const displayRatings = [foodRating, moodRating, serviceRating].filter((r) => r > 0);
  const displayAvg =
    displayRatings.length > 0
      ? Math.ceil((displayRatings.reduce((a, b) => a + b, 0) / displayRatings.length) * 10) / 10
      : 0;

  return (
    <div className="review-page">
      <h2>리뷰 작성하기</h2>

      <input
        type="text"
        placeholder="음식점 이름 검색"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedRestaurant(null);
        }}
      />

      {search.length >= 2 && !selectedRestaurant && (
        <ul className="restaurant-search-list">
          {restaurantList.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                setSelectedRestaurant(r);
                setSearch(r.name);
                setRestaurantList([]);
              }}
              className="restaurant-search-item"
            >
              <div className="restaurant-name">{r.name}</div>
              <div className="restaurant-address">{r.address}</div>
            </li>
          ))}
        </ul>
      )}

      {selectedRestaurant && (
        <>
          <div className="selected-restaurant-card">
            <div className="info">
              <div className="restaurant-name">{selectedRestaurant.name}</div>
              <div className="restaurant-address">{selectedRestaurant.address}</div>
            </div>
            {selectedRestaurant.imageUrl && (
              <img
                src={selectedRestaurant.imageUrl}
                alt={`${selectedRestaurant.name} 썸네일`}
                className="restaurant-thumbnail"
              />
            )}
          </div>

          <div className="average-rating-display">
            종합 평점: <strong>{displayAvg}</strong>
          </div>

          <div className="multi-rating-section">
            <div className="rating-item">
              <label>음식</label>
              <StarRating rating={foodRating} setRating={setFoodRating} />
            </div>
            <div className="rating-item">
              <label>분위기</label>
              <StarRating rating={moodRating} setRating={setMoodRating} />
            </div>
            <div className="rating-item">
              <label>서비스</label>
              <StarRating rating={serviceRating} setRating={setServiceRating} />
            </div>
          </div>

          <textarea
            placeholder="한 줄 리뷰를 작성해주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <button className="submit-button" onClick={handleSubmit}>
            저장하기
          </button>
        </>
      )}
    </div>
  );
}

export default ReviewAddPage;
