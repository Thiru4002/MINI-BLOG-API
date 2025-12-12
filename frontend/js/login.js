const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://mini-blog-api-m5ys.onrender.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE USER:", data.user);

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }



    // Save token
    localStorage.setItem("token", data.token);

    // ⭐ Save correct userId
    localStorage.setItem("userId", data.user.id);

    alert("Login successful!");
    window.location.href = "list.html";

  } catch (err) {
    alert("Something went wrong");
    console.error(err);
  }
});
