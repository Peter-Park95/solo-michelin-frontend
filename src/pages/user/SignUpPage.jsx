import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSignUp = async () => {
    if (!email || !nickname || !password || !passwordConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("/api/users", {
        email,
        username: nickname,
        password,
      });
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/mypage");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <h2 className="title">회원가입</h2>

      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <button className="signup-button" onClick={handleSignUp}>
        회원가입
      </button>
    </div>
  );
};

export default SignUpPage;
