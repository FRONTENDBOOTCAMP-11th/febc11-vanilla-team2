import axios from "axios";

window.onload = function () {
  const loginEmail = document.querySelector("#loginEmail"); // 로그인 인풋
  const loginPassword = document.querySelector("#loginPassword"); // 패스워드 인풋
  const loginBtn = document.querySelector("#loginBtn"); // 로그인 버튼
  const checkBtn = document.querySelector(".login-form_check-container");

  // 이메일 유효성 검사
  function emailVaild(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 로그인 버튼 클릭 시 비동기 처리
  loginBtn.addEventListener("click", async e => {
    e.preventDefault(); // 폼의 기본 동작을 막음

    const emailValue = loginEmail.value;
    const pwValue = loginPassword.value;

    // 로그인 및 비밀번호 입력 유효성 검사
    if (!emailValue || !pwValue) {
      alert("이메일과 비밀번호를 입력하세요");
      return;
    }

    // 이메일 유효성 검사
    if (!emailVaild(emailValue)) {
      alert("유효한 이메일을 입력하세요");
      return;
    }

    try {
      // 서버에 POST 요청
      const response = await axios.post(
        "https://11.fesp.shop/users/login",
        {
          email: emailValue,
          password: pwValue, // 데이터 전송
        },
        {
          headers: {
            "Content-Type": "application/json",
            "client-id": "vanilla02", // 서버 클라이언트 ID
          },
        },
      );

      // 응답 확인
      console.log("응답 확인", response.data);

      // 로그인 성공 확인
      if (response.data.ok === 1) {
        console.log("로그인 성공 데이터", response.data.item);
        //엑세스 토큰 저장해야함

        const accessToken = response.data.item.token.accessToken;
        const refreshToken = response.data.item.token.refreshToken; //토큰 접근
        sessionStorage.setItem("accessToken", accessToken); //토큰 세션 스토리지에 저장함
        sessionStorage.setItem("refreshToken", refreshToken);
        window.location.href = "/src/pages/main/main.html"; //저장 후 메인으로 이동
      } else {
        console.error("로그인 실패:", response.data);
      }
    } catch (error) {
      console.error("에러 발생", error);
    }
  });
};
