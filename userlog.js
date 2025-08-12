window.onload = function () {
  const form = document.getElementById("loginForm");

  form.onsubmit = function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      alert("Saved to localStorage!");
      form.reset(); // Clear the form after saving
    } else {
      alert("Please fill in both username and password.");
    }
  };
};


