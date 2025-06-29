import { useState } from "react";
import axios from "axios";

export default function FindEmailPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleFindEmail = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/find-email", {
        username
      });
      setEmail(res.data.email);
      setError("");
    } catch (err) {
      setError("닉네임으로 이메일을 찾을 수 없습니다.");
      setEmail("");
    }
  };

  return (
    <div className="form-box">
      <h2>이메일 찾기</h2>
      <input
        type="text"
        placeholder="닉네임 입력"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleFindEmail}>이메일 찾기</button>
      {email && <p>이메일: {email}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}