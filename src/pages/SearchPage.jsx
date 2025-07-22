import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./SearchPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SearchPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const observer = useRef();
  const navigate = useNavigate();

  const lastPlaceRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("위치 정보 오류:", error)
      );
    }
  }, []);

  useEffect(() => {
    const loadMap = () => {
      if (window.kakao && window.kakao.maps && userPosition && mapRef.current) {
        const mapInstance = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng),
          level: 4,
        });
        setMap(mapInstance);
      }
    };

    const loadScript = () => {
      if (document.getElementById("kakao-map-script")) {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(loadMap);
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "kakao-map-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=9c78bac1c5ff3012303af4ee346a6dfd&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(loadMap);
        }
      };
      script.onerror = () => console.error("Kakao Maps SDK 로딩 실패");
      document.head.appendChild(script);
    };

    if (userPosition) {
      loadScript();
    }
  }, [userPosition]);

  useEffect(() => {
    setPage(1);
    setResults([]);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (search.length < 2) return;

      try {
        const res = await axios.get(`/api/kakao-search?query=${search}&page=${page}`);
        const newResults = res.data.documents;

        if (page === 1) {
          setResults(newResults);
        } else {
          setResults((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            return [...prev, ...newResults.filter((p) => !ids.has(p.id))];
          });
        }
      } catch (err) {
        console.error("검색 실패:", err);
      }
    };

    fetchData();
  }, [search, page]);

  useEffect(() => {
    if (!map || results.length === 0) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    results.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({ map, position });
      markersRef.current.push(marker);
      bounds.extend(position);

      const iwContent = `
        <div style="padding:10px; font-size:14px;">
          <strong>${place.place_name}</strong><br/>
          ${place.road_address_name}<br/>
          <a href="${place.place_url}" target="_blank" style="color:blue">카카오맵에서 보기</a>
        </div>
      `;
      const infowindow = new window.kakao.maps.InfoWindow({ content: iwContent });

      window.kakao.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
        setSelectedPlace(place);
      });
    });

    map.setBounds(bounds);
  }, [map, results]);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);

    // 지도 클로즈업
    if (map) {
      const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
      map.setLevel(3); // 숫자가 작을수록 확대 (보통 3~1 사이 추천)
      map.setCenter(moveLatLon);
    }
  };

  return (
    <div className="search-page">
      <Header title="나혼자 미슐랭" showMenu={true} />

      <div className="search-content">
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
              key={`${place.id}-${i}`}
              className="search-result-item"
              ref={i === results.length - 1 ? lastPlaceRef : null}
              onClick={() => handlePlaceClick(place)}
            >
              <strong>{place.place_name}</strong>
              <br />
              {place.road_address_name}
              {selectedPlace?.id === place.id && (
                <div className="selected-place-card">
                  <div className="place-info">
                    <h3>{selectedPlace.place_name}</h3>
                    <p>{selectedPlace.road_address_name}</p>
                    <p>{selectedPlace.category_name}</p>
                  </div>
                  <button
                    className="review-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/add-review", {
                        state: {
                          name: selectedPlace.place_name,
                          address: selectedPlace.road_address_name,
                          category: selectedPlace.category_name,
                          kakaoPlaceId: selectedPlace.id,
                          mapUrl: selectedPlace.place_url,
                        },
                      });
                    }}
                  >
                    리뷰 작성하기
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="map-container" ref={mapRef} style={{ height: "50vh" }}></div>
    </div>
  );
};

export default SearchPage;
