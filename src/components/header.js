document.addEventListener("DOMContentLoaded", function () {
  const accessToken = sessionStorage.getItem("accessToken");
  const userImg = sessionStorage.getItem("userImg"); // 세션에서 프로필 이미지 경로 가져오기
  const headerUrl = accessToken
    ? "../../components/header-logged-in.html" // 로그인 상태
    : "../../components/header-logged-out.html"; // 비로그인 상태

  // 헤더 로드
  fetch(headerUrl)
    .then(response => {
      if (!response.ok) throw new Error("Header load failed");
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;

      // 프로필 이미지 업데이트 (세션에 저장된 이미지 사용)
      if (accessToken && userImg) {
        updateProfileImage(userImg);
      }
    })
    .catch(err => console.error("Failed to load header", err));

  // 프로필 이미지를 업데이트하는 함수
  function updateProfileImage(imagePath) {
    const userImgSrc = document.querySelector(".bs-header__logo-src");
    if (userImgSrc) {
      userImgSrc.src = `https://11.fesp.shop${imagePath}`; // 절대 경로로 설정
      userImgSrc.alt = "User Profile Image";
    }
  }
});
