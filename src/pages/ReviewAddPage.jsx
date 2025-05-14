import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating'; // 별도 컴포넌트로 분리했다고 가정
import './ReviewAddPage.css';

function ReviewAddPage() {
  const [search, setSearch] = useState('');
  const [restaurantList, setRestaurantList] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // 음식점 검색 API 호출
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (search.length < 3) return;
      try {
        const res = await axios.get(`/api/restaurants?query=${search}`);
        setRestaurantList(res.data);
      } catch (error) {
        console.error('검색 실패:', error);
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
      // TODO: navigate('/list') 등으로 돌아가기
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
        onChange={(e) => setSearch(e.target.value)}
      />

      {search.length >= 2 && (
        <ul className="border mt-2 max-h-40 overflow-y-auto">
          {restaurantList.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                setSelectedRestaurant(r);
                setSearch(r.name);
                setRestaurantList([]);
              }}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {r.name}
            </li>
          ))}
        </ul>
      )}

      {selectedRestaurant && (
        <p className="mt-2 font-semibold">선택된 음식점: {selectedRestaurant.name}</p>
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

      <button onClick={handleSubmit}>저장하기</button>
    </div>
  );
}

export default ReviewAddPage;
