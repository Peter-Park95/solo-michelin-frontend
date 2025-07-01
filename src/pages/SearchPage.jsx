import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./SearchPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // 현재 위치 받아오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보 오류:", error);
        }
      );
    }
  }, []);

  // Kakao Map SDK 동적 로딩 및 지도 렌더링
  useEffect(() => {
    const loadMap = () => {
      if (window.kakao && window.kakao.maps && userPosition && mapRef.current) {
        console.log("✅ 지도 렌더링 시작");
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng),
          level: 4,
        });

        results.forEach((place) => {
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            setSelectedPlace(place);
          });
        });
      }
    };

    const loadScript = () => {
      if (document.getElementById("kakao-map-script")) {
        loadMap();
        return;
      }

      const script = document.createElement("script");
      script.id = "kakao-map-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=fc5b157ce2160cc865ad60ccf8d2fa72&libraries=services`;
      script.async = true;
      script.onload = () => {
        console.log("✅ Kakao Maps SDK 로드됨");
        loadMap();
      };
      script.onerror = () => {
        console.error("❌ Kakao Maps SDK 로딩 실패");
      };
      document.head.appendChild(script);
    };

    if (userPosition) {
      loadScript();
    }
  }, [results, userPosition]);

  // 검색
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

      <div
        className="map-container"
        ref={mapRef}
        style={{ width: "100%", height: "300px", borderRadius: "16px", marginTop: "30px" }}
      ></div>
    </div>
  );
};

export default SearchPage;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SearchPage.css";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
//
// const SearchPage = () => {
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const fetchData = async () => {
//       if (search.length < 2) {
//         setResults([]);
//         return;
//       }
//
//       try {
//         const res = await axios.get(`/api/kakao-search?query=${search}`);
//         const sliced = res.data.documents.slice(0, 3);
//         setResults(sliced);
//       } catch (error) {
//         console.error("검색 실패:", error);
//       }
//     };
//
//     const delay = setTimeout(() => fetchData(), 300);
//     return () => clearTimeout(delay);
//   }, [search]);
//
//   return (
//     <div className="search-page">
//       <Header title="나혼자 미슐랭" showMenu={true} />
//       <h2 className="search-title">맛집 검색하기</h2>
//
//       <div className="search-input-box">
//         <input
//           type="text"
//           placeholder="음식점을 검색해보세요"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setSelectedPlace(null);
//           }}
//         />
//       </div>
//
//       <ul className="search-result-list">
//         {results.map((place, i) => (
//           <li
//             key={i}
//             className="search-result-item"
//             onClick={() => setSelectedPlace(place)}
//           >
//             <strong>{place.place_name}</strong>
//             <br />
//             {place.road_address_name}
//           </li>
//         ))}
//       </ul>
//
//       {selectedPlace && (
//         <div className="selected-place-card">
//           <div className="place-info">
//             <h3>{selectedPlace.place_name}</h3>
//             <p>{selectedPlace.road_address_name}</p>
//             <p>{selectedPlace.category_name}</p>
//           </div>
//           <button
//             className="review-btn"
//             onClick={() =>
//               navigate("/add-review", {
//                 state: {
//                   name: selectedPlace.place_name,
//                   address: selectedPlace.road_address_name,
//                   category: selectedPlace.category_name,
//                   kakaoPlaceId: selectedPlace.id,
//                   mapUrl: selectedPlace.place_url,
//                 },
//               })
//             }
//           >
//             리뷰 작성하기
//           </button>
//         </div>
//       )}
//
//       <div className="map-coming-soon">
//         <div className="map-spinner"></div>
//         <p className="map-text">🔧 MAP 기능 개발 중이에요!</p>
//       </div>
//     </div>
//   );
// };
//
// export default SearchPage;
