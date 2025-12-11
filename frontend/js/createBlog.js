const form = document.getElementById("blogForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to create a blog.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title, description })
    });

    const data = await res.json();
    console.log("Create response:", data);

    if (!res.ok) {
      alert(data.message || "Blog creation failed");
      return;
    }

    alert("Blog created successfully!");
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("Error connecting to backend");
    console.error(err);
  }
});
