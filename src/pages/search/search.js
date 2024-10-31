import axios from "axios";

const clientId = "vanilla02";

// DOM Node Reference
const $searchInput = document.querySelector(".search-query__input");
const $btnClear = document.querySelector(".search-query__button-clear");
const $noInputSection = document.querySelector(".search-contents__no-input");
const $searchTab = document.querySelector(".search-tab");
const $searchTabArticle = document.querySelector(".search-tab__item-article");
const $searchTabAuthor = document.querySelector(".search-tab__item-author");
const $resultArticles = document.querySelector(".result-articles");
const $resultAuthors = document.querySelector(".result-authors");
const $sectionDismatch = document.querySelector(".search-contents__dismatch");

const handleSearchInput = () => {
  const query = $searchInput.value.trim();
  $btnClear.style.display = query ? "block" : "none";
  $noInputSection.style.display = query ? "none" : "block";

  if (!query) {
    $resultArticles.innerHTML = "";
    $resultAuthors.innerHTML = "";
    $searchTab.style.display = "none";
    hideNoResults();
  } else {
    $noInputSection.style.display = "none";
    toggleSearchTab(query);
    activateTab(currentTab);
  }
};

const handleBtnClear = () => {
  $searchInput.value = "";
  $btnClear.style.display = "none";
  $searchTab.style.display = "none";
  $noInputSection.style.display = "block";
  $resultArticles.innerHTML = "";
  $resultAuthors.innerHTML = "";
  hideNoResults();
};

const handleArticleTabClick = () => {
  $resultAuthors.innerHTML = "";
  activateTab("article");
};

const handleAuthorTabClick = () => {
  $resultArticles.innerHTML = "";
  activateTab("author");
};

const handleArticlesListClick = event => {
  const articlesListId = event.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/detailPage/detailPage.html?id=${articlesListId}`;
};

const handleAuthorsListClick = event => {
  const authorsListId = event.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/author/author.html?id=${authorsListId}`;
};

let currentTab = "article";
const activateTab = tab => {
  currentTab = tab;
  if (tab === "article") {
    $searchTabArticle.classList.add("search-tab__item--active");
    $searchTabAuthor.classList.remove("search-tab__item--active");
    getArticles($searchInput.value.trim());
  } else if (tab === "author") {
    $searchTabArticle.classList.remove("search-tab__item--active");
    $searchTabAuthor.classList.add("search-tab__item--active");
    getAuthors($searchInput.value.trim());
  }
};

const toggleSearchTab = query => {
  $searchTab.style.display = query ? "flex" : "none";
  if (query && currentTab !== "author") {
    activateTab("article");
  }
};

const formatDate = dateStr => {
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const highlightQuery = (text, query) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`\\b${query}\\b`, "gi");
  return text.replace(regex, `<span class="highlight">${query}</span>`);
};

const renderArticlesResults = articles => {
  if (articles.length > 0) {
    $resultArticles.innerHTML = articles
      .map(article => {
        const articleImage =
          article.image && article.image.length > 0
            ? `https://11.fesp.shop/${article.image[0]}`
            : null;

        return `
        <div class="search-results">
          <div class="search-results__meta">글 검색 결과 ${articles.length}건</div>
          <div class="search-results__sort">
            <button type="button" class="search-results__sort-relevance">
              정확도
            </button>
            <button type="button" class="search-results__sort-latest">
              최신
            </button>
          </div>
        </div>
        <div class="result-articles__lists" data-id="${article._id}">
          <h3 class="result-articles__title">
            ${highlightQuery(article.title, $searchInput.value.trim())}
          </h3>
          <div class="result-articles__list">
            <div class="result-articles__description">
              <p class="result-articles__excerpt">
              ${highlightQuery(article.content, $searchInput.value.trim())}
              </p>
              <span class="result-articles__date">${formatDate(article.createdAt)}</span>
              <span class="result-articles__author">by ${article.user.name}</span>
            </div>
            <div class="result-articles__image">
              ${articleImage ? `<img src="${articleImage}" alt="${article.user.name}의 이미지" />` : ""}
            </div>
          </div>
        </div>
      `;
      })
      .join("");
    $resultArticles.style.display = "block";
    $sectionDismatch.style.display = "none";

    document
      .querySelectorAll(".result-articles__lists")
      .forEach(articlesList => {
        articlesList.addEventListener("click", handleArticlesListClick);
      });
  } else {
    $resultArticles.innerHTML = "";
    $resultArticles.style.display = "none";
    renderNoResults();
  }
};

