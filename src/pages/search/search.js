"use strict";
/* 발견 페이지 기능 정리
  1. 검색어 입력 처리
    1.1 검색어 입력 시 "x" 버튼 동적 생성
    1.2 검색어 입력 시 "글 / 작가" 탭 생성
    1.3. 입력된 검색어로 API 호출
  3. 글 탭 클릭 시 입력된 검색어 기반으로 결과 뿌려주기
  4. 작가 탭 클릭 시 입력된 검색어 기반ㅇ로 작가 뿌려주기
  5. 입력된 검색어에 일치하는 글/작가 없을 시 결과 없음 페이지 뿌려주기
*/

// DOM Node Reference
const $searchInput = document.querySelector(".search-query__input");
const $btnClear = document.querySelector(".search-query__button-clear");
const $noInputSection = document.querySelector(".search-contents__no-input");
const $searchTab = document.querySelector(".search-tab");
const $searchTabArticle = document.querySelector(".search-tab__item-article");
const $searchTabAuthor = document.querySelector(".search-tab__item-author");

// Callback Function
// 검색어 입력 처리 함수
const handleSearchInput = () => {
  const query = $searchInput.value.trim();

  // "x" 버튼 처리
  $btnClear.style.display = query ? "block" : "none";

  $noInputSection.style.display = query ? "none" : "block";

  // 글 & 작가 탭 토글 처리
  toggleSearchTab(query);
};

// "x" 버튼 처리 함수
const handleBtnClear = () => {
  $searchInput.value = "";
  handleSearchInput();
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
  } else if (tab === "author") {
    $searchTabArticle.classList.remove("search-tab__item--active");
    $searchTabAuthor.classList.add("search-tab__item--active");
  }
};

// 글 탭 클릭 시 처리 함수
const handleArticleTabClick = () => {
  activateTab("article");
};

// 작가 탭 클릭 시 처리 함수
const handleAuthorTabClick = () => {
  activateTab("author");
};

// Event Listener
$searchInput.addEventListener("input", handleSearchInput);
$btnClear.addEventListener("click", handleBtnClear);

$searchTabArticle.addEventListener("click", handleArticleTabClick);
$searchTabAuthor.addEventListener("click", handleAuthorTabClick);
