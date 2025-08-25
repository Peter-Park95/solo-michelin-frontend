import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ListPage.css";
import Header from "../../components/Header"
function ListPage() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("latest");
  const [userId, setUserId] = useState(null); // userId 상태로 바꿈
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
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
    if (!userId) return; // userId 없으면 실행 안함
    try {
      const res = await axios.get(`/api/reviews/user/${userId}`, {
        params: {
          page,
          size: pageSize,
          orderBy: filter === "latest" ? "created" : filter === "rating" ? "rating" : undefined,
          minRating: filter === "min4" ? 4.0 : undefined,
          category: filter === "korean" ? "한식" : filter === "japanese" ? "일식" : undefined,
          search: searchText || undefined // 검색어 추가
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

  // ⬇️ 토큰에서 userId 추출
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    } catch (err) {
      console.error("토큰 디코딩 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setPage(0);
    setReviews([]);
    setHasMore(true);
  }, [filter, userId]);

  useEffect(() => {
    fetchReviews();
  }, [page, filter, userId]);

  const handleFilterClick = (type) => {
    if (type === filter) return;
    setFilter(type);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("정말 삭제할까요?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("리뷰 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

return (
  <>
    {/* 헤더는 바깥에! */}
    <Header title="나혼자 미슐랭" showMenu={true} />

    <div className="list-page">
      <div className="list-page-header">
        <h2 className="list-title">내 맛집 리스트</h2>
        <button className="add-button-top" onClick={() => navigate("/add-review")}>
          + 추가하기
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="음식점을 검색하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(0);
              setReviews([]);
              setHasMore(true);
              fetchReviews();   // ✅ 엔터 시 실행
            }
          }}
        />
        <button
          className="search-button"
          onClick={() => {
            setPage(0);
            setReviews([]);
            setHasMore(true);
            fetchReviews();   // ✅ 버튼 클릭 시 실행
          }}
        >
          🔍
        </button>
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
  const imageUrl = review.reviewImageUrl || review.restaurantImageUrl;
  return (
    <div
      className="restaurant-card"
      key={review.id}
      ref={index === reviews.length - 1 ? lastItemRef : null}
    >
      <div className="floating-actions">
        <button className="mini-btn edit" onClick={() => navigate(`/edit-review/${review.id}`)}>✏️</button>
        <button className="mini-btn delete" onClick={() => handleDelete(review.id)}>🗑️</button>
      </div>

      {imageUrl && (
        <img
          src={encodeURI(imageUrl)}
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
  </>
);
}

export default ListPage;
