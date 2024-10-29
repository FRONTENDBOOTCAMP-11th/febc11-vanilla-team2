import axios from "axios";

const url = "https://11.fesp.shop";

/* 작가 정보 가져오기 */
async function getAuthorInfo() {
  try {
    // 현재 위치를 쿼리 문자열로.. 쿼리 문자열을 파싱해서 저장..
    // 특정 쿼리 매개변수의 값을 get으로 가져와서 저장..
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    console.log(userId);

    const authorName = document.querySelector("#authorName");
    const authorJob = document.querySelector("#job");
    const bookmarkedBy = document.querySelector("#bookmarkedBy");
    const bookmarked = document.querySelector("#bookmarked");

    const response = await axios.get(`${url}/users/${userId}`, {
      headers: {
        "client-id": "vanilla02",
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    authorName.innerHTML = response.data.item.name;
    authorJob.innerHTML = response.data.item.extra.job;
    bookmarkedBy.innerHTML = response.data.item.bookmarkedBy.users;
    bookmarked.innerHTML = response.data.item.bookmark.users;
  } catch (error) {
    console.log("error", error);
    document.querySelector(".wrap-article-list").innerHTML =
      "<p>Failed to load posts.</p>";
  }
}

/* 작가의 글 목록 가져오기 */
async function getPosts(userId) {
  const response = await axios.get(`${url}/posts/users/${userId}`, {
    headers: {
      "client-id": "vanilla02",
      "Content-Type": "application/json",
    },
  });
  let posts = response.data.item;
  const postsContainer = document.querySelector(
    ".wrap-article-list_listArticle",
  );

  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const postElement = document.createElement("li");
    postElement.classList.add("wrap-article-list_post");

    postElement.innerHTML = `
            <a class="linkCategory" href="">
                <em class="titCategory">${post.category}</em>
            </a>
            <a class="link-post #post-listview" href="">
                <div class="post-title">
                    <strong class="post-title_subject">${post.title}</strong>
                    <div class="wrap-title-contents">
                        <div class="post-content">
                            <em class="titleSub">${post.subtitle}</em>
                            <span class="ico-bar">|</span>
                            <span class="article-content">${post.content}</span>
                        </div>
                        <span class="post-append">
                            <span class="publish-time">${post.createdAt}</span>
                        </span>
                    </div>
                </div>
            </a>
        `;

    postsContainer.appendChild(postElement);
  });
}

getAuthorInfo(); //author id 넣어야함
getPosts();
