import axios from "axios";

// DOM 요소 가져오기
const titleNode = document.querySelector(".detail-header_title");
const authorNode = document.querySelector(".detail-header_author");
const dateNode = document.querySelector(".detail-header_date");
const contentNode = document.querySelector(".detail-content_description");
const subTitle = document.querySelector(".detail-header_title-addition");
const jobNode = document.querySelector(".detail-profile_job");
const profileAuthorNode = document.querySelector(".detail-profile_name");
const profileDescription = document.querySelector(
  ".detail-profile_description",
);
const profileSrc = document.querySelector(".detail-profile_src");
const commentCount = document.querySelector(".detail-comment_count-color");
const subscribeBtn = document.querySelector(".detail-profile_subscribe-btn");
const likeBtn = document.querySelector(".detail-footer_like-btn");
let likeCount = document.querySelector(".detail-footer_like");
const footerCommentCount = document.querySelector(
  ".detail-footer_message_count",
);
const subcribeBtnSrc = document.querySelector(
  ".detail-profile_subscribe-btn_src",
);
const subscribeCounts = document.querySelector("#subscribeCount");
const likeBtnSrc = document.querySelector(".detail-footer_like-btn_src");
let postData;

// URL에서 게시글 ID 추출
const no = window.location.search.split("=")[1];
const accessToken = sessionStorage.getItem("accessToken");

// 날짜 형식 변환
function month(createdAt) {
  const day = createdAt.split(" ")[0];
  const splitDay = day.split(".");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(splitDay[1]) - 1]} ${splitDay[2]} ${splitDay[0]}`;
}

// 게시글 데이터 가져오기
async function getPost() {
  try {
    const response = await axios.get(`https://11.fesp.shop/posts/${no}`, {
      headers: { "Content-Type": "application/json", "client-id": "vanilla02" },
    });
    postData = response.data.item;
    console.log(postData);
    return postData;
  } catch (error) {
    console.error("게시글 정보 가져오기 실패:", error);
  }
}

getPost();

// 작가 정보 가져오기
async function getAuthor(authorId) {
  try {
    const response = await axios.get(`https://11.fesp.shop/users/${authorId}`, {
      headers: { "Content-Type": "application/json", "client-id": "vanilla02" },
    });
    return response.data.item;
  } catch (error) {
    console.error("작가 정보 불러오기 실패", error);
  }
}

//작가와 로그인한 게시글ID 같으면 구독버튼 숨기기
const userId = sessionStorage.getItem("userId");
function hideSubscribeButton() {
  if (postData.user._id === Number(userId)) {
    subscribeBtn.style.display = "none";
  } else {
    subscribeBtn.style.display = "block";
  }
}
// 댓글 출력 함수
function displayComment(comments) {
  const commentContainer = document.querySelector(".detail-comment_container");
  comments.forEach(comment => {
    const imageUrl = comment.user.image
      ? `https://11.fesp.shop${comment.user.image}`
      : `https://11.fesp.shop/files/vanilla02/user-apeach.webp`;
    const commentDiv = document.createElement("div");
    commentDiv.innerHTML = `
      <div class="detail-comment_information">
        <div class="detail-comment_information-header">
          <img class="detail-comment_header-profile_src" src="${imageUrl}" alt="${comment.user.name}" />
          <div class="detail-comment_header-container">
            <p class="detail-comment_header-profile_name">${comment.user.name}</p>
            <p class="detail-comment_header_date">${month(comment.createdAt)}</p>
          </div>
          <div class="detail-comment_header-container_btn">
            <button class="detail-comment_header-btn">
              <img src="/assets/icons/ic-option.svg" alt="답글 추가 보기" />
            </button>
          </div>
        </div>
        <p class="detail-comment_information-description">${comment.content}</p>
        <button class="detail-comment_information-btn">답글달기</button>
      </div>
    `;
    commentContainer.insertBefore(
      commentDiv,
      commentContainer.querySelector(".detail-comment_writing"),
    );
  });
}

// 이미지 소스 업데이트
function updateImageSrc() {
  const imgTags = contentNode.querySelectorAll("img");
  imgTags.forEach(img => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http")) {
      img.src = `https://11.fesp.shop${src}`;
    }
    const parentDiv = img.closest(".wrap_img_float");
    if (parentDiv) {
      parentDiv.removeAttribute("style");
    }
  });
}

