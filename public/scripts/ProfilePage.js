const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const avatarUpload = document.getElementById("avatarUpload");
  const avatarPreview = document.getElementById("avatarPreview");

  editBtn.addEventListener("click", () => {
    nameInput.disabled = false;
    emailInput.disabled = false;
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
  });

  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    nameInput.disabled = true;
    emailInput.disabled = true;
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    alert("Profile updated successfully!");
  });

  avatarUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => avatarPreview.src = reader.result;
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("submitIDBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("idUpload");
    if (!fileInput.files.length) {
      alert("Please upload a valid ID before submitting.");
      return;
    }
    document.getElementById("statusBox").innerHTML =
      'Status: <span class="font-medium text-yellow-600">Pending Admin Validation</span>';
    alert("Your ID has been submitted.");
  });