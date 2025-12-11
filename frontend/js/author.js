const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");

const token = localStorage.getItem("token");
const currentUserId = localStorage.getItem("userId"); // logged in user

async function loadAuthor() {
  try {
    const res = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load user");
      return;
    }

    const user = data.data.user;
    const posts = data.data.posts;

    document.getElementById("authorName").textContent = user.username;
    document.getElementById("authorEmail").textContent = "Email: " + user.email;
    document.getElementById("authorJoined").textContent =
      "Joined: " + new Date(user.createdAt).toLocaleDateString();
    document.getElementById("postCount").textContent = posts.length;

    if (currentUserId === user._id) {
        document.getElementById("editBtnProfile").style.display = "block";
    }


    // 🔥 Show edit button ONLY if user owns this profile
    if (currentUserId !== user._id) {
      document.getElementById("editBtnProfile").style.display = "none";
      document.getElementById("editProfileBox").style.display = "none";
    }

    // Render posts...
    document.getElementById("authorPosts").innerHTML = posts
      .map(post => `
        <div class="blog-item">
          <h3>${post.title}</h3>
          <p>${post.description.substring(0, 120)}...</p>
          <a href="details.html?id=${post._id}" class="btn">View</a>
        </div>
      `).join("");

  } catch (err) {
    console.error(err);
    alert("Error loading profile");
  }
}

loadAuthor();
