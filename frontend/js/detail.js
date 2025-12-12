// Get ID from URL
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
const currentUserId = localStorage.getItem("userId");

console.log("POST ID:", postId);

// Load the single post
async function loadPost() {
  try {
    const res = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/posts/${postId}`);
    const data = await res.json();

    if (!res.ok || !data?.data) {
      alert(data?.message || "Failed to load post");
      return;
    }

    const post = data.data;
    window.currentPost = post; // store for like system

    const titleEl = document.getElementById("postTitle");
    const descEl = document.getElementById("postDescription");
    const authorEl = document.getElementById("postAuthor");
    const dateEl = document.getElementById("postDate");
    const likesEl = document.getElementById("likesCount");
    const likeBtn = document.getElementById("likeBtn");

    if (titleEl) titleEl.textContent = post.title;
    if (descEl) descEl.textContent = post.description;

    if (authorEl) {
      authorEl.textContent = post.author?.username;
      authorEl.href = `author.html?userId=${post.author?._id}`;
    }

    if (dateEl) dateEl.textContent = new Date(post.createdAt).toLocaleDateString();
    if (likesEl) likesEl.textContent = "Likes: " + (post.likes?.length || 0);

    // Set Like button (but only if logged in)
    if (likeBtn) {
      if (!currentUserId) {
        likeBtn.textContent = "Like";
      } else {
        const isLiked = post.likes?.some(l => l.toString() === currentUserId);
        likeBtn.textContent = isLiked ? "Unlike" : "Like";
      }
    }

    // OWNER ACTIONS
    const owner = post.author?._id === currentUserId;
    const ownerActionsContainer = document.getElementById("ownerActions");

    if (owner) {
      ownerActionsContainer.innerHTML = `
        <a class="btn" href="edit.html?id=${post._id}">Edit</a>
        <button id="deleteBtnGenerated" class="btn delete-btn">Delete</button>
      `;

      // delete handler
      document.getElementById("deleteBtnGenerated").onclick = async () => {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "login.html";

        const resDel = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/posts/${post._id}`, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token }
        });

        const delData = await resDel.json();
        if (!resDel.ok) return alert(delData.message);

        alert("Post deleted!");
        window.location.href = "list.html";
      };

    } else {
      ownerActionsContainer.innerHTML = ""; // remove any leftover buttons
    }

  } catch (err) {
    console.error(err);
    alert("Error loading post");
  }
}

loadPost();

/* ----------------------------------
   COMMENTS SECTION (with login check)
---------------------------------- */
async function loadComments() {
  try {
    const res = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/comments/${postId}`);
    const data = await res.json();

    if (!res.ok) {
      document.getElementById("commentsList").innerHTML = "<p>Failed to load comments</p>";
      return;
    }

    const comments = data.comments;
    const userId = localStorage.getItem("userId");

    document.getElementById("commentsList").innerHTML = comments.map(c => `
      <div class="comment">
        <strong>${c.author.username}</strong>
        <p>${c.content}</p>

        ${userId && c.author._id === userId ? `
          <button class="btn editCommentBtn" data-id="${c._id}">Edit</button>
          <button class="btn deleteCommentBtn" data-id="${c._id}">Delete</button>
        ` : ""}
      </div>
    `).join("");

    attachCommentListeners();

  } catch (err) {
    console.error(err);
  }
}

loadComments();

/* Prevent guests from posting comments */
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");

if (!localStorage.getItem("token")) {
  commentInput.disabled = true;
  addCommentBtn.textContent = "Login to Comment";

  addCommentBtn.onclick = () => {
    window.location.href = "login.html";
  };
} else {
  addCommentBtn.onclick = async () => {
    const content = commentInput.value.trim();
    if (!content) return alert("Comment cannot be empty");

    const token = localStorage.getItem("token");

    const res = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ content })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    commentInput.value = "";
    loadComments();
  };
}

/* COMMENT EDIT/DELETE ONLY FOR LOGGED USER */
function attachCommentListeners() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Prevent guest from clicking any edit/delete buttons that appear
  if (!token || !userId) return;

  // Delete comment
  document.querySelectorAll(".deleteCommentBtn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      const res = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/comments/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });

      if (res.ok) loadComments();
      else alert("Failed to delete");
    };
  });

  // Edit comment
  document.querySelectorAll(".editCommentBtn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const newContent = prompt("Edit your comment:");

      if (!newContent) return;

      const res = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent })
      });

      if (res.ok) loadComments();
      else alert("Update failed");
    };
  });
}

/* ----------------------------------
   LIKE BUTTON (with login check)
---------------------------------- */
document.getElementById("likeBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Must login before liking
  if (!token || !userId) {
    alert("You must be logged in to like posts.");
    return window.location.href = "login.html";
  }

  const post = window.currentPost;
  const isLiked = post.likes.includes(userId);

  const url = isLiked
    ? `https://mini-blog-api-m5ys.onrender.com/api/posts/unlike/${postId}`
    : `https://mini-blog-api-m5ys.onrender.com/api/posts/like/${postId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": "Bearer " + token }
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById("likesCount").textContent =
      `Likes: ${data.likesCount || data.likeCount}`;

    document.getElementById("likeBtn").textContent = isLiked ? "Like" : "Unlike";

    loadPost(); // refresh like state
  } else {
    alert(data.message);
  }
});
