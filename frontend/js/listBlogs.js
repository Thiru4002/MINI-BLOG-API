async function loadAllBlogs(searchQuery = "") {
  try {
    const url = searchQuery
      ? `http://localhost:5000/api/posts?search=${encodeURIComponent(searchQuery)}`
      : `http://localhost:5000/api/posts`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load blogs");
      return;
    }

    const blogs = data.posts;
    const listEl = document.getElementById("allBlogs");

    if (blogs.length === 0) {
      listEl.innerHTML = "<p>No blogs found.</p>";
      return;
    }

    listEl.innerHTML = blogs
      .map(
        (post) => `
      <div class="blog-item">
        <h3>${post.title}</h3>
        <p>By <strong>${post.author?.username || "Unknown"}</strong></p>
        <p>${new Date(post.createdAt).toLocaleDateString()}</p>
        <p>${post.description}</p>

        <div class="blog-actions">
          <a href="details.html?id=${post._id}" class="btn">View</a>
        </div>
      </div>
      `
      )
      .join("");

  } catch (err) {
    console.error(err);
    alert("Error loading blogs");
  }
}

loadAllBlogs(); // load initial blogs

// -----------------------------
// SEARCH EVENT
// -----------------------------
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  loadAllBlogs(query);
});

// Press ENTER to search
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = e.target.value.trim();
    loadAllBlogs(query);
  }
});
