//좋아요 구독 구성
"use strict";

const jsonData = {
  ok: 1,
  item: [
    {
      _id: 1,
      type: "community",
      user: {
        _id: 4,
        name: "Sunny",
        job: "회사원",
        introduction:
          "12년 차 국내 항공사 승무원의 겨울 산티아고 순례길 이야기 연재 중. 커피 한 잔을 벗 삼아 편하게 읽을 수 있는 글쓰기에 꽤나 진심인 편입니다. 후후.",
        subscribers: 108,
        profileImage: "/src/assets/images/author-3.svg",
      },
      title: "우여곡절 끝에 도착한 첫번째 목적지",
      subTitle: "Val carlos",
      content: [
        {
          type: "paragraph",
          text: "그래 지난 화를 요약해 보면 생장에 도착한 나는 도착 당일 바로 첫 여정을 시작하기로 마음먹었고 추천받은 목적지인 Val carlos까지 구글맵으로 걸어서 2시간 30분 거리를 확인했다. 그러나 걸어도 걸어도 줄지 않는 시간과 거리에 괴로워했었지.",
        },
        {
          type: "image",
          src: "/path/to/image.jpg",
          alt: "국경 사진",
        },
        {
          type: "paragraph",
          text: "여기가 바로 국경이다! 좌-프랑스, 우-스페인",
        },
        {
          type: "paragraph",
          text: "오후 5시 36분. 세상에 인터넷에서 사진으로만 보다가 직접 내 눈으로 처음 목격한 정식적인(?) 까미노 표식! 아주 반갑기 그지없었다. 왠지 목적지가 가까워진 것만 같은 느낌적인 느낌! 하지만 구글맵의 내 위치는 전혀 그렇지 못했다.",
        },
      ],
      tag: ["산티아고 순례길", "트레킹"],
      likes: 81,
      bookmarks: 23,
      image: "robot.png",
      createdAt: "2024-07-23T00:00:00",
      updatedAt: "2024-07-23T21:08:10",
      comments: [
        {
          _id: 1,
          user: {
            id: 2,
            name: "이상욱",
            profileImage: "/src/assets/images/author-1.svg",
          },
          content:
            "유럽은 국경이 희미해서 좋아요. 옛추억에 점심은 프랑스에서 저녁은 스위스에서 먹던 기억이 나네요. 홀로 산티아고 길을, 마치 행군 하듯이 걷는 그 고통이 기쁨으로 충만하길 바라며 읽고 있습니다. ^^",
          createdAt: "2024-07-23",
        },
        {
          _id: 2,
          user: {
            id: 3,
            name: "주정",
            profileImage: "/src/assets/images/author-2.svg",
          },
          content: "화이팅!^^",
          createdAt: "2024-07-25",
        },
      ],
      myBookmarkId: 23,
      repliesCount: 7,
    },
  ],
  pagination: {
    page: 1,
    limit: 0,
    total: 3,
    totalPages: 1,
  },
};

const titleNode = document.querySelector(".detail-header_title");
const authorNode = document.querySelector(".detail-header_author");
const dateNode = document.querySelector(".detail-header_date");
const contentNode = document.querySelector(".detail-content_description");
const contentImageNode = document.querySelector(".detail-content_cover-src");
const subTitle = document.querySelector(".detail-header_title-addition");
const likeNode = document.querySelector(".detail-footer_like");
const jobNode = document.querySelector(".detail-profile_job");
const profileAuthorNode = document.querySelector(".detail-profile_name");
const profileDescription = document.querySelector(
  ".detail-profile_description",
);
const profileSrc = document.querySelector(".detail-profile_src");
const commentCountNode = document.querySelector(".detail-comment_count-color");

const subscribeCount = document.querySelector(
  ".detail-profile_subscribe-information_count",
);

//태그 출력 함수
function displayTags(tag) {
  const tagContainNode = document.querySelector(".detail-content_information");
  tag.forEach(tag => {
    let tagNode = document.createElement("a");

    tagNode.setAttribute("class", "detail-content_tag");
    tagNode.setAttribute("href", "#");

    let tagText = document.createTextNode(tag);
    tagNode.appendChild(tagText);
    tagContainNode.appendChild(tagNode);
  });
}

//댓글 출력 함수
function displayComment(comments) {
  comments.forEach(comment => {
    const commentDiv = document.createElement("div");
    const commentContainer = document.querySelector(
      ".detail-comment_container",
    );

    commentDiv.innerHTML += `
    <div class="detail-comment_information">
            <div class="detail-comment_information-header">
              <img
                class="detail-comment_header-profile_src"
                src="${comment.user.profileImage}"
                alt=""
              />
              <div class="detail-comment_header-container">
                <p class="detail-comment_header-profile_name">${comment.user.name}</p>
                <p class="detail-comment_header_date">${comment.createdAt}</p>
              </div>
              <div class="detail-comment_header-container_btn">
                <button class="detail-comment_header-btn">
                  <img
                    src="/src/assets/icons/detail-btn.svg"
                    alt="답글 추가 보기"
                  />
                </button>
              </div>
            </div>

            <p class="detail-comment_information-description">
             ${comment.content}
            </p>
            <button class="detail-comment_information-btn">답글달기</button>
          </div>
            </div> 
          `;
    commentContainer.insertBefore(
      commentDiv,
      commentContainer.querySelector(".detail-comment_writing"),
    );
  });
}

//json출력 함수
function displayPost(data) {
  const post = data.item[0]; //첫번째 item
  //상세 페이지 헤더 출력
  titleNode.innerHTML = post.title;
  authorNode.innerHTML = post.user.name;
  dateNode.innerHTML = post.createdAt;
  contentImageNode.setAttribute("src", post.content.src);
  subTitle.innerHTML = post.subTitle;

  //콘텐츠 출력
  contentNode.innerHTML = post.content; //보류,,

  //푸터 프로필 출력
  likeNode.innerHTML = post.likes;
  jobNode.innerHTML = post.user.job;
  profileAuthorNode.innerHTML = post.user.name;
  profileDescription.innerHTML = post.user.introduction;
  profileSrc.setAttribute("src", post.user.profileImage);
  subscribeCount.innerHTML = post.user.subscribers;

  //댓글-comment 개수 출력
  commentCountNode.innerHTML = post.repliesCount;
  //태그 출력
  displayTags(post.tag);
  //댓글 출력
  displayComment(post.comments);
}

window.onload = function () {
  displayPost(jsonData);
};
