// src/components/Header.jsx
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="global-header">
      <img src="/public/login_logo.png" alt="로고" className="header-logo" />

      <div className="header-title-wrapper">
        <h1 className="header-title">나혼자 미슐랭</h1>
      </div>

      <div className="menu-icon" className="menu-icon disabled"  >☰</div>
    </header>
  );
};

export default Header;
