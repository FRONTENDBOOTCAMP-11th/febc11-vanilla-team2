"use strict";

import axios from "axios";

async function fetchTodayBrunchPosts() {
  try {
    const response = await axios.get("https://11.fesp.shop/posts", {
      headers: {
        "client-id": "vanilla02",
      },
    });

    // API 응답에서 item 배열 추출 및 변환
    const todayBrunchPosts = response.data.item.map(post => ({
      _id: post._id,
      title: post.title,
      author: post.user.name,
      contents: post.user.content,
      image: post.image,
      views: post.views,
    }));

    //조회수 기준
    todayBrunchPosts.sort((a, b) => b.views - a.views);

    console.log("변환된 데이터:", todayBrunchPosts);
    displayTodayPosts(todayBrunchPosts);
  } catch (error) {
    console.error("게시글을 가져오는 중 오류 발생:", error);
  }
}

function displayTodayPosts(posts) {
  const top10List = document.querySelectorAll(".top10");

  posts.forEach((post, index) => {
    const listItem = top10List[index];

    if (listItem) {
      const postId = post._id;

      listItem.setAttribute("data-id", postId);

      listItem.querySelector(".top10-info__header").textContent = post.title;
      listItem.querySelector(".author-name").textContent = post.author;
      listItem.querySelector(".top10-info__text").textContent = post.contents;

      const imageElement = listItem.querySelector(".top10-img");
      if (post.image) {
        imageElement.src = post.image;
      } else {
        imageElement.src = ""; // 이미지가 없으면 빈 문자열
      }
      // 클릭시 상세페이지으로 이동
      listItem.addEventListener("click", () => {
        const postId = listItem.getAttribute("data-id");
        window.location.href = `https://11.fesp.shop/posts?no=${postId}`;
      });
    }
  });
}

// 페이지 로드시 표시
window.onload = fetchTodayBrunchPosts;
