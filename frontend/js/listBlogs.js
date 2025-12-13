document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  const listEl = document.getElementById("allBlogs");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  async function loadAllBlogs(searchQuery = "") {
    const url = searchQuery
      ? `https://mini-blog-api-m5ys.onrender.com/api/posts?search=${encodeURIComponent(searchQuery)}`
      : `https://mini-blog-api-m5ys.onrender.com/api/posts`;

    try {
      if (loading) loading.style.display = "flex"; // SHOW

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load blogs");
        return;
      }

      const blogs = data.posts || [];

      if (blogs.length === 0) {
        listEl.innerHTML = "<p>No blogs found.</p>";
        return;
      }

      listEl.innerHTML = blogs.map(post => `
        <div class="blog-item">
          <h3>${post.title}</h3>
          <p>By <strong>${post.author?.username || "Unknown"}</strong></p>
          <p>${new Date(post.createdAt).toLocaleDateString()}</p>
          <p>${post.description}</p>
          <div class="blog-actions">
            <a href="details.html?id=${post._id}" class="btn">View</a>
          </div>
        </div>
      `).join("");

    } catch (err) {
      console.error("Blog load error:", err);
      alert("Server is waking up, please try again");

    } finally {
      // ✅ ALWAYS runs (success / error / return)
      if (loading) loading.style.display = "none"; // HIDE
    }
  }

  loadAllBlogs();

  searchBtn.addEventListener("click", () => {
    loadAllBlogs(searchInput.value.trim());
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      loadAllBlogs(e.target.value.trim());
    }
  });
});
