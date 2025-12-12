logoutBtn.addEventListener("click", () => {
  // Show confirmation dialog
  const confirmLogout = confirm("Are you sure you want to logout?");
  
  if (confirmLogout) {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    alert("Logged out successfully!");
    window.location.href = "list.html";
  }
  // If user clicks "Cancel", nothing happens
});