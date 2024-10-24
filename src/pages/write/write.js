"use strict";
import axios from "axios";

document.getElementById("btnPost").addEventListener("click", postClick);
document.getElementById("btnExit").addEventListener("click", exitClick);
document
  .getElementById("btnFileUpload")
  .addEventListener("click", fileUploadClick);

/* 게시물 등록 함수 */
async function postClick() {
  let mainTitle = document.querySelector("#mainTitle");
  let subTitle = document.querySelector("#subTitle");
  let content = document.querySelector("#contents");
  // let textContents = content.innerHTML;

  if (!mainTitle || !content) {
    alert("제목 혹은 내용을 입력해주세요.");
    return;
  }

  const postData = {
    title: mainTitle.value,
    subTitle: subTitle.value,
    content: content.value,
  };
  console.log("postData : ", postData);
  console.log("postData.content : ", postData.textContents);

  try {
    const response = await axios.post("https://11.fesp.shop/posts", postData, {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
      },
    });

    // console.log(response);
    console.log("Post Success! :", response.data);
    alert("게시글이 성공적으로 등록되었습니다");
  } catch (error) {
    console.error("Error Post! :", error);
    alert("게시글 등록에 실패했습니다.");
  }
}

/* 게시물 취소 함수 */
function exitClick() {
  const exit = confirm("글쓰기를 취소하시겠습니까?");
  if (exit) {
    window.open("main.html");
  }
}

/* 파일 업로드 함수 */
function fileUploadClick(input) {
  let file = input.files[0];

  var newImage = document.createElement("img");
  newImage.setAttribute("class", "img");

  newImage.src = URL.createObjectURL(file);

  newImage.style.width = "70%";
  newImage.style.height = "70%";
  newImage.style.visibility = "hidden";
  newImage.style.objectFit = "contain";

  var container = document.getElementById("image-show");
  container.appendChild(newImage);
}
