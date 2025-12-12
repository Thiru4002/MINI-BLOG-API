const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

async function loadProfile() {
  try {
    const res = await fetch(`https://mini-blog-api-m5ys.onrender.com/api/users/profile/${userId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load profile");
      return;
    }

    document.getElementById("myUsername").textContent = "Username: " + data.data.user.username;
    document.getElementById("myEmail").textContent = "Email: " + data.data.user.email;
    document.getElementById("myJoined").textContent =
      "Joined: " + new Date(data.data.user.createdAt).toLocaleDateString();

  } catch (err) {
    console.error(err);
    alert("Error loading profile");
  }
}

loadProfile();


// Show edit box
document.getElementById("editProfileBtn").addEventListener("click", () => {
  document.getElementById("editProfileBox").style.display = "block";
});


// Save new username
document.getElementById("saveUsernameBtn").addEventListener("click", async () => {
  const newUsername = document.getElementById("newUsername").value.trim();

  if (!newUsername) {
    alert("Username cannot be empty");
    return;
  }

  try {
    const res = await fetch("https://mini-blog-api-m5ys.onrender.com/api/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ username: newUsername })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update profile");
      return;
    }

    alert("Profile Updated!");
    loadProfile();

  } catch (err) {
    console.error(err);
    alert("Error updating profile");
  }
});
