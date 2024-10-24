"use strict";

import axios from "axios";

const posts = [];

function todayPosts(posts) {
  const top10List = document.querySelectorAll(".top10");

  posts.forEach((post, index) => {
    const listItem = top10List[index];

    if (listItem) {
      listItem.querySelector(".top10-info__header").textContent = post.title;
      listItem.querySelector(".author-name").textContent = post.author;
      listItem.querySelector(".top10-info__text").textContent = post.summary;
      listItem.querySelector(".top10-img").src = post.image;
    }
  });
}

function fetchPosts() {
  axios
    .get("https://11.fesp.shop/posts")
    .then(response => {
      const posts = response.data;
      todayPosts(posts);
    })
    .catch(error => {
      console.error("게시글을 가져오는 중 오류 발생:", error);
    });
}

// 페이지가 로드될 때 표시
document.addEventListener("DOMContentLoaded", todayPosts);
