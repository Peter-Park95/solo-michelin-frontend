import React, { useEffect, useState } from "react";
import "./MyPage.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

const MyPage = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [userInfo, setUserInfo] = useState({              // ✅ 추가된 부분
      username: "",
      introduction: "",
      region: "",
    });
  const userId = 5; // 실제 로그인된 유저 ID로 대체 가능
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUserInfo(res.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/user/${userId}`, {
          params: {
            page: 0,
            size: 3, // ⭐ 최신 3개만
            orderBy: "created",
          },
        });
        setReviews(res.data.reviews);
        setReviewCount(res.data.totalCount);
      } catch (err) {
        console.error("최근 리뷰 불러오기 실패:", err);
      }
    };

    fetchRecentReviews();
  }, []);

  return (
    <div className="mypage">
      <h2 className="mypage-title">마이페이지</h2>

      {/* 프로필 박스 */}
      <div className="profile-box">
        <div className="profile-img">🙎‍♂️</div>
<div className="profile-info">
  <div className="name-region-box">
    <span className="name">{userInfo.username}</span>
    {userInfo.region && (
      <span className="region"> | {userInfo.region}</span> // ✅ region 추가
    )}
  </div>
  <div className="follow">내 맛집 {reviewCount}</div>
</div>
        <button className="edit-profile" onClick={() => navigate("/edit-profile")}>프로필 수정</button>
      </div>

      {/* 최근 내가 간 곳 */}
      <div className="section-title">최근 내가 간 곳</div>
      <div className="restaurant-list">
        {reviews.map((review) => (
          <div className="restaurant-card" key={review.id}>
            <img src={review.restaurantImageUrl} alt={review.restaurantName} />
            <div className="restaurant-info">
              <h4>{review.restaurantName}</h4>
              <p>{review.comment}</p>
              <p className="rating">⭐ {review.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
