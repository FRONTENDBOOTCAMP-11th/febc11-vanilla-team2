"use strict";
import axios from "axios";

document.querySelector("#btnPost").addEventListener("click", postClick);
document.querySelector("#btnExit").addEventListener("click", exitClick);
document.querySelector("#input").addEventListener("change", onChangeFile);

const url = "https://11.fesp.shop";

/* 파일 업로드 함수 */
async function onChangeFile(e) {
  const files = Array.from(e.target.files);
  let imgList = document.querySelector(".add-img-list");
  files.forEach(function (file, index) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const img = document.createElement("img");
      img.setAttribute("class", "add-img-list_image");
      img.src = reader.result;
      imgList.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
  console.log("파일 : ", files);
}

/* 게시물 등록 함수 */
async function postClick(e) {
  let title = document.querySelector("#mainTitle");
  let subTitle = document.querySelector("#subTitle");
  let content = document.querySelector("#contents");

  if (!title || !content) {
    alert("제목 혹은 내용을 입력해주세요.");
    return;
  }

  /* 이미지파일 db 저장 */
  const fileInput = document.getElementById("input");
  const selectedFiles = fileInput.files;
  const imagesFormData = new FormData();
  const arrayImages = [];

  for (let file of selectedFiles) {
    imagesFormData.append("attach", file);
  }

  if (selectedFiles.length > 0) {
    await axios
      .post(`${url}/files`, imagesFormData, {
        headers: {
          "client-id": "vanilla02",
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
      .then(response => {
        for (let i = 0; i < response.data.item.length; i++) {
          arrayImages.push(response.data.item[i].path);
        }
      })
      .catch(error => {
        console.error("Error uploading files:", error);
        alert("파일 업로드에 실패했습니다.");
      });
  }

  /* 게시물 db 저장 */
  const postData = {
    title: title.value,
    subTitle: subTitle.value,
    content: content.value,
    images: arrayImages,
  };

  try {
    await axios.post(`${url}/posts`, postData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "client-id": "vanilla02",
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });

    alert("게시글이 성공적으로 등록되었습니다.");
    window.location.reload();
  } catch (error) {
    console.error("Error posting data:", error);
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
