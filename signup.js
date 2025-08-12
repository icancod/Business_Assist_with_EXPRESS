document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const output = document.getElementById("output");

  // Highlight selected radio label
//   const radioLabels = document.querySelectorAll(".radio-label");

//   radioLabels.forEach(label => {
//     const input = label.querySelector("input[type='radio']");
//     input.addEventListener("change", () => {
//       radioLabels.forEach(l => l.classList.remove("highlighted"));
//       label.classList.add("highlighted");
//     });
//   });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const productCategory = document.querySelector("#productCategory").value;
    const serviceLevel = document.querySelector("input[name='serviceLevel']:checked").value;

    output.innerHTML = `
      <h2 class="text-2xl font-bold mb-4 text-blue-600">Your Submission</h2>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Product Category:</strong> ${productCategory}</p>
      <p><strong>Preferred Service Level:</strong> ${serviceLevel}</p>
    `;

    output.classList.remove("hidden");
  });
});
