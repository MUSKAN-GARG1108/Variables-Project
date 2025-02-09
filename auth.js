const API_URL = "http://localhost:5000"; // Change this when deploying

// Signup Function
async function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) window.location.href = "dashboard.html";
}

// Login Function
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        localStorage.setItem("token", data.token); // Store token for authentication
        window.location.href = "dashboard.html";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("token"); // Remove token on logout
    alert("Logged out!");
    window.location.href = "index.html";
}
