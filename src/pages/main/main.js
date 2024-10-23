"use strict";

const posts = [
  {
    title: "무사히 마흔살이 될 수 있을까",
    author: "강윤이",
    summary: "병원에서 암 진단을 받고 나와 햇볕이 작열하며 끓어오르는 거리를 …",
    image: "/src/assets/images/top1.svg",
  },
  {
    title: "여름의 끝자락",
    author: "이수민",
    summary: "여름이 가기 전에 꼭 가봐야 할 여행지들을 소개합니다.",
    image: "/src/assets/images/top2.svg",
  },
  {
    title: "브런치 카페 추천",
    author: "김하늘",
    summary: "주말에 가기 좋은 브런치 카페 리스트입니다.",
    image: "/src/assets/images/top3.svg",
  },
  {
    title: "무사히 마흔살이 될 수 있을까",
    author: "강윤이",
    summary: "병원에서 암 진단을 받고 나와 햇볕이 작열하며 끓어오르는 거리를 …",
    image: "/src/assets/images/top1.svg",
  },
  {
    title: "여름의 끝자락",
    author: "이수민",
    summary: "여름이 가기 전에 꼭 가봐야 할 여행지들을 소개합니다.",
    image: "/src/assets/images/top2.svg",
  },
  {
    title: "브런치 카페 추천",
    author: "김하늘",
    summary: "주말에 가기 좋은 브런치 카페 리스트입니다.",
    image: "/src/assets/images/top3.svg",
  },
  {
    title: "무사히 마흔살이 될 수 있을까",
    author: "강윤이",
    summary: "병원에서 암 진단을 받고 나와 햇볕이 작열하며 끓어오르는 거리를 …",
    image: "/src/assets/images/top1.svg",
  },
  {
    title: "여름의 끝자락",
    author: "이수민",
    summary: "여름이 가기 전에 꼭 가봐야 할 여행지들을 소개합니다.",
    image: "/src/assets/images/top2.svg",
  },
  {
    title: "브런치 카페 추천",
    author: "김하늘",
    summary: "주말에 가기 좋은 브런치 카페 리스트입니다.",
    image: "/src/assets/images/top3.svg",
  },
];

function displayPosts() {
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

// 페이지가 로드될 때 게시글을 표시
document.addEventListener("DOMContentLoaded", displayPosts);
