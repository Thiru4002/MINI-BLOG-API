document.addEventListener("DOMContentLoaded", () => {
  // Get blog ID from URL: edit.html?id=123
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    alert("Invalid blog ID");
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("editForm");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const cancelBtn = document.getElementById("cancelBtn");

  if (!form || !titleInput || !descriptionInput) {
    console.error("Edit form elements not found");
    return;
  }

  /* ---------------------------
     LOAD EXISTING BLOG
  ---------------------------- */
  async function loadBlog() {
    try {
      const res = await fetch(
        `https://mini-blog-api-m5ys.onrender.com/api/posts/${blogId}`
      );
      const data = await res.json();

      // Handle different backend response shapes safely
      const post = data.data || data.post || data;

      if (!res.ok || !post) {
        alert("Failed to load blog details");
        return;
      }

      titleInput.value = post.title || "";
      descriptionInput.value = post.description || "";

    } catch (err) {
      console.error("Error loading blog:", err);
      alert("Error loading blog details");
    }
  }

  loadBlog();

  /* ---------------------------
     UPDATE BLOG
  ---------------------------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title && !description) {
      alert("Please update at least one field");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "login.html";
      return;
    }

    const body = {};
    if (title) body.title = title;
    if (description) body.description = description;

    try {
      const res = await fetch(
        `https://mini-blog-api-m5ys.onrender.com/api/posts/${blogId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update blog");
        return;
      }

      alert("Blog updated successfully!");
      window.location.href = `details.html?id=${blogId}`;

    } catch (err) {
      console.error("Update failed:", err);
      alert("Server error while updating blog");
    }
  });

  /* ---------------------------
     CANCEL BUTTON
  ---------------------------- */
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      const confirmCancel = confirm(
        "Are you sure you want to cancel? Unsaved changes will be lost."
      );
      if (confirmCancel) {
        window.location.href = "dashboard.html";
      }
    });
  }
});
