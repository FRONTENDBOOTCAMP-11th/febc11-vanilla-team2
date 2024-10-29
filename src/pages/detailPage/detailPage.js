import axios from "axios";

// DOM 요소 가져오기
const titleNode = document.querySelector(".detail-header_title");
const authorNode = document.querySelector(".detail-header_author");
const dateNode = document.querySelector(".detail-header_date");
const contentNode = document.querySelector(".detail-content_description");
// const contentImageNode = document.querySelector(".detail-content_cover-src");
const subTitle = document.querySelector(".detail-header_title-addition");
const jobNode = document.querySelector(".detail-profile_job");
const profileAuthorNode = document.querySelector(".detail-profile_name");
const profileDescription = document.querySelector(
  ".detail-profile_description",
);
const profileSrc = document.querySelector(".detail-profile_src");
const commentCount = document.querySelector(".detail-comment_count-color");
const subscribeBtn = document.querySelector(".detail-profile_subscribe-btn"); // 구독 버튼 클릭
const likeBtn = document.querySelector(".detail-footer_like-btn"); // 좋아요 버튼
let likeCount = document.querySelector(".detail-footer_like"); //좋아요 갯수
const footerCommentCount = document.querySelector(
  ".detail-footer_message_count",
);
let postData; // 전역 변수로 설정

// URL에서 게시글 ID 추출
const no = window.location.search.split("=")[1];

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
    const postData = response.data.item;
    console.log("Post Data:", postData);
    return postData;
  } catch (error) {
    console.log("게시글 정보 가져오기 실패:", error);
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
    console.log("Author Data:", response.data.item);
    return response.data.item;
  } catch (error) {
    console.log("작가 정보 가져오기 실패:", error);
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

// contentNode의 모든 img 태그에서 src 경로에 도메인 추가하기
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
  postData = await getPost(); // getPost()의 결과를 postData에 할당하고 기다림
  if (postData) {
    // 게시글 데이터 DOM에 렌더링
    titleNode.innerHTML = postData.title;
    authorNode.innerHTML = postData.user.name;
    dateNode.innerHTML = month(postData.createdAt);
    contentNode.innerHTML = postData.content;
    subTitle.innerHTML = postData.extra?.subTitle || "";
    commentCount.innerHTML = Array.isArray(postData.replies)
      ? postData.replies.length
      : 0;
    footerCommentCount.innerHTML = Array.isArray(postData.replies)
      ? postData.replies.length
      : 0;

    updateImageSrc();

    const authorData = await getAuthor(postData.user._id);
    if (authorData) {
      jobNode.innerHTML = authorData.extra.job || "직업 정보 없음";
      profileAuthorNode.innerHTML = authorData.name;
      profileDescription.innerHTML = authorData.extra.biography || "설명 없음";
      profileSrc.src = authorData.image
        ? `https://11.fesp.shop${authorData.image}`
        : "https://11.fesp.shop/files/vanilla02/user-apeach.webp";
    }

    if (postData.replies) {
      displayComment(postData.replies);
    } else {
      console.log("댓글이 없습니다.");
    }
  }
}

// 내 북마크 목록 얻어오기
const accessToken = sessionStorage.getItem("accessToken");
async function getbookMarks() {
  try {
    const response = await axios.get("https://11.fesp.shop/bookmarks/post", {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const bookMarks = response.data.item;
    console.log("Bookmarks:", bookMarks);
    return bookMarks;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("accessToken이 만료되었습니다. 다시 로그인해주세요");
      window.location.href = "src/pages/login/login.html";
    } else {
      console.log("북마크 목록 가져오는 중 에러 발생:", error);
    }
  }
}

// HTML이 로드된 후 함수 실행
document.addEventListener("DOMContentLoaded", async function () {
  await printPage(); // postData를 할당하는 함수 호출
  let bookMarks = (await getbookMarks()) || [];
  if (bookMarks) {
    likeCount.innerHTML = bookMarks.length; //초기 북마크 html
  }
  console.log("Post Data:", postData); // postData 확인용

  // 좋아요 버튼 클릭 이벤트 리스너 추가
  likeBtn.addEventListener("click", async e => {
    console.log("Post Data in likeBtn:", postData); // 확인용
    console.log(bookMarks); // 내 목록 북마크
    bookMarks = (await getbookMarks()) || []; //최신 북마크 가져옴
    const hasBookMarks = bookMarks.find(item => item.post._id === postData._id);
    try {
      //북마크 추가
      if (!hasBookMarks) {
        const response = await axios.post(
          "https://11.fesp.shop/bookmarks/post",
          {
            target_id: postData._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "client-id": "vanilla02",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log(response.data.item);
        // 북마크 갱신 후 카운트 업데이트
        bookMarks = await getbookMarks();
        likeCount.innerHTML = bookMarks.length; // 북마크 개수 업데이트
      } else {
        await deleteBookmarks(hasBookMarks._id);
        console.log("북마크 삭제함 :", hasBookMarks._id);
        // 북마크 갱신 후 카운트 업데이트
        bookMarks = await getbookMarks();
        likeCount.innerHTML = bookMarks.length; // 북마크 개수 업데이트
      }
    } catch (error) {
      if (error.response.status === 409) {
        alert("이미 추가된 북마크입니다");
      } else {
        console.log(error);
      }
    }
  });
});

// 북마크 삭제
async function deleteBookmarks(bookmarkID) {
  try {
    const response = await axios.delete(
      `https://11.fesp.shop/bookmarks/${bookmarkID}`,
      {
        headers: {
          "Content-Type": "application/json",
          "client-id": "vanilla02",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("삭제된 북마크", response.data);
  } catch (error) {
    console.log(error);
  }
}
