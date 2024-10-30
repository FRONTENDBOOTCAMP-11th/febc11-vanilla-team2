import axios from "axios";

const url = "https://11.fesp.shop";
const clientId = "vanilla02";

// 현재 위치를 쿼리 문자열로.. 쿼리 문자열을 파싱해서 저장..
// 특정 쿼리 매개변수의 값을 get으로 가져와서 저장..
const params = new URLSearchParams(window.location.search);
const authorId = params.get("_id");

/* 작가 정보 가져오기 */
async function getAuthorInfo() {
  try {
    console.log("authorId :", authorId);
    const response = await axios.get(`${url}/users/${authorId}`, {
      headers: {
        "client-id": "vanilla02",
        "Content-Type": "application/json",
      },
    });
    console.log("작가 정보 response.data.item:", response.data.item);
    const items = response.data.item;

    document.getElementById("authorName").textContent = items.name;
    let img = document.getElementById("profilImage");
    img.src = `https://11.fesp.shop/files/${clientId}/user-muzi.webp`;
    document.getElementById("job").textContent = items.extra.job;
    document.getElementById("bookmarkedBy").textContent = items.bookmark.users;
    document.getElementById("bookmarked").textContent =
      items.bookmarkedBy.users;
  } catch (error) {
    console.log("error", error);
    document.querySelector(".wrap-article-list").textContent =
      "<p>Failed to load posts.</p>";
  }
}
getAuthorInfo();

/* 작가 글 목록 가져오기 */
async function getPosts() {
  // 테스트용도로 ?type=info 설정함, 나중에 제거 or ?type=post로 바꾸기
  const response = await axios.get(`${url}/posts/users/${authorId}?type=info`, {
    headers: {
      "client-id": "vanilla02",
      "Content-Type": "application/json",
    },
  });
  console.log("작가 글 목록 response.data.item:", response.data.item);
  let posts = response.data.item;

  const postsContainer = document.querySelector(
    ".wrap-article-list_listArticle",
  );

  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const postElement = document.createElement("li");
    postElement.classList.add("wrap-article-list_post");

    // .toLocaleDateString()으로 날짜 형식 바꾸기
    const postDate = new Date(post.createdAt);
    const formattedDate = postDate
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      .replace(",", "");

    // 카테고리 기능 없음으로 기본값 지정
    postElement.innerHTML = `
            <a class="linkCategory" href="">
                <em class="titCategory">카테고리입니다</em>
            </a>
            <div class="link-post #post-listview" id="linkPost" href="" data-id=${post._id}>
                <div class="post-title">
                    <strong class="post-title_subject">${post.title}</strong>
                    <div class="wrap-title-contents">
                        <div class="post-content">
                            <em class="titleSub">${post.extra.subTitle}</em>
                            <span class="ico-bar">|</span>
                            <span class="article-content">${post.content}</span>
                        </div>
                        <span class="post-append">
                            <span class="publish-time">${formattedDate}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;

    postsContainer.appendChild(postElement);
    console.log("post._id :", post._id);
    document.querySelectorAll("#linkPost").forEach(detailPageList => {
      detailPageList.addEventListener("click", detailPageClick);
    });
  });
}
getPosts();

/* 상세페이지로 넘어가기 */
const detailPageClick = e => {
  const detailPageId = e.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/detailPage/detailPage.html?id=${detailPageId}`;
};
