document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const usersList = document.getElementById("usersList");
  const profilePictureInput = document.getElementById("profilePicture");
  const profilePreview = document.getElementById("profilePreview");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const userIdInput = document.getElementById("userId");

  // Preview profile picture
  profilePictureInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        profilePreview.src = event.target.result;
        profilePreview.classList.remove("hidden");
      };
      
      reader.readAsDataURL(file);
    }
  });

  // Load all users
  function loadUsers() {
    fetch("http://localhost:3000/users")
      .then(response => response.json())
      .then(data => {
        usersList.innerHTML = "";
        
        if (data.users && data.users.length > 0) {
          data.users.forEach(user => {
            const userCard = document.createElement("div");
            userCard.className = "p-4 border rounded-lg hover:bg-gray-50";
            userCard.innerHTML = `
              <div class="flex items-start gap-4">
                ${user.profile_pic ? `
                  <img src="http://localhost:3000/${user.profile_pic}" 
                       alt="${user.full_name}" 
                       class="w-12 h-12 rounded-full object-cover border-2 border-white shadow">
                ` : `
                  <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <i class="fas fa-user"></i>
                  </div>
                `}
                <div class="flex-grow">
                  <h3 class="font-semibold">${user.full_name}</h3>
                  <p class="text-sm text-gray-600">${user.email}</p>
                  <div class="mt-2 flex flex-wrap gap-2 text-xs">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${user.service_level}</span>
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${user.product_category}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button onclick="editUser('${user.id}')" class="px-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Edit
                  </button>
                  <button onclick="deleteUser('${user.id}')" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            `;
            usersList.appendChild(userCard);
          });
        } else {
          usersList.innerHTML = '<p class="text-gray-500">No users found</p>';
        }
      })
      .catch(error => {
        console.error("Error loading users:", error);
        usersList.innerHTML = '<p class="text-red-500">Error loading users</p>';
      });
  }

  // Form submission
  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(userForm);
    const userId = userIdInput.value;
    const method = userId ? "PUT" : "POST";
    const url = userId ? `http://localhost:3000/users/${userId}` : "http://localhost:3000/users";

    const userData = {
      full_name:formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      product_category: formData.get("productcategory"),
      service_level: formData.get("servicelevel")
    };
  //     full_name: document.getElementById("name").value, // Get directly from input
  // email: document.getElementById("email").value,
  // phone: document.getElementById("phone").value,
  // product_category: document.getElementById("productCategory").value,
  // service_level: document.querySelector('input[name="servicelevel"]:checked').value
   // }; 
    
    

    
    // fetch(url, {
    //   method: method,
    //   body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.error) {
    //     alert(data.error);
    //   } 

     try {
    // 2. Save/update user
    const userResponse = await fetch(url, {
      method: method,
      body: formData
    });
    
    const userResult = await userResponse.json();
    
    if (userResult.error) throw new Error(userResult.error);

    const emailContent = {
  to: 'sachinsidd10@gmail.com',
  subject: userId ? "Profile Updated" : "Welcome to Our Service",
  text: `Hello ${userData.full_name},\n\n${
    userId ? "Your profile has been updated successfully." 
           : "Thank you for signing up! Your profile has been created successfully."
  }`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: white; margin: 0;">${userId ? 'Profile Updated' : 'Welcome!'}</h2>
      </div>
      
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hello <strong>${userData.full_name}</strong>,</p>
        
        <p>${userId 
          ? 'Your profile has been successfully updated with the following details:'
          : 'Thank you for registering with us! Here are your account details:'
        }</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; width: 40%; font-weight: bold;">Full Name:</td>
              <td style="padding: 8px 0;">${userData.full_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${userData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${userData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Product Category:</td>
              <td style="padding: 8px 0;">${userData.product_category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Service Level:</td>
              <td style="padding: 8px 0;">${userData.service_level}</td>
            </tr>
          </table>
        </div>

        ${!userId ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://yourwebsite.com/login" 
               style="display: inline-block; background-color: #2563eb; color: white; 
                      padding: 12px 24px; text-decoration: none; border-radius: 4px;
                      font-weight: bold;">
              Get Started
            </a>
          </div>
        ` : ''}

        <p style="font-size: 14px; color: #64748b;">
          If you didn't request this ${userId ? 'update' : 'account'}, please contact our support team immediately.
        </p>
      </div>
      
      <div style="text-align: center; padding: 15px; background-color: #f1f5f9; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b;">
        <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </div>
  `
};

    // 4. Send email
    try {
    const emailResponse = await fetch(`http://localhost:3000/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailContent)
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) throw new Error('Email sending failed');

    console.log("Email sent:", emailResult.message);
    // 5. Show success
    resetForm();
    loadUsers();
    alert(userId ? 
      "Profile updated successfully. Confirmation email sent." : 
      "Account created successfully. Welcome email sent.");
    
  }catch (emailErr) {
    
    resetForm();
    loadUsers();
    alert(`User ${userId ? "updated" : "created"} successfully, but email failed: ${emailErr.message}`);
  }
  
}catch (error) {
     console.error("Main error:", error);
  alert("Failed to save user: " + error.message);
  }
});




      
  //     fetch(`http://localhost:3000/send-email`, {
  //       method: "POST",
  //       headers: {  
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         to: 'sachinsidd10@gmail.com',
  //         subject: userId ? "Profile Updated" : "Welcome to Our Service",
  //         text: userId ?
  //           `Hello ${userData.full_name},\n\nYour profile has been updated successfully.` :
  //           `Hello ${userData.full_name},\n\nThank you for signing up! Your profile has been created successfully.` 
  //       })
  //     }).catch(error => {
  //       console.error("Error sending email:", error);
  //       alert("Profile updated but email notification failed.");
  //     });
  //     //else {
  //       resetForm();
  //       loadUsers();
  //       alert(userId ? "User updated successfully" : "User added successfully");
  //     //}
  //   })
  //   .catch(error => {
  //     console.error("Error:", error);
  //     alert("An error occurred");
  //   });
  // });

  // Cancel edit
  cancelBtn.addEventListener("click", resetForm);

  // Reset form
  function resetForm() {
    userForm.reset();
    userIdInput.value = "";
    profilePreview.src = "";
    profilePreview.classList.add("hidden");
    formTitle.textContent = "Add New User";
    submitBtn.textContent = "Add User";
    cancelBtn.classList.add("hidden");
  }

  // Edit user
  window.editUser = (id) => {
    fetch(`http://localhost:3000/users/${id}`)
      .then(response => response.json())
      .then(user => {
        console.log("User data received from server:", user);  //up
        document.getElementById("fullName").value = user.full_name || '';
        document.getElementById("email").value = user.email || '';
        document.getElementById("phone").value = user.phone || '';
        document.getElementById("productCategory").value = user.product_category || '';
         if (user.service_level) {
        const serviceLevelRadio = document.querySelector(`input[name="servicelevel"][value="${user.service_level}"]`);
        if (serviceLevelRadio) {
          serviceLevelRadio.checked = true;
        } else {
          console.warn(`Could not find a radio button for service_level: "${user.service_level}"`);
        }
      }
      
      // Handle the profile picture preview
      profilePreview.src = "";
      profilePreview.classList.add("hidden");
        if (user.profile_pic) {
          profilePreview.src = `http://localhost:3000/${user.profile_pic}`;
          profilePreview.classList.remove("hidden");
        }
        
        userIdInput.value = user.id;
        formTitle.textContent = "Edit User";
        submitBtn.textContent = "Update User";
        cancelBtn.classList.remove("hidden");
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        alert("Error loading user data");
      });
  };

  // Delete user
  window.deleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE"
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          loadUsers();
          alert("User deleted successfully");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while deleting user");
      });
    }
  };

  // Initial load
  loadUsers();
});