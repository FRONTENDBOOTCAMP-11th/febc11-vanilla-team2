import axios from "axios";

// DOM 요소 가져오기
const titleNode = document.querySelector(".detail-header_title");
const authorNode = document.querySelector(".detail-header_author");
const dateNode = document.querySelector(".detail-header_date");
const contentNode = document.querySelector(".detail-content_description");
const contentImageNode = document.querySelector(".detail-content_cover-src");
const subTitle = document.querySelector(".detail-header_title-addition");
const jobNode = document.querySelector(".detail-profile_job");
const profileAuthorNode = document.querySelector(".detail-profile_name");
const profileDescription = document.querySelector(
  ".detail-profile_description",
);
const profileSrc = document.querySelector(".detail-profile_src");
const commentCount = document.querySelector(".detail-comment_count-color");

// URL에서 게시글 ID 추출
const no = window.location.search.split("=")[1];

//월+일+년 단위 출력하기
function month(createdAt) {
  const day = createdAt.split(" ")[0];
  const splitDay = day.split(".");
  //   console.log(splitDay);
  //   console.log(day);
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
// console.log(month("2024.10.22 18:29:06"));

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
  console.log(comments);
  comments.forEach(comment => {
    console.log(comment);
    //댓글 유저 이미지 경로 없을 때 기본 이미지 어피치로 지정
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

//contentNode의 모든 img태그에서 src경로 있을 때 특정해서 그 경로에 도메인 추가하기..
function updateImageSrc() {
  const imgTags = contentNode.querySelectorAll("img"); //contentNode의 모든 이미지 불러옴 일단
  imgTags.forEach(img => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http")) {
      img.src = `https://11.fesp.shop${src}`;
    }
    img.classList.add("detail-content_cover-src");

    // 부모 div의 style500제거함
    const parentDiv = img.closest(".wrap_img_float"); //가장 가까운 상위요소
    if (parentDiv) {
      parentDiv.removeAttribute("style");
    }
  });
}

// 게시글과 작가 정보를 DOM에 렌더링하기
async function printPage() {
  const postData = await getPost();
  if (postData) {
    // 게시글 데이터 DOM에 렌더링
    titleNode.innerHTML = postData.title;
    authorNode.innerHTML = postData.user.name;
    dateNode.innerHTML = month(postData.createdAt);
    contentNode.innerHTML = postData.content;
    contentImageNode.src = postData.image || "";
    subTitle.innerHTML = postData.extra?.subTitle || "";
    commentCount.innerHTML = postData.replies.length || 0; //댓글 갯수 출력

    updateImageSrc(); //content이미지 업데이트

    // 작가 데이터 가져오기 및 렌더링
    const authorData = await getAuthor(postData.user._id);
    console.log(authorData);
    if (authorData) {
      jobNode.innerHTML = authorData.extra.job || "직업 정보 없음"; //작가 직업
      profileAuthorNode.innerHTML = authorData.name; //작가 이름
      profileDescription.innerHTML = authorData.extra.biography || "설명 없음"; //직업 설명
      profileSrc.src = authorData.image
        ? `https://11.fesp.shop${authorData.image}`
        : "https://11.fesp.shop/files/vanilla02/user-apeach.webp";
    }

    // 댓글 데이터 렌더링
    if (postData.replies) {
      displayComment(postData.replies);
    } else {
      console.log("댓글이 없습니다.");
    }
  }
}

// html이 로드되지 마자 함수 실행
document.addEventListener("DOMContentLoaded", function () {
  printPage();
});
