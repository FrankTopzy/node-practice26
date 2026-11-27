
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3500/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }

    message.textContent = data.message;

    console.log("Login response:", data);

  } catch (error) {
    message.textContent = error.message;
    console.error(error);
  }
});


refreshBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3500/users/refresh", {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token refresh failed.");
    }

    message.textContent = data.message;

    console.log("Refresh response:", data);

  } catch (error) {
    message.textContent = error.message;
    console.error(error);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3500/users/logout", {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "logout failed.");
    }

    message.textContent = data.message;

    console.log("logout response:", data);

  } catch (error) {
    message.textContent = error.message;
    console.error(error);
  }
});

