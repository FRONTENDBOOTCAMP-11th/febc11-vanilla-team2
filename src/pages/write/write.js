import axios from "axios";

document.getElementById("btnPost").addEventListener("click", postClick);

async function postClick() {
  let mainTitle = document.querySelector("#mainTitle");
  let subTitle = document.querySelector("#subTitle");
  let contents = document.querySelector("#contents");

  if (!mainTitle || !contents) {
    alert("제목 혹은 내용을 입력해주세요.");
    return;
  }

  const postData = {
    mainTitle: mainTitle,
    subTitle: subTitle,
    contents: contents,
  };

  try {
    const response = await axios.post("https://11.fesp.shop/posts", postData, {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
      },
    });
    console.log("Post Success! :", response.data);
    alert("게시글이 성공적으로 등록되었습니다");
  } catch (error) {
    console.error("Error Post! :", error);
    alert("게시글 등록에 실패했습니다.");
  }
}
