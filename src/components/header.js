document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("../../components/header-logged-out.html")
    .then(response => {
      if (!response.ok) throw new Error("Header load failed");
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;

      // 세션 스토리지에서 accessToken 확인
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        console.log("세션 스토리지에 accessToken이 존재합니다:", accessToken);
      } else {
        console.log("세션 스토리지에 accessToken이 없습니다.");
      }
    })
    .catch(err => console.error("Failed to load header.html", err));
});
