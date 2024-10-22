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
        name: "sunny",
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
      repliesCount: 3,
    },
  ],
  pagination: {
    page: 1,
    limit: 0,
    total: 3,
    totalPages: 1,
  },
};

const titleNode=
