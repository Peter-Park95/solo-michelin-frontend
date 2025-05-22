// src/pages/SearchPage.jsx
import React from "react";
import "./SearchPage.css";

const SearchPage = () => {
  return (
    <div className="search-page">
      {/* ✅ 상단 제목 */}
      <h2 className="search-title">맛집 검색하기</h2>

      {/* 검색 입력창 */}
      <div className="search-input-box">
        <input type="text" placeholder="음식점을 검색해보세요" />
      </div>

{/*        */}{/* 필터 버튼들 */}
{/*       <div className="filter-buttons"> */}
{/*         {["필터", "내 주변", "지역", "음식 종류", "혜택", "가격"].map((name, i) => ( */}
{/*           <button key={i} className="filter-btn"> */}
{/*             {name} */}
{/*           </button> */}
{/*         ))} */}
{/*       </div> */}

{/*        */}{/* 추천 카드 리스트 */}
{/*       <div className="recommend-section"> */}
{/*         <h3>이런 곳 어때요?</h3> */}
{/*         <div className="card-list"> */}
{/*            */}{/* 추후 map으로 대체 */}
{/*           <div className="recommend-card"> */}
{/*             <img src="/icons/steak.jpg" alt="추천" /> */}
{/*             <div className="title">분위기 좋은 스테이크</div> */}
{/*           </div> */}
{/*         </div> */}
{/*       </div> */}

      {/* 하단 고정 검색 버튼 */}
      <button className="search-bottom-btn">검색</button>
    </div>
  );
};

export default SearchPage;
