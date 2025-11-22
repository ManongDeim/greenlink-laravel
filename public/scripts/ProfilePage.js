document.addEventListener("DOMContentLoaded", async function () {
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const avatarUpload = document.getElementById("avatarUpload");
  const avatarPreview = document.getElementById("avatarPreview");
  const idUpload = document.getElementById("idUpload");
  const statusBox = document.getElementById("statusBox");

  // Fetch user data
  const profileRes = await fetch("/profile-data");
  const profileData = await profileRes.json();
  if (profileData.success) {
    const user = profileData.user;
    nameInput.value = user.name || "";
    emailInput.value = user.email || "";
    avatarPreview.src = user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    if (user.id_status) {
      statusBox.innerHTML = `Status: <span class="font-medium">${user.id_status}</span>`;
    }
  }

  editBtn.addEventListener("click", () => {
    nameInput.disabled = false;
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
  });

  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("🔹 Submit clicked");

    const formData = new FormData();
    formData.append("name", nameInput.value);
    console.log("📝 Name to update:", nameInput.value);

    if (avatarUpload.files.length) {
        formData.append("avatar", avatarUpload.files[0]);
        console.log("📁 Avatar file to upload:", avatarUpload.files[0]);
    } else {
        console.log("📁 No avatar file selected, skipping upload");
    }

    try {
        const res = await fetch("/profile-update", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });

        console.log("⏳ Response received:", res);

        if (!res.ok) {
            console.error("❌ Server returned an error:", res.status, res.statusText);
            const text = await res.text();
            console.log("📝 Response text:", text);
            return;
        }

        const data = await res.json();
        console.log("✅ JSON response:", data);

        if (data.success) {
            nameInput.disabled = true;
            editBtn.classList.remove("hidden");
            saveBtn.classList.add("hidden");
            avatarPreview.src = data.user.avatar;
            console.log("👤 Updated avatar in preview:", data.user.avatar);

            // Update the dropdown (auth section)
            updateDropdownName(data.user.name, data.user.avatar);
            console.log("👤 Updated dropdown with new name and avatar");

            alert("Profile updated successfully!");
        } else {
            console.warn("⚠️ Update failed:", data.message);
        }
    } catch (err) {
        console.error("💥 Error during profile update:", err);
    }
});

avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log("📂 Avatar file selected:", file);

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            avatarPreview.src = reader.result;
            console.log("🖼️ Preview updated with selected file");
        };
        reader.readAsDataURL(file);
    }
});


  document.getElementById("submitIDBtn").addEventListener("click", async () => {
    if (!idUpload.files.length) {
      alert("Please upload a valid ID before submitting.");
      return;
    }
    const formData = new FormData();
formData.append("id_photo", idUpload.files[0]);

    const res = await fetch("/submit-id", {
      method: "POST",
      body: formData,
      credentials: "same-origin"
    });
    const data = await res.json();
    if (data.success) {
      statusBox.innerHTML = `Status: <span class="font-medium">${data.user.id_status}</span>`;
      alert("Your ID has been submitted.");
    }
  });

  function updateDropdownName(newName, newAvatar) {
    const authSection = document.getElementById("auth-section");
    if (!authSection) return;

    const nameSpan = authSection.querySelector("span.text-sm.font-medium");
    if (nameSpan) nameSpan.textContent = newName;

    const avatarImg = authSection.querySelector("img.rounded-full");
    if (avatarImg && newAvatar) avatarImg.src = newAvatar;
}

});
