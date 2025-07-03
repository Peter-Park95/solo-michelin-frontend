// import { useState } from "react";
// import axios from "axios";
//
// export default function FindEmailPage() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//
//   const handleFindEmail = async () => {
//     try {
//       const res = await axios.post("http://localhost:8080/api/auth/find-email", {
//         username
//       });
//       setEmail(res.data.email);
//       setError("");
//     } catch (err) {
//       setError("닉네임으로 이메일을 찾을 수 없습니다.");
//       setEmail("");
//     }
//   };
//
//   return (
//     <div className="form-box">
//       <h2>이메일 찾기</h2>
//       <input
//         type="text"
//         placeholder="닉네임 입력"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <button onClick={handleFindEmail}>이메일 찾기</button>
//       {email && <p>이메일: {email}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import "./FindEmailPage.css";

const FindEmailPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleFindEmail = async () => {
    if (!name || !phone) {
      alert("이름과 전화번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("/api/users/find-email", {
        name,
        phone,
      });
      alert(`가입된 이메일: ${res.data.email}`);
    } catch (err) {
      console.error("이메일 찾기 실패:", err);
      alert(err.response?.data?.message || "이메일 찾기 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="findemail-page">
      <h2 className="title">이메일 찾기</h2>

      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
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
          autoComplete="tel"
        />
      </div>

      <button className="find-button" onClick={handleFindEmail}>
        이메일 찾기
      </button>
    </div>
  );
};

export default FindEmailPage;
