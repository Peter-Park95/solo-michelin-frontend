# 🍽️ 나혼자 미슐랭 - Frontend

**혼밥도 미슐랭처럼!**  
사용자가 직접 평가한 맛집 리스트를 저장하고, 관리하는 퍼스널 맛집 관리 서비스입니다.

---

## 📌 주요 기능

- 마이페이지에서 내 맛집 리뷰 목록 확인
- 맛집 리뷰 작성, 저장, 평점 입력 (맛/서비스/분위기)
- 무한 스크롤 리스트 + 정렬/필터 (최신순, 평점순, 4.0 이상, 카테고리)
- 프로필 수정 (닉네임 / 자기소개 / 활동지역)
- 음식점 썸네일 및 간단 설명 표시

---

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 프레임워크 | React (Vite 기반) |
| 스타일링 | CSS Modules |
| HTTP 통신 | Axios |
| 라우팅 | React Router |
| 상태관리 | useState / useEffect 기반 (Context 예정) |

---

## 📂 프로젝트 구조
src/
├── pages/
│ ├── user/
│ │ ├── MyPage.jsx
│ │ └── EditProfilePage.jsx
│ ├── review/
│ │ ├── ListPage.jsx
│ │ └── ReviewAddPage.jsx
│ ├── search/
│ │ └── SearchPage.jsx
├── components/
│ └── StarRating.jsx
├── App.jsx
└── main.jsx

```markdown
## 🚀 실행 방법

```bash
npm install
npm run dev
# → http://localhost:5173


