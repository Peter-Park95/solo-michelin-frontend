// src/components/BottomTab.js
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import "./BottomTab.css";

const BottomTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-tab">
      <div className={`tab-item ${isActive("/") ? "active" : ""}`} onClick={() => navigate("/")}>
        <span className="icon">🏠</span>
        <span className="label">홈</span>
      </div>
      <div className={`tab-item ${isActive("/search") ? "active" : ""}`} onClick={() => navigate("/search")}>
        <span className="icon">🔍</span>
        <span className="label">검색</span>
      </div>
      <div className={`tab-item ${isActive("/list") ? "active" : ""}`} onClick={() => navigate("/list")}>
        <span className="icon">❤️</span>
        <span className="label">내 리스트</span>
      </div>
      <div className={`tab-item ${isActive("/mypage") ? "active" : ""}`} onClick={() => navigate("/mypage")}>
        <span className="icon">👤</span>
        <span className="label">마이페이지</span>
      </div>
    </div>
  );
};

export default BottomTab;
