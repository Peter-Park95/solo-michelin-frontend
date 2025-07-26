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

  const lastPlaceRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

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
      if (search.length < 2 || !userPosition) return;

      try {
        const res = await axios.get("/api/kakao-search", {
          params: {
            query: search,
            page: page,
            x: userPosition.lng,
            y: userPosition.lat,
          },
        });

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
  }, [search, page, userPosition]);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);

    if (map) {
      // 기존 마커 제거
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // 새 마커 생성
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({ map, position });
      markersRef.current.push(marker);

      // 인포윈도우 생성 (HTML로 커스텀)
    const offsetLat = position.getLat() - 0.004; // 기존 0.002 → 0.004로 더 내림
    const adjustedCenter = new window.kakao.maps.LatLng(offsetLat, position.getLng());
    map.panTo(adjustedCenter);
    document.querySelector('.map-container')?.scrollIntoView({ behavior: "smooth" });
const iwContent = `
  <div style="
    background-color:#f9f9f9;
    padding:10px 12px;
    border-radius:10px;
    max-width:200px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-family:'Pretendard', sans-serif;
    font-size:12px;
    color:#333;
    line-height:1.4;
  ">
    <div style="font-weight:600; font-size:13px; margin-bottom:4px;">${place.place_name}</div>
    <div style="margin-bottom:4px;">${place.road_address_name}</div>
    <a href="${place.place_url}" target="_blank" style="font-size:11px; color:#007bff; text-decoration:underline;">카카오맵에서 보기</a>
    <button style="
      display:block;
      margin-top:8px;
      background-color:#ff4e4e;
      color:white;
      border:none;
      border-radius:5px;
      padding:5px 8px;
      font-size:11px;
      font-weight:600;
      cursor:pointer;
      width:100%;
    "
    onclick='window.dispatchEvent(new CustomEvent("navigateToReview", { detail: ${JSON.stringify(place)} }))'>
      리뷰 작성하기
    </button>
  </div>
`;

      const infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent,
      });

      infowindow.open(map, marker);
      map.setLevel(3);
      map.setCenter(position);
    }
  };

  // "리뷰 작성하기" 버튼 클릭 시 페이지 이동 처리
  useEffect(() => {
    const handleNavigateToReview = (e) => {
      const place = e.detail;
      navigate("/add-review", {
        state: {
          name: place.place_name,
          address: place.road_address_name,
          category: place.category_name,
          kakaoPlaceId: place.id,
          mapUrl: place.place_url,
        },
      });
    };

    window.addEventListener("navigateToReview", handleNavigateToReview);
    return () => {
      window.removeEventListener("navigateToReview", handleNavigateToReview);
    };
  }, [navigate]);

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
            </li>
          ))}
        </ul>
      </div>

      <div className="map-container" ref={mapRef} style={{ height: "70vh" }}></div>
    </div>
  );
};

export default SearchPage;
