// Global variables
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Check if we have a user ID
  const userId = localStorage.getItem('currentUserId');
  if (!userId) {
    alert('No user session found. Please sign up first.');
    window.location.href = 'signup.html';
    return;
  }

  // Load user data
  await loadUserData(userId);

  // Set up event listeners
  document.getElementById('refreshBtn').addEventListener('click', () => loadUserData(userId));
  document.getElementById('editBtn').addEventListener('click', showEditForm);
  document.getElementById('cancelEditBtn').addEventListener('click', hideEditForm);
  document.getElementById('deleteBtn').addEventListener('click', () => deleteUser(userId));
  document.getElementById('downloadBtn').addEventListener('click', downloadProfile);
  document.getElementById('getAllUsersBtn').addEventListener('click', fetchAllUsers);
  document.getElementById('closeAllUsersBtn').addEventListener('click', () => {
    document.getElementById('allUsersContainer').classList.add('hidden');
  });
  document.getElementById('editForm').addEventListener('submit', (e) => updateUser(e, userId));
  document.getElementById('profilePictureInput').addEventListener('change', handleProfilePicUpdate);
});

// Load user data from backend
async function loadUserData(userId) {
  try {
    showLoading(true);
    
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user data');
    
    const user = await response.json();
    currentUser = user;
    renderUserProfile(user);
    
  } catch (error) {
    console.error('Error loading user data:', error);
    alert(error.message);
  } finally {
    showLoading(false);
  }
}

// Render user profile
function renderUserProfile(user) {
  document.getElementById('fullNameInput').textContent = user.full_name;
  document.getElementById('emailInput').textContent = user.email;
  document.getElementById('phoneInput').textContent = user.phone;
  document.getElementById('productCategoryInput').textContent = user.product_category;
  document.getElementById('serviceLevel').textContent = user.service_level;
  document.getElementById('createdAt').textContent = new Date(user.created_at).toLocaleDateString();
  
  // Set profile picture
  const profilePic = document.getElementById('profilePicture');
  if (user.profile_pic) {
    profilePic.src = `http://localhost:3000/${user.profile_pic}`;
  } else {
    profilePic.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnptMCAzYzEuODQyIDAgMy4zMzMgMS40OTEgMy4zMzMgMy4zMzNTMTMuODQyIDExLjY2NyAxMiAxMS42NjcgOC42NjcgMTAuMTc2IDguNjY3IDguMzMzIDEwLjE1OCA1IDEyIDV6bTAgMTUuMmMtMy41NSAwLTYuNTItMS44ODUtOC4yMTctNC43MDRDNy4xMzEgMTQuMTYzIDEwLjA0IDEzLjIgMTIgMTMuMmMxLjk2IDAgNC44NjkuOTYzIDguMjE3IDIuMjk2QzE4LjUyIDE4LjMxNSAxNS41NSAyMC4yIDEyIDIwLjJ6IiBmaWxsPSIjY2NjIi8+PC9zdmc+';
  }
}

// Show edit form
function showEditForm() {
  if (!currentUser) return;
  
  // Populate form fields
  document.getElementById('editUserId').value = currentUser.id;
  document.getElementById('editFullName').value = currentUser.full_name;
  document.getElementById('editEmail').value = currentUser.email;
  document.getElementById('editPhone').value = currentUser.phone;
  document.getElementById('editProductCategory').value = currentUser.product_category;
  
  // Set radio button
  document.querySelector(`input[name="serviceLevel"][value="${currentUser.service_level}"]`).checked = true;
  
  // Show form
  document.getElementById('editFormContainer').classList.remove('hidden');
}

// Hide edit form
function hideEditForm() {
  document.getElementById('editFormContainer').classList.add('hidden');
}

// Update user
async function updateUser(e, userId) {
  e.preventDefault();
  
  const formData = new FormData(document.getElementById('editForm'));
  
  try {
    showLoading(true);
    
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }
    
    const data = await response.json();
    alert(data.message);
    hideEditForm();
    await loadUserData(userId);
    
  } catch (error) {
    console.error('Error updating user:', error);
    alert(error.message);
  } finally {
    showLoading(false);
  }
}

// Delete user
async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
  
  try {
    showLoading(true);
    
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
    
    const data = await response.json();
    alert(data.message);
    localStorage.removeItem('currentUserId');
    window.location.href = 'signup.html';
    
  } catch (error) {
    console.error('Error deleting user:', error);
    alert(error.message);
  } finally {
    showLoading(false);
  }
}

// Download profile
function downloadProfile() {
  if (!currentUser?.profile_pic) {
    alert('No profile picture available to download');
    return;
  }
  
  const link = document.createElement('a');
  link.href = `http://localhost:3000/${currentUser.profile_pic}`;
  link.download = `${currentUser.full_name.replace(/\s+/g, '_')}_profile.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Handle profile picture update
async function handleProfilePicUpdate(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('profilepicture', file);
  
  try {
    showLoading(true);
    
    const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Profile picture update failed');
    }
    
    const data = await response.json();
    await loadUserData(currentUser.id);
    
  } catch (error) {
    console.error('Error updating profile picture:', error);
    alert(error.message);
  } finally {
    showLoading(false);
    e.target.value = ''; // Reset file input
  }
}

// Fetch all users
async function fetchAllUsers() {
  try {
    showLoading(true);
    const response = await fetch('http://localhost:3000/users');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await response.json();
    renderAllUsers(data.users);
    
  } catch (error) {
    console.error('Error fetching all users:', error);
    alert(error.message);
  } finally {
    showLoading(false);
  }
}

// Render all users
function renderAllUsers(users) {
  const container = document.getElementById('allUsersContainer');
  const list = document.getElementById('allUsersList');
  
  list.innerHTML = '';
  
  if (!users || users.length === 0) {
    list.innerHTML = '<p class="text-gray-500">No users found</p>';
    container.classList.remove('hidden');
    return;
  }
  
  users.forEach(user => {
    const userCard = document.createElement('div');
    userCard.className = 'p-4 border rounded-lg hover:bg-gray-50';
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
            <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              Joined ${new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    `;
    list.appendChild(userCard);
  });
  
  container.classList.remove('hidden');
}

// Show loading state
function showLoading(show) {
  const elements = document.querySelectorAll('button, input, select');
  elements.forEach(el => {
    if (show) {
      el.classList.add('opacity-50');
      el.disabled = true;
    } else {
      el.classList.remove('opacity-50');
      el.disabled = false;
    }
  });
}