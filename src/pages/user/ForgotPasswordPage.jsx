import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      setMessage("재설정 링크를 이메일로 보냈어요!");
    } catch (err) {
      setMessage("이메일 전송 실패! 등록된 계정인지 확인해보세요.");
    }
  };

  return (
    <div className="form-box">
      <h2>비밀번호 찾기</h2>
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>전송</button>
      {message && <p>{message}</p>}
    </div>
  );
}