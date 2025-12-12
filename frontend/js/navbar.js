const nav = document.getElementById("navLinks");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (token && userId) {
  // Logged IN Navbar
  nav.innerHTML = `
    <li><a href="profile.html">My Profile</a></li>
    <li><a href="dashboard.html">Dashboard</a></li>
    <li><a href="list.html">All Blogs</a></li>
    <li><a href="create.html">Create New</a></li>
    <li><a id="logoutBtn" style="cursor:pointer;">Logout</a></li>
  `;

  // Logout handler
  document.getElementById("logoutBtn").addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      alert("Logged out successfully!");
      window.location.href = "list.html";
    }
  });
} 
else {
  // Logged OUT Navbar
  nav.innerHTML = `
    <li><a href="login.html">Login</a></li>
    <li><a href="signup.html">Signup</a></li>
  `;
}
