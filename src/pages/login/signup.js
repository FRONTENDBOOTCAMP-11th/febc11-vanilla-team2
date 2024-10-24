import axios from "axios";

window.onload = function () {
  const signupNickname = document.querySelector("#signupNickname"); //닉네임 input
  const signupEmail = document.querySelector("#signupEmail"); //이메일 input
  const signupPassword = document.querySelector("#signupPassword"); //비밀번호 input
  const confirmPassword = document.querySelector("#confirmPassword"); //비밀 번호 확인 input
  const emailDuplicationBtn = document.querySelector("#emailDuplicationBtn"); //이메일 중복 확인 버튼
  const passwordBtn = document.querySelector("#passwordBtn"); // 비밀번호 보이게 눈 표시 버튼
  const confirmPasswordBtn = document.querySelector("#confirmPasswordBtn"); //비밀번호 확인 눈 표시 버튼
  const signupBtn = document.querySelector("#signupBtn");

  //회원가입 버튼 클릭
  signupBtn.addEventListener("click", async e => {
    e.preventDefault();
    const email = signupEmail.value;
    const nickname = signupNickname.value;
    const password = signupPassword.value;

    // 이메일 유효성 검사
    function emailVaild(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    //입력 여부 유효성 검사
    //로그인처럼 어느부분이 비었는지 알려주려면
    //경우의수가 너무 많아서 한꺼번에 처리함
    if (!email || !email || !password) {
      alert("모든 입력칸을 채워주세요");
      return;
    }
    if (!emailVaild(email)) {
      alert("유효한 이메일을 입력하세요");
      return;
    }

    try {
      const response = await axios.post(
        "https://11.fesp.shop/users",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "client-id": "vanilla02", // 서버 클라이언트 ID
          },
        },
      );
      //db에 이메일이 이미 있음
      if (response.data.ok === 1) {
        alert("이미 사용중인 이메일입니다. 다른 이메일을 입력해주세요");
      } else {
        console.log("이메일 ");
      }
    } catch (error) {
      console.log(error);
    }
  });

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