// 게시글과 작가 정보를 DOM에 렌더링하기
async function printPage() {
  postData = await getPost();
  if (postData) {
    titleNode.innerHTML = postData.title;
    authorNode.innerHTML = postData.user.name;
    dateNode.innerHTML = month(postData.createdAt);
    contentNode.innerHTML = postData.content;
    subTitle.innerHTML = postData.extra?.subTitle || "부제목 없음";
    commentCount.innerHTML = Array.isArray(postData.replies)
      ? postData.replies.length
      : 0;
    footerCommentCount.innerHTML = Array.isArray(postData.replies)
      ? postData.replies.length
      : 0;
    updateImageSrc();
    likeCount.innerHTML = postData.bookmarks;

    const authorData = await getAuthor(postData.user._id);
    console.log(authorData.bookmarkedBy.users);
    if (authorData) {
      jobNode.innerHTML = authorData.extra?.job || "직업 정보 없음";
      profileAuthorNode.innerHTML = authorData.name;
      profileDescription.innerHTML = authorData.extra?.biography || "설명 없음";
      profileSrc.src = authorData.image
        ? `https://11.fesp.shop${authorData.image}`
        : `https://11.fesp.shop/files/vanilla02/user-apeach.webp`;
      console.log("printPage authorData:", authorData.bookmarkedBy.users);
    }
    hideSubscribeButton(); //작가가 사용자와 같으면 구독버튼 숨김
    if (postData.replies) {
      displayComment(postData.replies);
    } else {
      console.log("댓글이 없습니다.");
    }
  }
  await updateSubscribeCount(); //페이지 로드될때 구독자수 가져옴
}

