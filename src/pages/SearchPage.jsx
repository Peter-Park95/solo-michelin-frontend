import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(`/api/kakao-search?query=${search}`);
        const sliced = res.data.documents.slice(0, 3);
        setResults(sliced);
      } catch (error) {
        console.error("검색 실패:", error);
      }
    };

    const delay = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="search-page">
      <Header title="나혼자 미슐랭" showMenu={true} />
      <h2 className="search-title">맛집 검색하기</h2>

      <div className="search-input-box">
        <input
          type="text"
          placeholder="음식점을 검색해보세요"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedPlace(null);
          }}
        />
      </div>

      <ul className="search-result-list">
        {results.map((place, i) => (
          <li
            key={i}
            className="search-result-item"
            onClick={() => setSelectedPlace(place)}
          >
            <strong>{place.place_name}</strong>
            <br />
            {place.road_address_name}
          </li>
        ))}
      </ul>

      {selectedPlace && (
        <div className="selected-place-card">
          <div className="place-info">
            <h3>{selectedPlace.place_name}</h3>
            <p>{selectedPlace.road_address_name}</p>
            <p>{selectedPlace.category_name}</p>
          </div>
          <button
            className="review-btn"
            onClick={() =>
              navigate("/add-review", {
                state: {
                  name: selectedPlace.place_name,
                  address: selectedPlace.road_address_name,
                  category: selectedPlace.category_name,
                  kakaoPlaceId: selectedPlace.id,
                  mapUrl: selectedPlace.place_url,
                },
              })
            }
          >
            리뷰 작성하기
          </button>
        </div>
      )}

      <div className="map-coming-soon">
        <div className="map-spinner"></div>
        <p className="map-text">🔧 MAP 기능 개발 중이에요!</p>
      </div>
    </div>
  );
};

export default SearchPage;
