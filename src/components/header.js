document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("../../components/header-logged-out.html")
    .then(response => {
      if (!response.ok) throw new Error("Header load failed");
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;
    })
    .catch(err => console.error("Failed to load header.html", err));
});
