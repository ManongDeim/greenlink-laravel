

// --- Modal Functions ---
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


document.addEventListener("DOMContentLoaded", () => {
    
    console.log("✅ DOM loaded, attaching button listeners...");
    
  // Google login redirect
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/auth/google";
    });
  }

  // Booking modal
  document.getElementById("bookingBtn")?.addEventListener("click", openReserModal);
  document.getElementById("resCloseBtn")?.addEventListener("click", closeReserModal);

  // Order modal
  document.getElementById("orderBtn")?.addEventListener("click", openOrderModal);
  document.getElementById("orderCloseBtn")?.addEventListener("click", closeOrderModal);

  // Check login status
  loadUserProfile();
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


  //Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/RoomReser.html"; // go to another page
  });
});

  //Cottage Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/RoomReser.html"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/FarmOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/FarmOrders.html"; // go to another page
  });
});

// --- Flatpickr  ---
const flatpickrScript = document.createElement("script");
flatpickrScript.src = "https://cdn.jsdelivr.net/npm/flatpickr";
document.head.appendChild(flatpickrScript);

flatpickrScript.onload = () => {
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");


  let lastCheckIn = null; // store last check-in date

  const picker = flatpickr(checkInInput, {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    showMonths: 2,
    onOpen: function () {
      // When opening from check-out, keep check-in selected
      if (lastCheckIn) {
        picker.setDate([lastCheckIn], false);
      }
    },
    onClose: function (selectedDates) {
      if (selectedDates.length === 2) {
        // Enforce min 1-night stay
        if (selectedDates[1].getTime() === selectedDates[0].getTime()) {
          const nextDay = new Date(selectedDates[0]);
          nextDay.setDate(nextDay.getDate() + 1);
          picker.setDate([selectedDates[0], nextDay], true);
          selectedDates[1] = nextDay;
        }

        // Save last check-in date for future use
        lastCheckIn = selectedDates[0];

        // Update inputs
        checkInInput.value = selectedDates[0].toLocaleDateString();
        checkOutInput.value = selectedDates[1].toLocaleDateString();
      }
    }
  });

  // Make Check-Out input open calendar but keep check-in date
  checkOutInput.addEventListener("click", () => {
    if (lastCheckIn) {
      picker.setDate([lastCheckIn], false); // Pre-select last check-in date
    }
    picker.open();
  });
};

async function loadUserProfile() {
    try {
        console.log("🔍 Checking logged-in user...");
        const response = await fetch("/api/user", {
            credentials: "include" // ✅ important for session cookies
        });

        console.log("📡 /api/user status:", response.status);

        if (!response.ok) {
            throw new Error("Not logged in");
        }

        const user = await response.json();
        console.log("✅ User data from API:", user);

        // If user is logged in, replace login button
        if (user && user.name) {
            console.log("🎉 Logged in as:", user.name);

            const authSection = document.getElementById("auth-section");
            authSection.innerHTML = `
                <div class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full shadow-sm">
                    <img src="${user.avatar ?? "https://via.placeholder.com/40"}" 
                         class="w-8 h-8 rounded-full" />
                    <span class="text-sm font-medium">${user.name}</span>
                    <button onclick="logout()" 
                            class="ml-2 text-xs text-red-500 hover:underline">Logout</button>
                </div>
            `;
        } else {
            console.log("⚠️ No user.name found in response");
        }
    } catch (err) {
        console.error("❌ User not logged in:", err.message);
    }
}

// Logout request
async function logout() {
    console.log("🚪 Logging out...");
    await fetch("/logout", { credentials: "include" });
    location.reload(); // reload page to reset UI
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadUserProfile);

