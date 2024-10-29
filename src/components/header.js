document.addEventListener("DOMContentLoaded", function () {
  const accessToken = sessionStorage.getItem("accessToken");
  const headerUrl = accessToken
    ? "../../components/header-logged-in.html" // 로그인 상태
    : "../../components/header-logged-out.html"; // 비로그인 상태

  // Load header
  fetch(headerUrl)
    .then(response => {
      if (!response.ok) throw new Error("Header load failed");
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;
    })
    .catch(err => console.error("Failed to load header", err));
});
