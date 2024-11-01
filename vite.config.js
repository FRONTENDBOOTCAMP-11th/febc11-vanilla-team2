import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html", // 기본 index.html
        login: "src/pages/login/login.html", // 추가 HTML 파일
        signup: "src/pages/login/signup.html",
        main: "src/pages/main/main.html",
        myDrawer: "src/pages/myDrawer/myDrawer.html",
        search: "src/pages/search/search.html",
        write: "src/pages/write/write.html",
        detailPage: "src/pages/detailPage/detailPage.html",
        author: "src/pages/author/author.html",
        footer: "src/components/footer.html",
        headerLoggedIn: "src/components/header-logged-in.html",
        headerLoggedOut: "src/components/header-logged-out.html",
        // 필요한 다른 HTML 파일을 여기에 추가
      },
    },
  },
});
