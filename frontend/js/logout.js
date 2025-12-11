document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      alert("Logged out successfully!");
      window.location.href = "list.html";
    });
  }
});
