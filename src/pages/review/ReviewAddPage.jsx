import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/StarRating";
import "./ReviewAddPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ReviewAddPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [foodRating, setFoodRating] = useState(0);
  const [moodRating, setMoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      }
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const prefilled = location.state;
    if (prefilled) {
      setSelectedRestaurant(prefilled);
    }
  }, [location.state]);

const handleSubmit = async (e) => {
  e.preventDefault();

  const ratings = [foodRating, moodRating, serviceRating].filter((r) => r > 0);
  if (!selectedRestaurant || ratings.length === 0) {
    alert("음식점과 최소 1개 이상의 별점을 입력해주세요!");
    return;
  }

  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const finalRating = Math.ceil(avg * 10) / 10;

  const reviewData = {
    restaurantName: selectedRestaurant.name,
    address: selectedRestaurant.address,
    category: selectedRestaurant.category,
    kakaoPlaceId: selectedRestaurant.kakaoPlaceId,
    mapUrl: selectedRestaurant.mapUrl,
    rating: finalRating,
    comment,
  };

  const formData = new FormData();
  formData.append("review", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    await axios.post("/api/reviews/kakao", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("리뷰가 저장되었습니다!");
    navigate("/list");
  } catch (err) {
    console.error("리뷰 저장 실패:", err.response?.data || err.message);
    alert("리뷰 저장 중 오류가 발생했습니다.");
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

      {selectedRestaurant && (
        <>
          <div className="selected-restaurant-card">
            <div className="info">
              <div className="restaurant-name">{selectedRestaurant.name}</div>
              <div className="restaurant-address">{selectedRestaurant.address}</div>
            </div>
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

          <div className="image-upload-section">
            <button
              type="button"
              className="image-upload-button"
              onClick={() => document.getElementById("review-image-input").click()}
            >
              📷 사진 추가하기
            </button>
            <input
              type="file"
              accept="image/*"
              id="review-image-input"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="리뷰 이미지 미리보기" className="image-preview" />
              </div>
            )}
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
