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

    // API 응답에서 item 배열 추출 및 변환
    const todayBrunchPosts = response.data.item.map(post => ({
      _id: post._id,
      title: post.title,
      author: post.user.name,
      contents: post.content,
      image: post.image ? `https://11.fesp.shop${post.image}` : null,
      views: post.views,
    }));

    // 조회수 기준으로 정렬
    todayBrunchPosts.sort((a, b) => b.views - a.views);

    // 최대 10개 게시물만 표시
    const topPosts = todayBrunchPosts.slice(0, 10);

    displayTodayPosts(topPosts);
  } catch (error) {
    console.error("게시글을 가져오는 중 오류 발생:", error);
  }
}

function displayTodayPosts(posts) {
  const top10List = document.getElementById("top10-list");
  top10List.innerHTML = ""; // 기존 내용 지우기

  posts.forEach((post, index) => {
    const listItem = document.createElement("li");
    listItem.className = "top10";
    listItem.setAttribute("data-id", post._id);

    listItem.innerHTML = `
      <span class="rank" data-rank="${index + 1}">${index + 1}</span>
      <div class="top10-info">
        <h1 class="top10-info__header">${post.title}</h1>
        <p class="top10-info__author">
          <span class="by">by</span> <span class="author-name">${post.author}</span>
        </p>
        <p class="top10-info__text">${post.contents}</p>
      </div>
      ${post.image ? `<img src="${post.image}" class="top10-img" alt="이미지" />` : ""}
    `;

    // 클릭 시 상세페이지로 이동
    listItem.addEventListener("click", () => {
      window.location.href = `/src/pages/detailPage/detailPage.html?id=${post._id}`; // 상세 페이지 URL
    });

    top10List.appendChild(listItem);
  });
}

async function fetchAuthors() {
  try {
    const response = await axios.get("https://11.fesp.shop/users", {
      headers: {
        "client-id": clientId,
      },
    });

    if (response.data.ok) {
      const authors = response.data.item; // 여러명의 작가가 있을 경우 배열로 가정
      const authorList = document.getElementById("author-list");

      // authorList가 null인지 확인
      if (!authorList) {
        console.error("author-list 요소를 찾을 수 없습니다.");
        return; // 함수 종료
      }

      // 최대 4명의 작가만 표시
      const limitedAuthors = authors.slice(0, 4);

      limitedAuthors.forEach(author => {
        const authorItem = document.createElement("div");
        authorItem.className = "subjump-grid-item";

        authorItem.innerHTML = `
          <img src="/src/assets/images/${author.image}" class="subjump-author" />
          <h2 class="subjump-grid-item__name">${author.name}</h2>
          <p class="subjump-grid-item__job">${author.type}</p>
          <p class="subjump-grid-item__text">${author.description || ""}</p>
        `;

        authorList.appendChild(authorItem);
      });
    }
  } catch (error) {
    console.error("Error fetching authors:", error);
  }
}

// 페이지 로드시 표시
window.addEventListener("load", () => {
  fetchTodayBrunchPosts();
  fetchAuthors();
});
