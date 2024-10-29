"use strict";
import axios from "axios";

document.querySelector("#btnPost").addEventListener("click", postClick);
document.querySelector("#btnExit").addEventListener("click", exitClick);
document.querySelector("#input").addEventListener("change", onChangeFile);

const url = "https://11.fesp.shop";

/* 파일 업로드 함수 */
async function onChangeFile(e) {
  const fileInput = e.target;
  const file = fileInput.files[0];
  let imgList = document.querySelector(".add-img-list");
  let imgUl = document.querySelector(".add-img");

  // image 다시 선택하면 화면 비워주고 최신이미지를 프리뷰로 보여줌
  imgList.innerHTML = "";

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = document.createElement("img");
      img.setAttribute("class", "add-img-list_image");
      img.src = event.target.result;

      const fileName = document.createElement("p");
      fileName.setAttribute("class", "add-img-list_fileName");
      fileName.textContent = `File Name : ${file.name}`;

      imgList.appendChild(img);
      imgList.appendChild(fileName);

      imgUl.appendChild(imgList);
      imgUl.style.display = "inline";
    };

    reader.readAsDataURL(file);
  }
}

/* 게시물 등록 함수 */
async function postClick(e) {
  let title = document.querySelector("#mainTitle");
  let subTitle = document.querySelector("#subTitle");
  let content = document.querySelector("#contents");

  if (!title.value.trim() || !content.value.trim()) {
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
