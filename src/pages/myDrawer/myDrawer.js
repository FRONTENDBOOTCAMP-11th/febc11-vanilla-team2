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
    await renderFavAuthor();
    await renderFavArticle();
    await renderMyBrunch();
    renderRecentView();
  }
});

// DOM Node
const $favAuthorList = document.querySelector(".fav-author__lists");
const $recentViewList = document.querySelector(".recent-view__lists");
const $favArticleList = document.querySelector(".fav-article__lists");
const $myBrunchList = document.querySelector(".my-brunch__lists");

// Render Function
// 관심 작가 렌더링
const renderFavAuthor = async () => {
  try {
    const response = await axios.get(`${apiUrl}/bookmarks/user`, {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const favAuthors = response.data.item;
    $favAuthorList.innerHTML = favAuthors
      .map(favAuthor => {
        console.log(favAuthor);
        return `
        <li class="fav-author__list" data-id="${favAuthor.user._id}">
          <img class="fav-author__avatar" src="../../assets/images/img-author-1.svg" alt="Grace" />
          <h4 class="fav-author__name">${favAuthor.user.name}</h4>
        </li>
      `;
      })
      .join("");

    document.querySelectorAll(".fav-author__list").forEach(favAuthorList => {
      favAuthorList.addEventListener("click", handleFavAuthor);
    });
  } catch (error) {
    console.log(error);
  }
};

// 최근 본 렌더링
const renderRecentView = () => {
  const recentPosts = JSON.parse(sessionStorage.getItem("savedPosts")) || [];

  $recentViewList.innerHTML = recentPosts
    .map(recentPost => {
      return `
      <li class="recent-view__list" data-id="${recentPost.id}">
        <img class="recent-view__book-thumbnail" src="../../assets/images/img-book-9.svg" alt="book-1.svg" />
          <h3 class="recent-view__title">${recentPost.title}</h3>
          <p class="recent-view__author"><em>by</em> ${recentPost.author}</p>
      </li>
      `;
    })
    .join("");

  document.querySelectorAll(".recent-view__list").forEach(favArticleList => {
    favArticleList.addEventListener("click", handleRecentView);
  });
};

// 관심 글 렌더링
const renderFavArticle = async () => {
  try {
    const response = await axios.get(`${apiUrl}/bookmarks/post`, {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const favArticles = response.data.item;
    $favArticleList.innerHTML = favArticles
      .map(favArticle => {
        return `
        <li class="fav-article__list" data-id="${favArticle.post._id}">
          <img class="fav-article__book-thumbnail" src="../../assets/images/img-book-9.svg" alt="book-1.svg" />
          <h3 class="fav-article__title">${favArticle.post.title}</h3>
          <p class="fav-article__author"><em>by</em> ${favArticle.post.user.name}</p>
        </li>
        `;
      })
      .join("");

    document.querySelectorAll(".fav-article__list").forEach(favArticleList => {
      favArticleList.addEventListener("click", handleFavArticle);
    });
  } catch (error) {
    console.log(error);
  }
};

// 내 브런치 렌더링
const renderMyBrunch = async () => {
  try {
    const response = await axios.get(`${apiUrl}/posts/users`, {
      headers: {
        "Content-Type": "application/json",
        "client-id": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const myBrunches = response.data.item;
    $myBrunchList.innerHTML = myBrunches
      .map(myBrunch => {
        return `
        <li class="my-brunch__list" data-id="${myBrunch._id}">
          <h3 class="my-brunch__subTitle">${myBrunch.extra.subTitle}</h3>
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
const handleFavAuthor = event => {
  const favAuthorId = event.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/author/author.html?id=${favAuthorId}`;
};

// 최근 본 브런치 상세페이지로 이동
const handleRecentView = event => {
  const recentViewListId = event.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/detailPage/detailPage.html?id=${recentViewListId}`;
};

// 관심 글 브런치 상세페이지로 이동
const handleFavArticle = event => {
  const favArticleListId = event.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/detailPage/detailPage.html?id=${favArticleListId}`;
};

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
