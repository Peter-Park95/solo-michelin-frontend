import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage("비밀번호가 성공적으로 변경되었습니다!");
    } catch (err) {
      setMessage("변경 실패: 유효하지 않거나 만료된 토큰입니다.");
    }
  };

  return (
    <div className="form-box">
      <h2>비밀번호 재설정</h2>
      <input
        type="password"
        placeholder="새 비밀번호 입력"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>변경</button>
      {message && <p>{message}</p>}
    </div>
  );
}