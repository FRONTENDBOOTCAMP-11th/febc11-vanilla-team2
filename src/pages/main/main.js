"use strict";

import axios from "axios";

const clientId = "vanilla02";

async function fetchTodayBrunchPosts() {
  try {
    const response = await axios.get("https://11.fesp.shop/posts", {
      headers: {
        "client-id": clientId,
      },
    });
    console.log(response.data.item);

    // API 응답에서 item 배열 추출 및 변환
    const todayBrunchPosts = response.data.item.map(post => {
      // 이미지 URL을 처리
      const imageUrl =
        Array.isArray(post.image) && post.image.length > 0
          ? `https://11.fesp.shop${post.image[0]}` // 첫 번째 이미지 URL
          : "https://11.fesp.shop/files/vanilla02/dp1C0lzzt.png"; // 기본 이미지

      // 객체 반환
      console.log(post);
      return {
        _id: post._id,
        title: post.title,
        author: post.user.name,
        contents: post.content,
        image: imageUrl,
        view: post.views || 0,
      };
    });

    // 조회수 기준으로 정렬
    todayBrunchPosts.sort((a, b) => b.view - a.view);
    // 오늘의 게시물 출력
    console.log(todayBrunchPosts);
    displayPosts(todayBrunchPosts); // 전체 게시물 목록을 displayPosts로 전달
  } catch (error) {
    console.error("게시글을 가져오는 중 오류 발생:", error);
  }
}

function displayPosts(posts) {
  const postList = document.getElementById("top10-list");
  postList.innerHTML = ""; // 기존 내용 지우기

  // 최대 10개 게시물만 표시
  const limitedPosts = posts.slice(0, 10);

  limitedPosts.forEach((post, index) => {
    const postItem = document.createElement("li");
    postItem.className = "top10";
    postItem.setAttribute("data-id", post._id);

    // `sanitizeHTML` 함수로 콘텐츠를 안전하게 처리
    postItem.innerHTML = `
      <span class="rank" data-rank="${index + 1}">${index + 1}</span>
      <div class="top10-info">
        <h1 class="top10-info__header">${sanitizeHTML(post.title)}</h1>
        <p class="top10-info__author">
          <span class="by">by</span> <span class="author-name">${sanitizeHTML(post.author)}</span>
        </p>
        <p class="top10-info__text">${sanitizeHTML(post.contents)}</p>
      </div>
      ${post.image ? `<img src="${sanitizeHTML(post.image)}" class="top10-img" alt="이미지" />` : ""}
    `;

    // 클릭 시 상세페이지로 이동
    postItem.addEventListener("click", () => {
      window.location.href = `/src/pages/detailPage/detailPage.html?id=${post._id}`; // 상세 페이지 URL
    });

    postList.appendChild(postItem);
  });
}

// `sanitizeHTML` 함수 정의
function sanitizeHTML(str) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = str; // 텍스트로 설정하여 HTML 인코딩
  return tempDiv.innerHTML; // 인코딩된 HTML 반환
}
async function fetchSubTopAuthors() {
  try {
    const response = await axios.get("https://11.fesp.shop/users", {
      headers: {
        "client-id": clientId,
      },
    });

    if (response.data.ok) {
      // API 응답에서 item 배열 추출
      const authors = response.data.item;
      const subTopAuthors = authors.map(author => {
        return {
          id: author._id,
          name: author.name,
          job: author.extra?.job || "직업 정보 없음",
          biography: author.extra?.biography || "소개 정보 없음",
          image: author.image ? `https://11.fesp.shop${author.image}` : null,
          subscribers: author.bookmarkedBy?.users || 0,
        };
      });

      // 구독자 많은순 정렬
      subTopAuthors.sort((a, b) => b.subscribers - a.subscribers);

      // 최대 4명의 작가만 표시
      displayAuthors(subTopAuthors.slice(0, 4));
    }
  } catch (error) {
    console.error("구독자 TOP 작가 가져오는 중 오류 발생:", error);
  }
}

function displayAuthors(authors) {
  const authorList = document.getElementById("author-list");

  // 최대 4명의 작가만 표시
  const limitedAuthors = authors.slice(0, 4);

  limitedAuthors.forEach(author => {
    const authorItem = document.createElement("div");
    authorItem.className = "subjump-grid-item";

    const authorImageHTML = author.image
      ? `<div class="subjump-author-container">
           <img src="${author.image}" class="subjump-author" alt="이미지" />
         </div>`
      : "";

    authorItem.innerHTML = `
      ${authorImageHTML}
      <h2 class="subjump-grid-item__name">${author.name}</h2>
      <p class="subjump-grid-item__job">${author.job}</p>
      <p class="subjump-grid-item__text">${author.biography}</p>
    `;

    // 클릭 시 작가 홈으로 이동
    authorItem.addEventListener("click", () => {
      window.location.href = `/src/pages/author/author.html?id=${author.id}`; // 작가 홈 페이지 URL
    });

    authorList.appendChild(authorItem);
  });
}

// 페이지 로드시 표시
window.addEventListener("load", () => {
  fetchTodayBrunchPosts();
  fetchSubTopAuthors();
});
