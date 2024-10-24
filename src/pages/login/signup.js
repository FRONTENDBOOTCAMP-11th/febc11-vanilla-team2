import axios from "axios";

window.onload = function () {
  const signupNickname = document.querySelector("#signupNickname"); //닉네임 input
  const signupEmail = document.querySelector("#signupEmail"); //이메일 input
  const signupPassword = document.querySelector("#signupPassword"); //비밀번호 input
  const confirmPassword = document.querySelector("#confirmPassword"); //비밀 번호 확인 input
  const nameDuplicationBtn = document.querySelector("#nameDuplicationBtn"); // 별명 중복 확인 버튼
  const emailDuplicationBtn = document.querySelector("#emailDuplicationBtn"); //이메일 중복 확인 버튼
  const passwordBtn = document.querySelector("#passwordBtn"); // 비밀번호 보이게 눈 표시 버튼
  const confirmPasswordBtn = document.querySelector("#confirmPasswordBtn"); //비밀번호 확인 눈 표시 버튼

  //별명 중복확인 => 같은 닉네임이 db에 있으면 안됨

  //비밀번호 눈알 버튼 클릭 하면 내용 보이게
  passwordBtn.addEventListener("click", () => {
    if (signupPassword.type === "password") {
      signupPassword.type = "text";
    } else {
      signupPassword.type = "password";
    }
  });

  //비밀번호 확인 눈알 버튼 클릭 하면 내용 보이게
  confirmPasswordBtn.addEventListener("click", () => {
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";
    } else {
      confirmPassword.type = "password";
    }
  });
};
