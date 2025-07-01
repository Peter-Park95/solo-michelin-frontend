import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StarRating from "../../components/StarRating";
import "./ReviewAddPage.css"; // 공통 스타일
import "./EditReviewPage.css"; // 필요 시 보조 스타일

const EditReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [foodRating, setFoodRating] = useState(0);
  const [moodRating, setMoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
      const fetchReview = async () => {
        try {
          const res = await axios.get(`/api/reviews/${id}`);
          const data = res.data;
          console.log("📦 불러온 리뷰 데이터:", data);

          setReview(data);
          // 별점 세팅 (0~5 범위, 보정)
          setFoodRating(Number(data.foodRating) || 0);
          setMoodRating(Number(data.moodRating) || 0);
          setServiceRating(Number(data.serviceRating) || 0);
          setComment(data.comment || "");

          // 이미지 URL
          setImagePreview(data.reviewImageUrl || null);
        } catch (err) {
          console.error("리뷰 불러오기 실패:", err);
          alert("리뷰 정보를 불러오지 못했습니다.");
          navigate("/list");
        }
      };

      fetchReview();
    }, [id, navigate]);

  const handleSubmit = async () => {
    const ratings = [foodRating, moodRating, serviceRating].filter((r) => r > 0);
    const avgRating = Math.ceil((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;

    const formData = new FormData();
    const reviewData = {
      foodRating,
      moodRating,
      serviceRating,
      rating: avgRating,
      comment,
      restaurantName: review.restaurantName,
      address: review.address,
      category: review.category,
      mapUrl: review.mapUrl,
    };

    formData.append("review", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }
  console.log("📦 전송할 reviewData:", reviewData);
  if (imageFile) {
    console.log("🖼 전송할 이미지 파일:", imageFile.name, imageFile.type, imageFile.size);
  }

    try {
      await axios.put(`/api/reviews/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("리뷰가 수정되었습니다.");
      navigate("/list");
    } catch (err) {
      console.error("리뷰 수정 실패:", err.response?.data || err.message);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

const handleImageDelete = async () => {
  const confirmDelete = window.confirm("이미지를 삭제하시겠습니까?");
  if (!confirmDelete) return;
  try {
    await axios.patch(`/api/reviews/${id}/image`);
    setImagePreview(null);
    setImageFile(null);
    alert("이미지가 삭제되었습니다.");
  } catch (err) {
    console.error("이미지 삭제 실패:", err.response?.data || err.message);
    alert("이미지 삭제 중 오류가 발생했습니다.");
  }
};

const displayRatings = [foodRating, moodRating, serviceRating].filter((r) => r > 0);
const displayAvg =
  displayRatings.length > 0
    ? Math.ceil((displayRatings.reduce((a, b) => a + b, 0) / displayRatings.length) * 10) / 10
    : 0;

  if (!review) return <p>불러오는 중...</p>;

  return (
    <div className="review-page">
      <h2>리뷰 수정하기</h2>

      <div className="selected-restaurant-card">
        <div className="info">
          <div className="restaurant-name">{review.restaurantName}</div>
          <div className="restaurant-address">{review.address}</div>
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
          onClick={() => document.getElementById("edit-image-input").click()}
        >
          📷 사진 변경하기
        </button>
        <input
          type="file"
          accept="image/*"
          id="edit-image-input"
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
            <img src={imagePreview} alt="리뷰 이미지" className="image-preview" />
            <button
              type="button"
              className="delete-image-button"
              onClick={handleImageDelete}
            >
              🗑️ 이미지 삭제
            </button>
          </div>
        )}
      </div>

      <textarea
        placeholder="리뷰를 수정해주세요"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <button className="submit-button" onClick={handleSubmit}>
        수정 완료
      </button>
    </div>
  );
};

export default EditReviewPage;
