const API_URL = "http://localhost:3000/api/staff";
const staffForm = document.getElementById("staffForm");
const staffList = document.getElementById("staffList");
const staffSection = document.getElementById("staffSection");

document.getElementById("viewEmployeesBtn").addEventListener("click", () => {
  staffSection.classList.remove("hidden");
  fetchStaff();
});

document.getElementById("addEmployeeBtn").addEventListener("click", () => {
  staffForm.classList.toggle("hidden");
  staffForm.reset();
  document.getElementById("staffId").value = "";
});

async function fetchStaff() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderStaff(data);
}

function renderStaff(staff) {
  staffList.innerHTML = "";
  staff.forEach(member => {
    const card = document.createElement("div");
    card.className = "relative bg-white p-4 rounded-lg shadow-md group";
    card.innerHTML = `
      <h3 class="text-lg font-semibold text-blue-600">${member.name}</h3>
      <p><strong>Role:</strong> ${member.role}</p>
      <p><strong>Email:</strong> ${member.email}</p>
      <div class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
        <button onclick="editStaff(${member.id})" class="px-3 py-1 bg-yellow-500 text-white rounded">Update</button>
        <button onclick="deleteStaff(${member.id})" class="px-3 py-1 bg-red-500 text-white rounded">Terminate</button>
      </div>
    `;
    staffList.appendChild(card);
  });
}

staffForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("staffId").value;
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;

  const staffData = { name, role, email };

  if (id) {
    await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData),
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData),
    });
  }

  staffForm.classList.add("hidden");
  fetchStaff();
});

async function editStaff(id) {
  const res = await fetch(`${API_URL}?id=${id}`);
  const data = await res.json();
  staffForm.classList.remove("hidden");
  document.getElementById("staffId").value = data.id;
  document.getElementById("name").value = data.name;
  document.getElementById("role").value = data.role;
  document.getElementById("email").value = data.email;
}

async function deleteStaff(id) {
  if (confirm("Are you sure you want to terminate this staff member?")) {
    await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
    fetchStaff();
  }
}
