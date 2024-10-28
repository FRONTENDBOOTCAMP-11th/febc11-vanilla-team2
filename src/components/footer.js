document.addEventListener("DOMContentLoaded", function () {
  // Load footer
  fetch("../../components/footer.html")
    .then(response => {
      if (!response.ok) throw new Error("Footer load failed");
      return response.text();
    })
    .then(data => {
      document.querySelector(".footer").innerHTML = data;

      // footer load 후 init 함수 호출
      init();
    })
    .catch(err => console.error("Failed to load footer.html", err));
});

function init() {
  const currentUrl = window.location.href.split("#")[0]; // url 해시 제거해서 비교
  const footerLinks = document.querySelectorAll(".bs-footer__link");

  footerLinks.forEach(link => {
    if (link.href === currentUrl) {
      const img = link.querySelector("img");
      img.src = link.getAttribute("data-icon-on");
      img.alt = img.alt.replace("off", "on");
      link.querySelector(".bs-footer__title").classList.add("active");
    } else {
      const img = link.querySelector("img");
      img.src = link.getAttribute("data-icon-off");
      img.alt = img.alt.replace("on", "off");
    }
  });
}
