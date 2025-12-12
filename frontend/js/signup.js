const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://mini-blog-api-m5ys.onrender.com/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    console.log("Response:", data);  // DEBUG LINE

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);

    alert("Signup successful!");
    window.location.href = "list.html";

  } catch (err) {
    console.error("Signup error:", err);
    alert("Error connecting to server");
  }
});
