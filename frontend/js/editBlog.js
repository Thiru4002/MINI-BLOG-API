// Get blog id from URL example: edit.html?id=123
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

// Load existing blog data into form
async function loadBlog() {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${blogId}`);
    const data = await res.json();

    if (!res.ok || !data.data) {
      alert("Failed to load blog details");
      return;
    }

    document.getElementById("title").value = data.data.title;
    document.getElementById("description").value = data.data.description;

  } catch (err) {
    console.error(err);
    alert("Failed to load blog details");
  }
}

loadBlog(); // Don't forget to call this function!

// Handle form submit (UPDATE)
const form = document.getElementById("editForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  // At least one field must be filled
  if (title === "" && description === "") {
    alert("You must fill at least one field (Title or Description)!");
    return;
  }

  const token = localStorage.getItem("token");

  // Only send fields that are not empty
  const body = {};
  if (title !== "") body.title = title;
  if (description !== "") body.description = description;

  const res = await fetch(`http://localhost:5000/api/posts/${blogId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Failed to update blog");
    return;
  }

  alert("Blog updated successfully!");
  window.location.href = "details.html?id=" + blogId;
});
// Cancel button handler (MOVED OUTSIDE the form submit handler)
document.getElementById("cancelBtn").addEventListener("click", () => {
  const confirmCancel = confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
  
  if (confirmCancel) {
    window.location.href = "dashboard.html";
  }
});