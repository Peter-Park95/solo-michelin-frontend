import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/StarRating";
import "./ReviewAddPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ReviewAddPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

  // JWT에서 userId 추출
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
          console.log("📦 디코딩된 토큰:", decoded);
          console.log("🔚 만료 시간:", decoded.exp);
          console.log("⏰ 현재 시간:", Math.floor(Date.now() / 1000));
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

  // SearchPage에서 넘겨받은 장소가 있다면 바로 세팅
  useEffect(() => {
    const prefilled = location.state;
    if (prefilled) {
      setSelectedRestaurant(prefilled);
    }
  }, [location.state]);

  // 검색어 변경 시 자동 검색
  useEffect(() => {
    const fetchPlaces = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(`/api/kakao-search?query=${searchQuery}`);
        const converted = res.data.documents.slice(0, 3).map((doc) => ({
          kakaoPlaceId: doc.id,
          name: doc.place_name,
          address: doc.road_address_name,
          category: doc.category_name,
          mapUrl: doc.place_url,
        }));
        setSearchResults(converted);
      } catch (err) {
        console.error("장소 검색 실패:", err);
      }
    };

    const timer = setTimeout(fetchPlaces, 300); // 디바운싱
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = async () => {
    if (!selectedRestaurant || !userId) return;

    const ratings = [foodRating, moodRating, serviceRating].filter((r) => r > 0);
    if (ratings.length === 0) {
      alert("평점을 하나 이상 입력해주세요.");
      return;
    }

    const avgRating = Math.ceil((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;

    const formData = new FormData();
    const reviewData = {
      restaurantName: selectedRestaurant.name,
      address: selectedRestaurant.address,
      category: selectedRestaurant.category,
      kakaoPlaceId: selectedRestaurant.kakaoPlaceId,
      mapUrl: selectedRestaurant.mapUrl,
      foodRating: foodRating,
      moodRating: moodRating,
      serviceRating: serviceRating,
      comment: comment,
    };
    console.log("📦 전송할 reviewData:", reviewData);
    formData.append("review", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post("/api/reviews/kakao/create", formData, {
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

      {!selectedRestaurant && (
        <>
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="음식점을 검색하세요"
            />
          </div>
          <ul className="search-results">
            {searchResults.map((place) => (
              <li
                key={place.kakaoPlaceId}
                className="search-result-item"
                onClick={() => setSelectedRestaurant(place)}
              >
                <strong>{place.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#666" }}>{place.address}</div>
              </li>
            ))}
          </ul>
        </>
      )}

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

          <button form method="POST" className="submit-button" onClick={handleSubmit}>
            저장하기
          </button>
        </>
      )}
    </div>
  );
}

export default ReviewAddPage;