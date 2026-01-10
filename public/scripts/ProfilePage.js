document.addEventListener("DOMContentLoaded", async function () {
// ==== Elements ====
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");
const idUpload = document.getElementById("idUpload");
const statusBox = document.getElementById("statusBox");
const submitIDBtn = document.getElementById("submitIDBtn");

// ==== Fetch user profile ====
async function loadProfile() {
const profileRes = await fetch("/profile-data");
const profileData = await profileRes.json();
if (!profileData.success) return;

const user = profileData.user;

nameInput.value = user.name || "";
emailInput.value = user.email || "";
avatarPreview.src = user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

// Update dropdown/auth section
updateDropdownName(user.name, user.avatar);

// Initialize ID section
if (user.id_status === "Validated" || user.id_status === "Submission Validated") {
        // Show image only
        idUpload.classList.add("hidden");
        statusBox.classList.add("hidden");
        submitIDBtn.classList.add("hidden");

        const idPhotoContainer = document.getElementById("idPhotoContainer");
        const idPhotoPreview = document.getElementById("idPhotoPreview");

        idPhotoPreview.src = user.id_photo;
        idPhotoContainer.classList.remove("hidden");
    } else if (user.id_status === "Rejected" || user.id_status === "Submission Rejected") {
        // Show status only
        statusBox.innerHTML = `Status: <span class="font-medium">Submission Rejected</span>`;
        statusBox.classList.remove("hidden");
        idUpload.classList.remove("hidden");
        document.getElementById("idPhotoContainer").classList.add("hidden");
    } else {
        // Pending validation — show input
        idUpload.classList.remove("hidden");
        statusBox.classList.add("hidden");
        document.getElementById("idPhotoContainer").classList.add("hidden");
    }
}

await loadProfile();

// ==== Edit / Save Name ====
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

    if (data.user.avatar) avatarPreview.src = data.user.avatar;
    updateDropdownName(data.user.name, data.user.avatar);
    console.log("👤 Updated dropdown and preview");
    
    showIdPopup("Profile updated successfully!");
  } else {
    console.warn("⚠️ Update failed:", data.message);
    showIdPopup("Profile update failed: " + data.message);
  }
} catch (err) {
  console.error("💥 Error during profile update:", err);
  showIdPopup("Profile update failed. Check console for details.");
}


});

// ==== Avatar Preview ====
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

// ==== ID / Senior Citizen Upload ====
idUpload.addEventListener("change", () => {
statusBox.classList.add("hidden"); // hide status if selecting new file
});

submitIDBtn.addEventListener("click", async () => {
if (!idUpload.files.length) {
alert("Please select a file before submitting.");
return;
}

const formData = new FormData();
formData.append("id_photo", idUpload.files[0]);

try {
  const res = await fetch("/submit-id", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });
  const data = await res.json();

 if (data.success) {
  idUpload.classList.add("hidden");
  submitIDBtn.classList.add("hidden");
  statusBox.classList.remove("hidden");

  const user = data.user;
  let statusText = user.id_status === "Pending Validation"
    ? "Pending Validation"
    : user.id_status === "Validated"
    ? "Submission Validated"
    : "Submission Rejected";

  statusBox.innerHTML = `Status: <span class="font-medium">${statusText}</span>`;

  if (user.id_status === "Validated" && user.id_photo) {
    const img = document.createElement("img");
    img.src = user.id_photo;
    img.className = "object-cover w-40 h-40 mt-2 border rounded-lg";
    img.alt = "Validated ID";
    statusBox.appendChild(img);
  }

  // ✅ FIXED: Add message
  showIdPopup("Your ID has been submitted.");
} else {
  showIdPopup("Upload failed: " + data.message);
}
} catch (err) {
  console.error("💥 Error uploading ID:", err);
  showIdPopup("Upload failed. Check console for details.");
}

});

// ==== Helper: Update Dropdown / Auth Section ====
function updateDropdownName(newName, newAvatar) {
const authSection = document.getElementById("auth-section");
if (!authSection) return;

const nameSpan = authSection.querySelector("span.text-sm.font-medium");
if (nameSpan) nameSpan.textContent = newName;

const avatarImg = authSection.querySelector("img.rounded-full");
if (avatarImg && newAvatar) avatarImg.src = newAvatar;

}

});

function showIdPopup(message) {
  document.getElementById("idPopupMessage").textContent = message;
  document.getElementById("idPopup").classList.remove("hidden");
}

function closeIdPopup() {
  document.getElementById("idPopup").classList.add("hidden");
}

function openReserModal() {
      document.getElementById('reservationModal').classList.remove('hidden');
      document.body.classList.add("overflow-hidden"); // disable scroll
    }
    function closeReserModal() {
      document.getElementById('reservationModal').classList.add('hidden');
      document.body.classList.remove("overflow-hidden"); // re-enable scroll
    }

    function openOrderModal() {
      document.getElementById('orderModal').classList.remove('hidden');
      document.body.classList.add("overflow-hidden"); // disable scroll
    }
    function closeOrderModal() {
      document.getElementById('orderModal').classList.add('hidden');
      document.body.classList.remove("overflow-hidden"); // re-enable scroll
      
    }
    
    //Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "./RoomReser.html"; // go to another page
  });
});

  //Cottage Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("cottageReser");


  btn.addEventListener("click", () => {
    window.location.href = "#"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "./EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FoodOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FarmOrders.html"; // go to another page
  });
});

// --- Close Modal When Clicking Outside ---
document.addEventListener("click", function (event) {
  const reservationModal = document.getElementById("reservationModal");
  const orderModal = document.getElementById("orderModal");

  // If Reservation Modal is open and user clicks outside the content box
  if (!reservationModal.classList.contains("hidden") &&
      event.target === reservationModal) {
    closeReserModal();
  }

  // If Order Modal is open and user clicks outside the content box
  if (!orderModal.classList.contains("hidden") &&
      event.target === orderModal) {
    closeOrderModal();
  }
  // --- Close Modal When Pressing ESC ---
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeReserModal();
    closeOrderModal();
  }
});
});