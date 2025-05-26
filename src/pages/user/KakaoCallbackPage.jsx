import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const getToken = async () => {
      try {
        const res = await axios.get(`/api/auth/kakao/callback?code=${code}`);
        const token = res.data.token;

        localStorage.setItem("token", token);
        navigate("/mypage"); // 로그인 완료 후 이동할 경로
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
        alert("카카오 로그인 중 오류 발생");
        navigate("/");
      }
    };

    if (code) {
      getToken();
    }
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoCallbackPage;