const renderAuthorsResults = authors => {
  if (authors.length > 0) {
    $resultAuthors.innerHTML = authors
      .map(author => {
        return `
          <div class="search-results__meta">작가 검색 결과 ${authors.length}건</div>
          <div class="result-authors__lists" data-id=${author._id}>
            <div class="result-authors__list">
              <div class="result-authors__image">
                <img src="https://11.fesp.shop/files/${clientId}/user-apeach.webp" alt="${author.name}의 이미지" />
              </div>
              <h3 class="result-authors__name">${highlightQuery(author.name, $searchInput.value.trim())}</h3>
            </div>
          </div>
      `;
      })
      .join("");
    $resultAuthors.style.display = "block";
    document.querySelector(".search-contents__articles").style.display = "none";
    $sectionDismatch.style.display = "none";

    document.querySelectorAll(".result-authors__lists").forEach(authorsList => {
      authorsList.addEventListener("click", handleAuthorsListClick);
    });
  } else {
    $resultAuthors.innerHTML = "";
    $resultAuthors.style.display = "none";
    renderNoResults();
  }
};

const renderNoResults = () => {
  $sectionDismatch.innerHTML = `
    <div class="result-dismatch">
      <div class="result-dismatch__image">
        <img src="/assets/images/img-dismatch.svg" alt="검색 결과가 없습니다." />
      </div>
      <h3 class="result-dismatch__description">검색 결과가 없습니다.</h3>
    </div>
  `;
  $sectionDismatch.style.display = "block";
  $resultArticles.style.display = "none";
  $resultAuthors.style.display = "none";
};

const hideNoResults = () => {
  $sectionDismatch.innerHTML = "";
  $sectionDismatch.style.display = "none";
};

const toggleNoResults = hasResult => {
  if (hasResult) {
    hideNoResults();
  } else {
    renderNoResults();
  }
};

const getArticles = async keyword => {
  try {
    const response = await axios.get(
      `https://11.fesp.shop/posts?keyword=${keyword}`,
      {
        headers: {
          "Content-Type": "application/json",
          "client-id": clientId,
        },
      },
    );
    const articles = response.data.item;
    if (articles.length > 0) {
      renderArticlesResults(articles);
      toggleNoResults(true);
    } else {
      renderArticlesResults([]);
      toggleNoResults(false);
    }
  } catch (error) {
    console.log(error);
  }
};

const getAuthors = async name => {
  try {
    const response = await axios.get(
      `https://11.fesp.shop/users?name=${name}`,
      {
        headers: {
          "Content-Type": "application/json",
          "client-id": "vanilla02",
        },
      },
    );
    const authors = response.data.item;
    if (authors.length > 0) {
      renderAuthorsResults(authors);
      toggleNoResults(true);
    } else {
      renderAuthorsResults([]);
      toggleNoResults(false);
    }
  } catch (error) {
    console.log(error);
  }
};

$searchInput.addEventListener("input", handleSearchInput);
$btnClear.addEventListener("click", handleBtnClear);
$searchTabArticle.addEventListener("click", handleArticleTabClick);
$searchTabAuthor.addEventListener("click", handleAuthorTabClick);

window.addEventListener("pageshow", () => {
  $searchInput.value = "";
  $searchInput.focus();
  $btnClear.style.display = "none";
});
