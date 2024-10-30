import axios from "axios";

const apiUrl = "https://11.fesp.shop";
const clientId = "vanilla02";

const accessToken = sessionStorage.getItem("accessToken");

// 로그인 체크 및 페이지 렌더링
window.addEventListener("load", async () => {
  if (!accessToken) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    window.location.href = "/src/pages/login/login.html";
  } else {
    // 로그인 되어있을 때 페이지 그려주기
    await rednerFavAuthor();
    await rednerMyBrunch();
  }
});

// DOM Node
const $favAuthorList = document.querySelector(".fav-author__list");
const $recentViewList = document.querySelector(".recent-view__list");
const $favArticleList = document.querySelector(".fav-article__list");
const $myBrunchList = document.querySelector(".my-brunch__lists");

// Render Function
// 관심 작가
const rednerFavAuthor = async () => {
  console.log(sessionStorage.getItem("userId"));
};

// 내 브런치
const rednerMyBrunch = async () => {
  try {
    const response = await axios.get(`${apiUrl}/posts/users`, {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const myBrunches = response.data.item;
    console.log(myBrunches);
    $myBrunchList.innerHTML = myBrunches
      .map(myBrunch => {
        return `
        <li class="my-brunch__list" data-id="${myBrunch._id}">
          <h3 class="my-brunch__subTitle">${myBrunch.subTitle}</h3>
          <p class="my-brunch__title">${myBrunch.title}</p>
          <p class="my-brunch__createdAt">${formatDate(myBrunch.createdAt)}</p>
        </li>
      `;
      })
      .join("");

    document.querySelectorAll(".my-brunch__list").forEach(myBrunchList => {
      myBrunchList.addEventListener("click", handleMyBrunch);
    });
  } catch (error) {
    console.log(error);
  }
};

// Callback Function
// 관심 작가 페이지 이동
const handleFavAuthor = () => {};

// 최근 본 브런치 상세페이지로 이동
const handleRecentView = () => {};

// 관심 글 브런치 상세페이지로 이동
const handleFavArticle = () => {};

// 내 브런치 상세페이지로 이동
const handleMyBrunch = event => {
  const myBrunchListId = event.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/detailPage/detailPage.html?id=${myBrunchListId}`;
};

// Formatting Function
// 날짜 형식 변환 함수
const formatDate = createdAt => {
  const date = new Date(createdAt);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options).replace(",", " /");
};
