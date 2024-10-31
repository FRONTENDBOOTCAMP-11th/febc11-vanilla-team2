import axios from "axios";

const api = axios.create({
  baseURL: "https://11.fesp.shop",
  headers: {
    "client-id": "vanilla02",
    "Content-Type": "application/json",
  },
});
const token = sessionStorage.getItem("accessToken");
let postData;

// 현재 위치를 쿼리 문자열로.. 쿼리 문자열을 파싱해서 저장..
// 특정 쿼리 매개변수의 값을 get으로 가져와서 저장..
const params = new URLSearchParams(window.location.search);
const authorId = params.get("_id");

/* 작가 정보 가져오기 */
async function getAuthorInfo() {
  try {
    const response = await api.get(`/users/${authorId}`);
    const items = response.data.item;

    document.getElementById("authorName").textContent = items.name;
    let img = document.getElementById("profilImage");
    img.src = `https://11.fesp.shop/${items.image}`;
    document.getElementById("job").textContent = items.extra.job;
    document.getElementById("bookmarkedBy").textContent =
      items.bookmarkedBy.users;
    document.getElementById("bookmark").textContent = items.bookmark.users;
    postData = response.data.item;
    return postData;
  } catch (error) {
    console.log("error", error);
    document.querySelector(".wrap-article-list").textContent =
      "<p>Failed to load posts.</p>";
  }
}

/* 작가 글 목록 가져오기 */
async function getPosts() {
  // 테스트용도로 ?type=info 설정함, 나중에 제거 or ?type=post로 바꾸기
  const response = await api.get(`/posts/users/${authorId}?type=info`);
  let posts = response.data.item;

  const postsContainer = document.querySelector(
    ".wrap-article-list_listArticle",
  );

  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const postElement = document.createElement("li");
    postElement.classList.add("wrap-article-list_post");

    // .toLocaleDateString()으로 날짜 형식 바꾸기 (Oct 22 2024)
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
            <hr/>
            
        `;

    postsContainer.appendChild(postElement);
    document.querySelectorAll("#linkPost").forEach(detailPageList => {
      detailPageList.addEventListener("click", detailPageClick);
    });
  });
}

/* 상세페이지로 넘어가기 */
const detailPageClick = e => {
  const detailPageId = e.currentTarget.getAttribute("data-id");
  window.location.href = `/src/pages/detailPage/detailPage.html?id=${detailPageId}`;
};

/* .......구독기능....... */

// 구독자(follower) 수 업데이트
async function updateSubscribeCount() {
  let subscribeCounts = document.getElementById("#bookmarkedBy");
  try {
    const authorData = await getAuthorInfo(postData._id);
    const subscriberCount = authorData.bookmarkedBy.users;
    subscribeCounts.innerHTML = subscriberCount;
  } catch (error) {
    console.error("구독자 수 업데이트 실패:", error);
  }
}

// 구독자 조회
async function getBookmark() {
  try {
    let response = await api.get(`/bookmarks/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.item;
  } catch (error) {
    if (error.response.status === 401 || !token) {
      alert("인증 실패. 로그인 페이지로 이동합니다");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("북마크 목록 가져오는 중 에러 발생:", error);
    }
  }
}

// 구독 추가
const subscribeBtn = document.querySelector(".btn_subscribe");
const checkIcon = document.querySelector(".ico_check");

// 구독 버튼 클릭
subscribeBtn.addEventListener("click", async () => {
  try {
    // 구독을 누른 사람의 id === 작가홈 작가 id
    let subscribeData = await getBookmark();
    const hasSubcribe = subscribeData.some(
      item => item.user._id === postData._id,
    );

    if (!hasSubcribe) {
      await api.post(
        "/bookmarks/user",
        { target_id: postData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      checkIcon.src = "/src/assets/icons/ic-subscribe-on.svg";
    } else {
      const subscribeId = subscribeData.find(
        item => item.user._id === postData._id,
      )._id;
      await api.delete(`/bookmarks/${subscribeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      checkIcon.src = "/src/assets/icons/ic-subscribe-off.svg";
    }
    await updateSubscribeCount();
  } catch (error) {
    if ((error.response && error.response.status === 401) || !token) {
      alert("인증 실패. 로그인 페이지로 이동합니다.");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("구독 처리 중 오류 발생:", error);
    }
  }
});

/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", async function () {
  await Promise.all([
    getAuthorInfo(),
    getPosts(),
    getBookmark(),
    updateSubscribeCount(),
  ]);

  let subscribeData = await getBookmark();
  const isSubscribed = subscribeData.some(
    item => item.user._id === postData._id,
  );
  if (isSubscribed) {
    checkIcon.src = "/src/assets/icons/ic-subscribe-on.svg";
  } else {
    checkIcon.src = "/src/assets/icons/ic-subscribe-off.svg";
  }
});
