import axios from "axios";

document.getElementById("btnPost").addEventListener("click", postClick);
document.getElementById("btnExit").addEventListener("click", exitClick);

async function postClick() {
  let mainTitle = document.querySelector("#mainTitle");
  let subTitle = document.querySelector("#subTitle");
  let content = document.querySelector("#contents");

  if (!mainTitle || !content) {
    alert("제목 혹은 내용을 입력해주세요.");
    return;
  }

  const postData = {
    mainTitle: mainTitle.value,
    subTitle: subTitle.value,
    content: content.vaule,
  };

  try {
    const response = await axios.post("https://11.fesp.shop/posts", postData, {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
      },
    });

    console.log(response);
    // 객체 생성 후 입력칸 초기화
    mainTitle.value = "";
    subTitle.value = "";
    content.value = "";

    console.log("Post Success! :", response.data);
    alert("게시글이 성공적으로 등록되었습니다");
  } catch (error) {
    console.error("Error Post! :", error);
    alert("게시글 등록에 실패했습니다.");
  }
}

function exitClick() {
  const exit = confirm("글쓰기를 취소하시겠습니까?");
  if (exit) {
    window.open("main.html");
  }
}
