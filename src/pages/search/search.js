import axios from "axios";

/* 발견 페이지 기능 정리
  1. 검색어 입력 처리
    1.1 검색어 입력 시 "x" 버튼 동적 생성
    1.2 검색어 입력 시 "글 / 작가" 탭 생성
    1.3. 입력된 검색어로 API 호출
  3. 글 탭 클릭 시 입력된 검색어 기반으로 결과 뿌려주기
  4. 작가 탭 클릭 시 입력된 검색어 기반ㅇ로 작가 뿌려주기
  5. 입력된 검색어에 일치하는 글/작가 없을 시 결과 없음 페이지 뿌려주기
*/

const clientId = "vanilla02";

// DOM Node Reference
const $searchInput = document.querySelector(".search-query__input");
const $btnClear = document.querySelector(".search-query__button-clear");
const $noInputSection = document.querySelector(".search-contents__no-input");
const $searchTab = document.querySelector(".search-tab");
const $searchTabArticle = document.querySelector(".search-tab__item-article");
const $searchTabAuthor = document.querySelector(".search-tab__item-author");

const $resultArticles = document.querySelector(".result-articles");

const $sectionDismatch = document.querySelector(".search-contents__dismatch");

// Callback Function
// 검색어 입력 처리 함수
const handleSearchInput = () => {
  const query = $searchInput.value.trim();

  // "x" 버튼 처리
  $btnClear.style.display = query ? "block" : "none";

  $noInputSection.style.display = query ? "none" : "block";

  // 글 & 작가 탭 토글 처리
  toggleSearchTab(query);

  if (!query) {
    $noInputSection.style.display = "block";
    hideNoResults();
  } else {
    $noInputSection.style.display = "none";
    toggleSearchTab(query);
  }
};

// "x" 버튼 처리 함수
const handleBtnClear = () => {
  $searchInput.value = "";
  renderArticlesResults([]); // 검색 결과 지우기
  handleSearchInput();
};

// 글 탭 클릭 시 처리 함수
const handleArticleTabClick = () => {
  activateTab("article");
};

// 작가 탭 클릭 시 처리 함수
const handleAuthorTabClick = () => {
  activateTab("author");
};

// 글 & 작가 탭 토글 처리 함수
const toggleSearchTab = query => {
  $searchTab.style.display = query ? "flex" : "none";
  if (query) {
    activateTab("article");
  }
};

// 탭 활성화 처리 함수
const activateTab = tab => {
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

const formatDate = dateStr => {
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const renderArticlesResults = articles => {
  $resultArticles.innerHTML = articles
    .map(
      article =>
        `
      <div class="result-articles__lists">
        <h3 class="result-articles__title">
          ${article.title}
        </h3>
        <div class="result-articles__list">
          <div class="result-articles__description">
            <p class="result-articles__excerpt">
              ${article.content}
            </p>
            <span class="result-articles__date">${formatDate(article.createdAt)}</span>
            <span class="result-articles__author">by ${article.user.name}</span>
          </div>
          <div class="result-articles__image">
            <img src="https://11.fesp.shop/files/${clientId}/user-muzi.webp" alt="${article.user.name}의 이미지" />
          </div>
        </div>
      </div>
    `,
    )
    .join("");
};

const renderAuthorsResults = authors => {
  $resultArticles.innerHTML = ``;
};

// 검색 결과가 없습니다 화면 그려주는 함수
const renderNoResults = hasResult => {
  $sectionDismatch.innerHTML = `
    <div class="result-dismatch">
      <div class="result-dismatch__image">
        <img src="../../assets/images/img-dismatch.svg" alt="검색 결과가 없습니다." />
      </div>
      <h3 class="result-dismatch__description">검색 결과가 없습니다.</h3>
    </div>
  `;
  $sectionDismatch.style.display = "block";
};

// 검색 결과 없음 내용 지우기 및 섹션 숨기기
const hideNoResults = () => {
  $sectionDismatch.innerHTML = "";
  $sectionDismatch.style.display = "none";
};

// 검색 결과에 따라 "결과 없음" 섹션 표시 여부 결정 함수
const toggleNoResults = hasResult => {
  if (hasResult) {
    hideNoResults();
  } else {
    renderNoResults();
  }
};

// 글 검색 API 호출 함수
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
      console.log(articles);
      renderArticlesResults(articles);
      toggleNoResults(true);
    } else {
      toggleNoResults(false);
    }
  } catch (error) {
    console.log(error);
  }
};

// 작가 검색 API 호출 함수
const getAuthors = async keyword => {
  try {
    const response = await axios.get(
      `https://11.fesp.shop/posts?keyword=${keyword}`,
      {
        headers: {
          "Content-Type": "application/json",
          "client-id": "vanilla02",
        },
      },
    );
    const authors = response.data.item;
    if (authors.length > 0) {
      renderArticlesResults(authors);
      toggleNoResults(true);
    } else {
      toggleNoResults(false);
    }
  } catch (error) {
    console.log(error);
  }
};

// Event Listener
$searchInput.addEventListener("input", handleSearchInput);
$btnClear.addEventListener("click", handleBtnClear);
$searchTabArticle.addEventListener("click", handleArticleTabClick);
$searchTabAuthor.addEventListener("click", handleAuthorTabClick);
