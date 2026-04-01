const Auth = {

  user: {
    username: "admin",
    password: "12345"
  },

  init() {
    this.bindEvents();
    this.check(); // 🔥 pastikan dipanggil setelah DOM siap
  },

  bindEvents() {
    window.login = () => this.login();
    window.logout = () => this.logout();

    const pass = document.getElementById("password");
    if (pass) {
      pass.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.login();
        }
      });
    }
  },

  login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (
      username === this.user.username &&
      password === this.user.password
    ) {
      localStorage.setItem("isLogin", "true");

      this.showApp();
    } else {
      alert("Username atau password salah!");
    }
  },

  logout() {
    localStorage.removeItem("isLogin");
    location.reload();
  },

  check() {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin === "true") {
      this.showApp();
    } else {
      this.showLogin();
    }
  },

  showApp() {
    const loginPage = document.getElementById("loginPage");
    const app = document.getElementById("app");

    if (loginPage) loginPage.style.display = "none";
    if (app) app.style.display = "block";
  },

  showLogin() {
    const loginPage = document.getElementById("loginPage");
    const app = document.getElementById("app");

    if (loginPage) loginPage.style.display = "flex";
    if (app) app.style.display = "none";
  }
};
