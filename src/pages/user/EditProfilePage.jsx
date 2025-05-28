import React, { useEffect, useState } from "react";
import "./EditProfilePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [region, setRegion] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    } catch (err) {
      console.error("토큰 디코딩 실패:", err);
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        const data = res.data;
        setNickname(data.username || "");
        setEmail(data.email || "");
        setIntroduction(data.introduction || "");
        setRegion(data.region || "");
        setProfileImageUrl(data.profileImage || "");
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    const formData = new FormData();
    formData.append("username", nickname);
    formData.append("email", email);
    formData.append("introduction", introduction);
    formData.append("region", region);
    if (profileImageFile) {
      formData.append("image", profileImageFile);
    }

    try {
      await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("프로필이 저장되었습니다.");
      navigate("/mypage");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="edit-profile-page">
      <h2 className="title">← 프로필 수정</h2>

      <div className="profile-img-upload">
        <div className="profile-img">
          <img
            src={profileImageUrl || "/default_profile.png"}
            alt="프로필"
            className="profile-avatar"
          />
        </div>
        <button
          className="edit-icon"
          onClick={() => document.getElementById("profileImgInput").click()}
        >
          ✏
        </button>
        <input
          type="file"
          accept="image/*"
          id="profileImgInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>

      <div className="form-group">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          disabled
          style={{ backgroundColor: "#f2f2f2", cursor: "not-allowed" }}
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
