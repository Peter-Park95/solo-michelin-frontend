import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token && token.startsWith("ey")) {
      localStorage.setItem("token", token);
      navigate("/mypage");
    } else {
      console.error("토큰 없음 또는 잘못된 토큰:", token);
      alert("로그인 실패");
      navigate("/");
    }
  }, [location, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoRedirectHandler;
