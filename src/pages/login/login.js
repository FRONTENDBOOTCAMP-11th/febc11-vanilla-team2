import axios from "axios";

window.onload = function () {
  const loginEmail = document.querySelector("#loginEmail"); // 로그인 인풋
  const loginPassword = document.querySelector("#loginPassword"); // 패스워드 인풋
  const loginBtn = document.querySelector("#loginBtn"); // 로그인 버튼
  const signupBtn = document.querySelector("#loginAccountBtn"); //회원가입 버튼
  const checkBtn = document.querySelector(".login-form_check-container");

  // 첫 화면 로그인 버튼 누름과 관련 없이 체크버튼 클릭(활성화 되도록) => 체크 버튼 누르면 로그인 후 로컬에 저장 가능하게 => 아닐시 세션에 저장

  let accessToken = "";
  let refreshToken = "";
  let loginSave = false;

  //로그인 저장 체크버튼 클릭시 로컬에 저장함
  const storagedAccessToken = localStorage.getItem("accessToken");
  const storagedRefreshTokenToken = localStorage.getItem("refreshToken");
  if (storagedAccessToken && storagedRefreshTokenToken) {
    window.location.href = "src/pages/main/main.html";
  }

  //로그인 저장버튼 클릭 시 자동저장 구현

  //로그인 저장버튼 클릭
  checkBtn.addEventListener("click", async e => {
    e.preventDefault();
    console.log("버튼클릭");
    loginSave = !loginSave; //로그인 저장 버튼 버튼 토글 , true면 저장
    // localStorage.setItem("accessToken", accessToken);
    // localStorage.setItem("refreshToken", refreshToken);
    // loginSave = true;
    console.log("로컬 저장 true 여부", loginSave);
    const checkBtnColor = document.querySelector(
      ".login-form_button-checkBtn_cover",
    );
    if (loginSave) {
      checkBtnColor.src = "/src/assets/icons/ic-check-on.svg";
      signupBtn.classList.add("visually_hidden"); //회원가입 버튼 숨김
      loginBtn.style.backgroundColor = "var(--color-green20)"; //로그인 버튼 색 변화
      loginBtn.style.color = "var(--color-white)";
    } else {
      checkBtnColor.src = "/src/assets/icons/ic-check-off.svg"; //원래 기본 값
      signupBtn.classList.remove("visually_hidden");
      loginBtn.style.backgroundColor = "";
      loginBtn.style.color = "";
    }
  });

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
    if (!emailValue && !pwValue) {
      // 1단계 - 둘 다 비어있으면 입력칸
      alert("이메일과 비밀번호를 입력하세요");
      return;
    } else if (emailValue.trim().length === 0 && pwValue.trim().length !== 0) {
      alert("이메일을 입력해주세요"); //이메일 비어있고 비번만 있을 때
    } // 이메일 유효성 검사
    else if (!emailVaild(emailValue)) {
      //2단계 - 이메일 입력 했는데 유효하지 않을 때
      alert("유효한 이메일을 입력하세요");
      return;
    } else if (emailVaild(emailValue) && pwValue.trim().length === 0) {
      //3단계 - 이메일 유효하지만 비밀번호 비었을 때 알림
      alert("비밀번호를 입력해주세요");
      return;
    }

    // 서버에 POST 요청
    try {
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
        console.log("세션에 저장");

        //체크버튼 활성화  => 로컬에 저장
        if (loginSave) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }
        window.location.href = "/src/pages/main/main.html"; //저장 후 메인으로 이동
      } else {
        console.error("로그인 실패:", response.data);
      }
    } catch (error) {
      alert("가입되지 않은 계정입니다. 회원가입을 진행해주세요.");
      loginEmail.value = "";
      loginPassword.value = "";
    }
  });

  //회원가입 버튼 누르면 회원가입 화면으로 이동

  signupBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "/src/pages/login/signup.html";
  });
};
