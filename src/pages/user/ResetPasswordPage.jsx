import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("모든 필드를 입력해주세요.");
      setSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      setSuccess(false);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage("비밀번호가 성공적으로 변경되었습니다!");
      setSuccess(true);
    } catch (err) {
      setMessage("변경 실패: 유효하지 않거나 만료된 토큰입니다.");
      setSuccess(false);
    }
  };

  return (
    <div className="resetpw-page">
      <h2 className="title">비밀번호 재설정</h2>

      <div className="form-group">
        <label htmlFor="newPassword">새 비밀번호</label>
        <input
          id="newPassword"
          type="password"
          placeholder="새 비밀번호 입력"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="비밀번호 다시 입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <button className="reset-button" onClick={handleReset}>
        비밀번호 변경
      </button>

      {message && (
        <div className={`result-box ${success ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
