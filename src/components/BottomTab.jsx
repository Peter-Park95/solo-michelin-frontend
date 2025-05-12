// src/components/BottomTab.js
import React from "react";
import "./BottomTab.css";

const BottomTab = () => {
  return (
    <div className="bottom-tab">
      <div className="tab-item">🏠<br />홈</div>
      <div className="tab-item">🔍<br />검색</div>
      <div className="tab-item">🔖<br />내 리스트</div>
      <div className="tab-item">👤<br />마이페이지</div>
    </div>
  );
};

export default BottomTab;
