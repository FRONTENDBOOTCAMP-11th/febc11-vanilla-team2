import axios from "axios";

const getPosts = async () => {
  try {
    const response = await axios.get("https://11.fesp.shop/posts", {
      headers: {
        "Content-Type": "application/json",
        "client-id": "vanilla02",
      },
      params: { type: "info" },
    });
    console.log("rrrrrr", response);
  } catch (error) {
    if (error.response) {
      // 서버가 응답했으나 400대 에러일 경우
      console.log("Error Response Data:", error.response.data);
      console.log("Error Response Status:", error.response.status);
      console.log("Error Response Headers:", error.response.headers);
    } else if (error.request) {
      // 요청이 이루어졌으나 서버로부터 응답을 받지 못한 경우
      console.log("Error Request:", error.request);
    } else {
      // 요청을 보내기 전에 발생한 에러
      console.log("Error Message:", error.message);
    }
    console.log("Axios Config:", error.config);
  }
};

getPosts();
