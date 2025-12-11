async function loadDashboard() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/users/dashboard", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Dashboard Error: " + (data.message || ""));
      return;
    }

    const user = data.data.user;
    const posts = data.data.posts;

    console.log("DASHBOARD POSTS:", posts);



    // Fill username
    document.getElementById("username").textContent = user.username;

    // Fill total posts
    document.getElementById("totalPosts").textContent = posts.length;

    // Fill blog list
    const blogList = document.getElementById("blogList");

    if (posts.length === 0) {
      blogList.innerHTML = "<p>You have not created any blogs yet.</p>";
      return;
    }

  blogList.innerHTML = posts
    .map(post => `
      <div class="blog-item">
        <h3>${post.title}</h3>
        <p>${post.description}</p>

        <div class="blog-actions">
          <a href="details.html?id=${post._id}" class="btn">View</a>
          <a href="edit.html?id=${post._id}" class="btn">Edit</a>
          <button class="btn delete-btn" onclick="deletePost('${post._id}')">Delete</button>
        </div>
      </div>
    `)
    .join("");


  } catch (err) {
    console.log(err);
    alert("Error loading dashboard");
  }
}

loadDashboard();

async function deletePost(postId) {
  const confirmDelete = confirm("Are you sure you want to delete this blog?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete");
      return;
    }

    alert("Blog deleted successfully!");

    // Reload dashboard
    loadDashboard();

  } catch (err) {
    console.error(err);
    alert("Error deleting post");
  }
}

