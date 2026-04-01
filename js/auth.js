const Auth = {
  login() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";
  },

  logout() {
    location.reload();
  }
};
