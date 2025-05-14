import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';
import './ReviewAddPage.css';

function ReviewAddPage() {
  const [search, setSearch] = useState('');
  const [restaurantList, setRestaurantList] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

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
    if (!selectedRestaurant || rating === 0) {
      alert('음식점 선택과 별점 입력은 필수입니다!');
      return;
    }

    try {
      await axios.post('/api/reviews', {
        restaurantId: selectedRestaurant.id,
        rating,
        comment,
      });
      alert('리뷰가 저장되었습니다!');
      // TODO: navigate('/list')
    } catch (error) {
      console.error('리뷰 저장 실패:', error);
      alert('리뷰 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="review-page">
      <h2>리뷰 작성하기</h2>

      <input
        type="text"
        placeholder="음식점 이름 검색"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedRestaurant(null); // 새로 검색 시 선택 초기화
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
      )}

      {selectedRestaurant && (
        <p className="mt-2 font-semibold">
          선택된 음식점: {selectedRestaurant.name}
        </p>
      )}

      <div className="star-rating">
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <textarea
        placeholder="한 줄 리뷰를 작성해주세요"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <button className="submit-button" onClick={handleSubmit}>저장하기</button>
    </div>
  );
}

export default ReviewAddPage;
