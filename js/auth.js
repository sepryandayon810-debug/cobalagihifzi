const Auth = {

  user: {
    username: "admin",
    password: "12345"
  },

  init() {
    this.check();
    this.bindEvents();
  },

  bindEvents() {
    // tombol login
    window.login = () => this.login();

    // enter di password
    const pass = document.getElementById("password");
    if (pass) {
      pass.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.login();
        }
      });
    }

    // logout global
    window.logout = () => this.logout();
  },

  login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (
      username === this.user.username &&
      password === this.user.password
    ) {
      localStorage.setItem("isLogin", "true");

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("app").style.display = "block";
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
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("app").style.display = "block";
    } else {
      document.getElementById("loginPage").style.display = "flex";
      document.getElementById("app").style.display = "none";
    }
  }
};
