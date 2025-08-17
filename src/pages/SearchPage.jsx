import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./SearchPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const DEBOUNCE_MS = 250;

const SearchPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nationwide, setNationwide] = useState(false);
  const [placeStats, setPlaceStats] = useState(null);
  const [reviewPopup, setReviewPopup] = useState(null);
  const [reviewList, setReviewList] = useState([]);

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const observer = useRef();
  const searchTimer = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  // 무한스크롤
  const lastPlaceRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) setPage((p) => p + 1);
      });
      if (node) observer.current.observe(node);
    },
    [hasNextPage]
  );

  // 위치
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("위치 정보 오류:", err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // 카카오 지도
  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) return;
      const center = userPosition
        ? new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng)
        : new window.kakao.maps.LatLng(37.5665, 126.978);
      const mapInstance = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 4,
      });
      setMap(mapInstance);
    };

    if (document.getElementById("kakao-map-script")) {
      window.kakao?.maps?.load(loadMap);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=9c78bac1c5ff3012303af4ee346a6dfd&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(loadMap);
    script.onerror = () => console.error("Kakao Maps SDK 로딩 실패");
    document.head.appendChild(script);
  }, [userPosition]);

  // 검색 디바운스
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(searchTimer.current);
  }, [search, nationwide]);

  // 검색 API
  useEffect(() => {
    const fetchData = async () => {
      const q = search.trim();
      if (q.length < 2) {
        setResults([]);
        setHasNextPage(false);
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = { query: q, page, nationwide };
        if (!nationwide && userPosition) {
          params.x = userPosition.lng;
          params.y = userPosition.lat;
        }

        const res = await axios.get("/api/kakao-search", {
          params,
          signal: controller.signal,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const { documents = [], meta = {} } = res.data || {};
        setResults((prev) => (page === 1 ? documents : [...prev, ...documents]));
        setHasNextPage(meta.is_end === false);
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error("검색 실패:", err);
      }
    };

    fetchData();
    return () => abortRef.current?.abort();
  }, [page, search, userPosition, nationwide]);

  // 선택된 가게 통계
  useEffect(() => {
    if (!selectedPlace) return;
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/reviews/${selectedPlace.id}/stats`);
        setPlaceStats(res.data);
      } catch (err) {
        console.error("가게 통계 불러오기 실패:", err);
        setPlaceStats(null);
      }
    };
    fetchStats();
  }, [selectedPlace]);

  // 인포윈도우 & 마커
  useEffect(() => {
    if (!selectedPlace || !map) return;

    const { x, y, place_name, road_address_name, address_name, place_url, isWishlisted, id } =
      selectedPlace;

    const position = new window.kakao.maps.LatLng(y, x);
    const marker = new window.kakao.maps.Marker({ map, position });

    // 이전 마커/윈도우 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [marker];

    const heart = isWishlisted ? "❤️" : "🤍";

    const statsHtml = placeStats
      ? `<p style="margin:4px 0;font-size:11px;">
           📌 <a href="#" id="review-count-link" style="text-decoration:underline;color:#007aff;" data-kakao-place-id="${id}">
             리뷰 ${placeStats.reviewCount}개
           </a> | 위시리스트 ${placeStats.wishlistCount}개
         </p>`
      : "";

    const iwContent = `
      <div style="position:relative;background:#fff;padding:10px 12px;border-radius:10px;max-width:230px;box-shadow:0 2px 6px rgba(0,0,0,.15);font-size:12px;line-height:1.4;">
        <button id="heart-btn" data-kakao-place-id="${id}" style="position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:16px;">${heart}</button>
        <div style="font-weight:600;margin-bottom:4px;">${place_name}</div>
        <div style="margin-bottom:4px;">${road_address_name || address_name || ""}</div>
        ${statsHtml}
        <a href="${place_url}" target="_blank" style="font-size:11px;text-decoration:underline;">카카오맵에서 보기</a>
        <button style="display:block;margin-top:8px;background:#ff4e4e;color:#fff;border:none;border-radius:6px;padding:6px 8px;font-weight:600;width:100%;"
          onclick='window.dispatchEvent(new CustomEvent("navigateToReview", { detail: ${JSON.stringify(selectedPlace)} }))'>
          리뷰 작성하기
        </button>
      </div>
    `;
    const iw = new window.kakao.maps.InfoWindow({ content: iwContent });
    iw.open(map, marker);

    const offsetLat = position.getLat() - 0.004;
    map.panTo(new window.kakao.maps.LatLng(offsetLat, position.getLng()));
    map.setLevel(3);
    map.setCenter(position);
  }, [selectedPlace, map, placeStats]);

  // 위시리스트 토글
  const handleWishlistToggle = async (placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인 후 다시 시도해주세요.");

    const prevResults = results;
    const prevSelected = selectedPlace;

    setResults((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, isWishlisted: !p.isWishlisted } : p))
    );
    setSelectedPlace((sp) =>
      sp && sp.id === placeId ? { ...sp, isWishlisted: !sp.isWishlisted } : sp
    );

    try {
      await axios.post(`/api/wishlist/${placeId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("위시리스트 토글 실패:", err);
      setResults(prevResults);
      setSelectedPlace(prevSelected);
      alert("위시리스트 변경에 실패했습니다.");
    }
  };

  // 인포윈도우 하트 & 리뷰 클릭 이벤트
  useEffect(() => {
    const onClick = async (e) => {
      // 하트
      if (e.target.id === "heart-btn") {
        const kakaoPlaceId = e.target.dataset.kakaoPlaceId;
        if (kakaoPlaceId) handleWishlistToggle(kakaoPlaceId);
      }
      // 리뷰 갯수 클릭
      if (e.target.id === "review-count-link") {
        e.preventDefault();
        const kakaoPlaceId = e.target.dataset.kakaoPlaceId;
        try {
          const res = await axios.get(`/api/reviews/restaurant/${kakaoPlaceId}`);
          setReviewList(res.data);
          setReviewPopup(true);
        } catch (err) {
          console.error("리뷰 불러오기 실패:", err);
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [results, selectedPlace]);

  // 리뷰 페이지 이동
  useEffect(() => {
    const handler = (e) => {
      const place = e.detail;
      navigate("/add-review", {
        state: {
          name: place.place_name,
          address: place.road_address_name || place.address_name,
          category: place.category_name,
          kakaoPlaceId: place.id,
          mapUrl: place.place_url,
        },
      });
    };
    window.addEventListener("navigateToReview", handler);
    return () => window.removeEventListener("navigateToReview", handler);
  }, [navigate]);

  return (
    <div className="search-page">
      <Header title="나혼자 미슐랭" showMenu={true} />

      <div className="search-content">
        <h2 className="search-title">맛집 검색하기</h2>

        <div
          className="search-input-box"
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="음식점을 검색해보세요 (2자 이상)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedPlace(null);
              setPlaceStats(null);
            }}
          />
        </div>

        <ul className="search-result-list">
          {results.map((place, i) => (
            <li
              key={`${place.id}-${i}`}
              className="search-result-item"
              ref={i === results.length - 1 ? lastPlaceRef : null}
              onClick={() => {
                setSelectedPlace(place);
                setPlaceStats(null);
              }}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <strong>{place.place_name}</strong>
              <br />
              {place.road_address_name || place.address_name}
              <button
                className="wishlist-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle(place.id);
                }}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                {place.isWishlisted ? "❤️" : "🤍"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="map-container" ref={mapRef} style={{ height: "70vh" }} />

      {/* 리뷰 모달 */}
      {reviewPopup && (
        <>
          <div className="review-popup-overlay" onClick={() => setReviewPopup(false)} />
          <div className="review-popup">
            <button onClick={() => setReviewPopup(false)}>✕</button>
            <h3>리뷰 목록</h3>
            <ul>
              {reviewList.map((r, idx) => (
                <li key={idx}>
                  <strong>{r.userName}</strong>: {r.comment}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
