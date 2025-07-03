import React, { useState } from "react";
import axios from "axios";
import "./FindEmailPage.css";
import {useNavigate} from "react-router-dom";

const FindEmailPage = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFindEmail = async () => {
    if (!username || !phone) {
      setError("이름과 전화번호를 모두 입력해주세요.");
      setEmail("");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/find-email", {
        username,
        phone,
      });
      setEmail(res.data.email);
      setError("");
    } catch (err) {
      setEmail("");
      setError(err.response?.data?.message || "이메일 찾기 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="findemail-page">
      <h2 className="title">이메일 찾기</h2>

      <div className="form-group">
        <label htmlFor="username">이름</label>
        <input
          id="username"
          type="text"
          placeholder="이름 입력"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">전화번호</label>
        <input
          id="phone"
          type="tel"
          placeholder="전화번호 입력 (예: 010-1234-5678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button className="find-button" onClick={handleFindEmail}>
        이메일 찾기
      </button>

      {/* ✅ 이메일 결과 박스 */}
      {email && (
        <div className="result-box success">
          가입된 이메일: <strong>{email}</strong>
        </div>
      )}

      {error && <div className="result-box error">{error}</div>}
    <button className="forgot-email-button" onClick={() => navigate("/forgot-password")}>
      비밀번호 찾으러가기
    </button>
    </div>
  );
};

export default FindEmailPage;
