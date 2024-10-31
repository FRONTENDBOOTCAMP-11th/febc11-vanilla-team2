document.addEventListener("DOMContentLoaded", function () {
  const headerUrl = "../../components/header-logged";

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
