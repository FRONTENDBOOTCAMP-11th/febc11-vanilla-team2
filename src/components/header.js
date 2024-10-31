document.addEventListener("DOMContentLoaded", function () {
  const accessToken = sessionStorage.getItem("accessToken");
  let userImg = sessionStorage.getItem("userImg"); // 세션에서 프로필 이미지 경로 가져오기

  // 기본 이미지 처리
  if (!userImg || userImg === "undefined" || userImg.trim() === "") {
    userImg = null; // 기본 이미지가 사용되도록 설정
  }

  const headerUrl = accessToken
    ? "../../components/header-logged-in.html" // 로그인 상태
    : "../../components/header-logged-out.html"; // 비로그인 상태

  // 헤더 로드
  fetch(headerUrl)
    .then(response => {
      if (!response.ok) throw new Error("헤더 로드에 실패하였습니다.");
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;

      // 헤더가 로드된 후에 프로필 이미지 업데이트
      if (accessToken) {
        // 여기에서 DOM에 헤더가 삽입된 후에 이미지를 업데이트합니다.
        updateProfileImage(userImg);
      }
    })
    .catch(error => console.error("헤더 로드에 실패하였습니다", error));

  // 프로필 이미지를 업데이트하는 함수
  function updateProfileImage(imagePath) {
    // 헤더가 로드된 후에 해당 요소를 다시 선택
    const userImgSrc = document.querySelector(".bs-header__logo-src");
    if (userImgSrc) {
      const defaultImg = `https://11.fesp.shop/files/vanilla02/user-apeach.webp`;
      userImgSrc.src = imagePath
        ? `https://11.fesp.shop${imagePath}`
        : defaultImg;
    } else {
      console.error("Profile image element not found in the loaded header");
    }
  }
});
