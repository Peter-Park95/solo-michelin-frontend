// import { useState } from "react";
// import axios from "axios";
//
// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//
//   const handleSubmit = async () => {
//     try {
//       await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
//       setMessage("재설정 링크를 이메일로 보냈어요!");
//     } catch (err) {
//       setMessage("이메일 전송 실패! 등록된 계정인지 확인해보세요.");
//     }
//   };
//
//   return (
//     <div className="form-box">
//       <h2>비밀번호 찾기</h2>
//       <input
//         type="email"
//         placeholder="이메일 입력"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button onClick={handleSubmit}>전송</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }


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
      await axios.post("/api/users/password-reset", { email });
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