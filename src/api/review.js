import axios from "axios";

const BASE_URL = "http://localhost:8080"; // 추후 실제 주소로 변경 !

export const getMyReviews = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/reviews/user/${userId}`);
    console.log("리뷰 API 응답:", res);
    return res.data;
  } catch (err) {
    console.error("내 리뷰 목록 조회 실패:", err);
    return [];
  }
};
