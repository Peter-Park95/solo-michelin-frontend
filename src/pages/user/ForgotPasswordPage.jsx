import React, { useState } from "react";
import axios from "axios";
import "./ForgotPasswordPage.css";
import { useSearchParams, useNavigate  } from "react-router-dom";

const FindPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendAuth = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      alert("비밀번호 재설정 메일이 전송되었습니다.");
    } catch (err) {
      console.error("이메일 인증 실패:", err);
      alert(err.response?.data?.message || "이메일 전송 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="findpw-page">
      <h2 className="title">비밀번호 찾기</h2>

      <div className="form-group-inline">
        <label htmlFor="email">이메일</label>
        <div className="email-input-wrapper">
          <input
            id="email"
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button className="auth-button" onClick={handleSendAuth}>
            인증하기
          </button>
        </div>
      </div>

      <button className="forgot-email-button" onClick={() => navigate("/find-email")}>
        이메일을 잊어버렸어요
      </button>
    </div>
  );
};

export default FindPasswordPage;