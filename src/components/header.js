document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" ||
    sessionStorage.getItem("accessToken") !== null;

  // 로그인 상태 출력
  console.log("isLoggedIn:", isLoggedIn);
  console.log(
    "Local Storage - isLoggedIn:",
    localStorage.getItem("isLoggedIn"),
  );
  console.log(
    "Session Storage - accessToken:",
    sessionStorage.getItem("accessToken"),
  );

  if (isLoggedIn) {
    console.log("로그인 상태입니다.");
    // 로그인 상태일 때 메인 페이지로
    window.location.href = "/src/pages/main/main.html";
    return;
  } else {
    console.log("로그인 되어 있지 않습니다.");
  }

  // 로그인 상태가 아닐 때 헤더 파일 경로 설정
  const headerPath = "../../components/header-logged-out.html";

  // Load header
  fetch(headerPath)
    .then(response => {
      if (!response.ok) throw new Error("Header load failed");
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;
      const startBtn = document.querySelector("#start-btn");
      if (startBtn) {
        startBtn.addEventListener("click", function (e) {
          e.preventDefault();
          // 로그인 페이지로 이동
          window.location.href = "/src/pages/login/login.html";
        });
      }
    })
    .catch(err => console.error("Failed to load header:", err));
});
