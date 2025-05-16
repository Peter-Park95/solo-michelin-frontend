import React, { useEffect, useState } from "react"; // ✅ useEffect 추가
import "./EditProfilePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");       // ✅ 초기값 비움
  const [introduction, setIntroduction] = useState("");
  const [region, setRegion] = useState("");

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/api/users/5");
        setNickname(res.data.username);                     // ✅ nickname → username
        setIntroduction(res.data.introduction || "");
        setRegion(res.data.region || "");
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("/api/users/5", {
          username: nickname,
          password: "1234",               // 임시 값
          email: "test01@google.com",      // 임시 값
          profileImage: "",
          introduction,
          region
      });
      alert("프로필이 저장되었습니다.");
      navigate("/mypage");
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  return (
    <div className="edit-profile-page">
      <h2 className="title">← 프로필 수정</h2>

      <div className="profile-img-upload">
        <div className="profile-img">🙎‍♂️</div>
        <button className="edit-icon">✏</button>
      </div>

      <div className="form-group">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>자기 소개</label>
        <textarea
          placeholder="자신을 알릴 수 있는 소개글을 작성해 주세요."
          maxLength={35}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
        <div className="char-count">{introduction.length}/35자</div>
      </div>

      <div className="form-group">
        <label>활동 지역</label>
        <input
          type="text"
          placeholder="예: 서울 강남구"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>

      <button className="save-button" onClick={handleSave}>저장</button>
    </div>
  );
};

export default EditProfilePage;
