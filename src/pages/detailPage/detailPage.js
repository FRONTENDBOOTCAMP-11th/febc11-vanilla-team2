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
console.log(accessToken);

// 월+일+년 단위 출력하기
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
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
      },
    });
    postData = response.data.item;
    return postData;
  } catch (error) {
    console.error("게시글 정보 가져오기 실패:", error);
  }
}

// 작가 정보 가져오기
async function getAuthor(authorId) {
  try {
    const response = await axios.get(`https://11.fesp.shop/users/${authorId}`, {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
      },
    });
    return response.data.item;
  } catch (error) {
    if (error.response.status === 401 || !accessToken) {
      alert("인증 실패. 로그인 페이지로 이동합니다");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("작가 정보 가져오기 실패", error);
    }
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
              <img src="/src/assets/icons/ic-option.svg" alt="답글 추가 보기" />
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

// 샘플 이미지 스타일 변화
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
    console.log(authorData);
    if (authorData) {
      jobNode.innerHTML = authorData.extra?.job || "직업 정보 없음";
      profileAuthorNode.innerHTML = authorData.name;
      profileDescription.innerHTML = authorData.extra?.biography || "설명 없음";
      profileSrc.src = authorData.image
        ? `https://11.fesp.shop${authorData.image}`
        : `https://11.fesp.shop/files/vanilla02/user-apeach.webp`;
    }

    if (postData.replies) {
      displayComment(postData.replies);
    } else {
      console.log("댓글이 없습니다.");
    }
  }
}

// 내 게시글 북마크 목록 얻어오기
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
    if (error.response.status === 401 || !accessToken) {
      alert("인증 실패. 로그인 페이지로 이동합니다");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("북마크 목록 가져오는 중 에러 발생:", error);
    }
  }
}

// 좋아요 토글 함수
async function toggleBookmark() {
  likeBtn.disabled = true;
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
      likeBtnSrc.src = "/src/assets/icons/ic-like-on.svg";
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
      likeBtnSrc.src = "/src/assets/icons/ic-like-off.svg";
    }

    postData = await getPost();
    likeCount.innerHTML = postData.bookmarks;
  } catch (error) {
    if (error.response.status === 401 || !accessToken) {
      alert("인증 실패. 로그인 페이지로 이동합니다");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("북마크 삭제 실패", error);
    }
  } finally {
    likeBtn.disabled = false;
  }
}

// 구독자 수를 사용자 기준이 아닌 작가 기준으로 가져오기
async function updateSubscribeCount() {
  try {
    const authorData = await getAuthor(postData.user._id);
    const subscriberCount = authorData.bookmarkedBy.users;
    subscribeCounts.innerHTML = subscriberCount;
  } catch (error) {
    console.error("구독자 수 업데이트 실패:", error);
  }
}

// 내 구독 북마크 목록 얻어오기
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
    if (error.response.status === 401 || !accessToken) {
      alert("인증 실패. 로그인 페이지로 이동합니다");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("북마크 목록 가져오는 중 에러 발생:", error);
    }
  }
}

// 구독 버튼 클릭
subscribeBtn.addEventListener("click", async e => {
  try {
    let subscribeData = await getSubscribe();
    const hasSubcribe = subscribeData.some(
      item => item.user._id === postData.user._id,
    );

    if (!hasSubcribe) {
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
      subcribeBtnSrc.src = "/src/assets/icons/ic-subscribe-on.svg";
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
      subcribeBtnSrc.src = "/src/assets/icons/ic-subscribe-off.svg";
    }
    await updateSubscribeCount();
  } catch (error) {
    if ((error.response && error.response.status === 401) || !accessToken) {
      alert("인증 실패. 로그인 페이지로 이동합니다.");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.error("구독 처리 중 오류 발생:", error);
    }
  }
});

// HTML이 로드된 후 함수 실행
document.addEventListener("DOMContentLoaded", async () => {
  await printPage();
  await updateSubscribeCount();
  let subscribeData = await getSubscribe();
  const isSubscribed = subscribeData.some(
    //처음 로드됐을 때 구독상태 확인 -> 첫 화면에 반영
    item => item.user._id === postData.user._id,
  );
  let bookmarks = await getBookmarks();
  const isLike = bookmarks.some(item => item.post._id === postData._id);
  if (isLike) {
    likeBtnSrc.src = "/src/assets/icons/ic-like-on.svg";
  } else {
    likeBtnSrc.src = "/src/assets/icons/ic-like-off.svg";
  }

  if (isSubscribed) {
    subcribeBtnSrc.src = "/src/assets/icons/ic-subscribe-on.svg";
  } else {
    subcribeBtnSrc.src = "/src/assets/icons/ic-subscribe-off.svg";
  }
  likeBtn.addEventListener("click", toggleBookmark);
});