// 구독 북마크 목록 얻어오기
async function getSubscribe() {
  try {
    const response = await axios.get("https://11.fesp.shop/bookmarks/user", {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.item;
  } catch (error) {
    if (error.response.status === 401) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/src/pages/login/login.html";
    } else {
      console.error("게시글 북마크 목록 얻어오기 실패", error);
    }
  }
}

// 게시글 북마크 목록 얻어오기
async function getBookmarks() {
  try {
    const response = await axios.get("https://11.fesp.shop/bookmarks/post", {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.item;
  } catch (error) {
    if (error.response.status === 401) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/src/pages/login/login.html";
    } else {
      console.error("게시글 북마크 목록 얻어오기 실패", error);
    }
  }
}

// 초기 좋아요 및 구독 상태 설정
async function initializeButtonStates() {
  let bookmarks = await getBookmarks();
  const isLike = bookmarks?.some(item => item.post._id === postData._id);
  likeBtnSrc.src = isLike
    ? "/assets/icons/ic-like-on.svg"
    : "/assets/icons/ic-like-off.svg";

  let subscribeData = await getSubscribe();
  const isSubscribed = subscribeData?.some(
    item => item.user._id === postData.user._id,
  );
  subcribeBtnSrc.src = isSubscribed
    ? "/assets/icons/ic-subscribe-on.svg"
    : "/assets/icons/ic-subscribe-off.svg";
}
//로그인 함수//좋아요랑 구독버튼 클릭시에만 로그인 여부를 확인함
function checkLogin() {
  const accessToken = sessionStorage.getItem("accessToken"); //호출갱신
  if (!accessToken) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    window.location.href = "/src/pages/login/login.html";
    return false;
  }
  return true;
}

// 구독자 수 업데이트 함수
async function updateSubscribeCount() {
  try {
    const authorData = await getAuthor(postData.user._id);
    const subscriberCount = authorData.bookmarkedBy.users;
    console.log("구독자 수:", subscriberCount);

    if (subscribeCounts) {
      subscribeCounts.innerHTML = subscriberCount;
    } else {
      console.error("subscribeCounts 요소를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("구독자 수 업데이트 실패:", error);
  }
}
// 좋아요 토글 함수
async function toggleBookmark() {
  if (!checkLogin()) return;
  try {
    let bookmarks = await getBookmarks();
    const hasBookmark = bookmarks.some(item => item.post._id === postData._id);

    if (!hasBookmark) {
      await axios.post(
        "https://11.fesp.shop/bookmarks/post",
        { target_id: postData._id },
        {
          headers: {
            "Content-Type": "application/json",
            "client-id": "vanilla02",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      likeBtnSrc.src = "/assets/icons/ic-like-on.svg";
    } else {
      const bookmarkId = bookmarks.find(
        item => item.post._id === postData._id,
      )._id;
      await axios.delete(`https://11.fesp.shop/bookmarks/${bookmarkId}`, {
        headers: {
          "Content-Type": "application/json",
          "client-id": "vanilla02",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      likeBtnSrc.src = "/assets/icons/ic-like-off.svg";
    }

    postData = await getPost();
    likeCount.innerHTML = postData.bookmarks;
  } catch (error) {
    if (error.response.status === 401) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/src/pages/login/login.html";
    } else {
      console.error("게시글 북마크 목록 얻어오기 실패", error);
    }
  }
}

// 구독 토글 함수
async function toggleSubscribe() {
  if (!checkLogin()) return;
  try {
    let subscribeData = await getSubscribe();
    const isSubscribed = subscribeData?.some(
      item => item.user._id === postData.user._id,
    );

    if (!isSubscribed) {
      await axios.post(
        "https://11.fesp.shop/bookmarks/user",
        { target_id: postData.user._id },
        {
          headers: {
            "Content-Type": "application/json",
            "client-id": "vanilla02",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      subcribeBtnSrc.src = "/assets/icons/ic-subscribe-on.svg";
    } else {
      const subscribeId = subscribeData.find(
        item => item.user._id === postData.user._id,
      )._id;
      await axios.delete(`https://11.fesp.shop/bookmarks/${subscribeId}`, {
        headers: {
          "Content-Type": "application/json",
          "client-id": "vanilla02",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      subcribeBtnSrc.src = "/assets/icons/ic-subscribe-off.svg";
    }
    await updateSubscribeCount(); //구독자 수 업뎃
  } catch (error) {
    if (error.response.status === 401) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/src/pages/login/login.html";
    } else {
      console.error("게시글 북마크 목록 얻어오기 실패", error);
    }
  }
}

function isLoggedIn() {
  //API호출시에만 initializeButtonStates를 활성화 할지 말지 결정하게함 . 즉 로그인 상태에따라 api호출 결정함(t,f로), 이후에 로그인 페이지로 보내지는 않음
  return Boolean(accessToken);
}

// HTML 로드 후 함수 실행
document.addEventListener("DOMContentLoaded", async () => {
  await printPage();
  if (isLoggedIn()) {
    await initializeButtonStates(); //구독과 좋아요 한 상태를 로그인한 상태에서 페이지 로드하면 바로 보여지게함(상태를 한번에 가져옴->불필요한 api줄임)
  }

  // 좋아요 버튼 클릭 시 상태 업데이트
  likeBtn.addEventListener("click", async () => {
    await toggleBookmark();
  });

  // 구독 버튼 클릭 시 상태 업데이트
  subscribeBtn.addEventListener("click", async () => {
    await toggleSubscribe();
  });
});

// 내 서랍 - 관심 글 로직
// 특정 페이지에서 현재 게시글 정보를 sessionStorage에 저장하는 함수
const saveCurrentPostToSessionStorage = post => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) return;
  const savedPosts = JSON.parse(sessionStorage.getItem("savedPosts")) || [];
  const newPost = {
    id: post.id,
    title: post.title,
    author: post.author,
    image: post.image,
  };

  const isPostSaved = savedPosts.some(savedPost => savedPost.id === newPost.id);
  if (!isPostSaved) {
    if (savedPosts.length >= 4) {
      savedPosts.shift();
    }
    savedPosts.push(newPost);
    sessionStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }
};

// 특정 페이지 접근 시, 해당 게시글의 정보를 sessionStorage에 저장
window.addEventListener("load", async () => {
  const posts = await getPost();
  const post = {
    id: posts._id,
    title: posts.title,
    author: posts.user.name,
    image: posts.image && posts.image.length > 0 ? posts.image[0] : "",
  };

  saveCurrentPostToSessionStorage(post);
});
