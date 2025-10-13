// For Cottage Reservation
async function sendReservation(paymentMethod){
  let formE1 = document.getElementById("roomBookingForm");

   // get cottage name from paragraph
    let room = document.querySelector("#roomName").innerText;
    document.getElementById("roomInput").value = room;

    let form = new FormData(formE1);
    form.append("payment_method", paymentMethod);

    try {
        let response = await fetch("http://greenlinklolasayong.site/api/cottageReservation", {
            method: "POST",
            body: form
        });

        if (!response.ok) {
            throw new Error("HTTP error! Status: " + response.status);
        }

        let result = await response.json();

        showAlert("✅ " + result.message + " (" + paymentMethod + ")");

        console.log("Success:", result);

        //Clear form after success
        formE1.reset();

        //Close modal after success
        closePaymentModal();

    } catch (error) {
        console.error("Error:", error);
        showAlert("❌ An error occurred. Please try again." + error.message);
    }


}



  
//Modals
  
  function openReserModal() {
      document.getElementById('reserModal').classList.remove('hidden');
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

    
    function showAlert(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("alertModal").classList.remove("hidden");
}

    function closeAlert() {
  document.getElementById("alertModal").classList.add("hidden");
    }


// Modals

document.addEventListener("DOMContentLoaded", () => {
  // --- Utility functions ---
  const openModal = id => document.getElementById(id)?.classList.remove("hidden");
  const closeModal = id => document.getElementById(id)?.classList.add("hidden");

  // --- Booking & Order ---
  document.getElementById("openBooking")?.addEventListener("click", e => {
    e.preventDefault();
    openModal("reserModal");
  });

  document.getElementById("openOrder")?.addEventListener("click", e => {
    e.preventDefault();
    openModal("orderModal");
  });

  // --- Room Cards → Modals ---
  const roomCards = {
    soloHutCard: "soloHutModal",
    duoHutCard: "duoHutModal",
    trioHutCard: "trioHutModal",
    airconCabin1Card: "airconCabin1Modal",
    airconCabin2Card: "airconCabin2Modal",
    airconRoomCabinCard: "airconRoomCabinModal"
  };

  for (const [cardId, modalId] of Object.entries(roomCards)) {
    document.getElementById(cardId)?.addEventListener("click", () => openModal(modalId));
  }

  // --- Room Close Buttons ---
  const roomCloses = {
    closeSoloHut: "soloHutModal",
    closeDuoHut: "duoHutModal",
    closeTrioHut: "trioHutModal",
    closeAirconCabin1: "airconCabin1Modal",
    closeAirconCabin2: "airconCabin2Modal",
    closeAirconRoomCabin: "airconRoomCabinModal"
  };

  for (const [btnId, modalId] of Object.entries(roomCloses)) {
    document.getElementById(btnId)?.addEventListener("click", () => closeModal(modalId));
  }

  // --- Reservation & Order Modals ---
  document.getElementById("closeReser")?.addEventListener("click", () => closeModal("reserModal"));
  document.getElementById("closeOrder")?.addEventListener("click", () => closeModal("orderModal"));

    // --- Setup modal outside click + ESC ---
  function setupModalControls(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Close when clicking backdrop
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal(modalId);
    });

    // Close when pressing ESC
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal(modalId);
      }
    });
  }

  [
    "soloHutModal",
    "duoHutModal",
    "trioHutModal",
    "airconCabin1Modal",
    "airconCabin2Modal",
    "airconRoomCabinModal",
    "reserModal",
    "orderModal",
   ].forEach(setupModalControls);

   // Redirects

   // --- Reservation Modal Navigation ---
const reserRoutes = {
  roomReserPage: "RoomReser.html",
  eventReserPage: "EventReser.html"
};

for (const [btnId, url] of Object.entries(reserRoutes)) {
  document.getElementById(btnId)?.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = url;
  });
}

// --- Order Modal Navigation ---
const orderRoutes = {
  foodOrderPage: "FarmOrders.html",
  farmOrderPage: "FarmOrders.html"
};

for (const [btnId, url] of Object.entries(orderRoutes)) {
  document.getElementById(btnId)?.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = url;
  });
}

// --- Redirects for "Book Now!" buttons in modals ---
const bookNowButtons = [
  { id: "squareRoom", url: "SquareRoom.html" },
  { id: "twinRoom", url: "TwinRoom.html" },
  { id: "breeRoom", url: "Bree.html" },
  { id: "josieRoom", url: "Josie.html" },
  { id: "cabin2", url: "Cabin2.html" },
  { id: "villaVictoria", url: "VillaVictoria.html" },
];

bookNowButtons.forEach(btn => {
  const element = document.getElementById(btn.id);
  if (element) {
    element.addEventListener("click", () => {
      window.location.href = btn.url;
    });
  }
});

});

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("roomsContainer");

  try {
    // Adjust to your actual Laravel API URL
    const response = await fetch("https://yourdomain.com/api/rooms");
    const rooms = await response.json();

    rooms.forEach(room => {
      // Create card
      const card = document.createElement("div");
      card.className =
        "bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-[1.02] transition cursor-pointer";
      card.innerHTML = `
        <img src="${room.image}" alt="${room.name}" class="object-cover w-full h-56">
        <div class="p-4 text-center">
          <h2 class="text-xl font-bold text-gray-800">${room.name}</h2>
          <p class="mt-2 text-sm text-gray-600">${room.description}</p>
          <p class="mt-2 text-lg font-semibold text-teal-700">₱${parseFloat(room.price).toLocaleString()}</p>
        </div>
      `;

      // Create modal
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 z-50 flex items-center justify-center hidden bg-black/40 backdrop-blur-sm";
      modal.innerHTML = `
        <div class="relative w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl">
          <button type="button" class="absolute text-gray-600 top-3 right-3 hover:text-gray-900 close-modal">&times;</button>
          <h2 class="mb-4 text-2xl font-bold text-gray-800">${room.name} (${room.roomId})</h2>
          <img src="${room.image}" alt="${room.name}" class="mb-4 rounded-xl">
          <p class="mb-2 text-gray-700">${room.description}</p>
          <p class="mb-4 text-lg font-semibold text-teal-700">₱${parseFloat(room.price).toLocaleString()}</p>
          <button type="button" class="absolute px-4 py-3 font-medium text-white transition duration-300 bg-teal-700 shadow-md hover:bg-teal-800 bottom-3 right-3 rounded-xl book-now-btn">
            Book Now!
          </button>
        </div>
      `;

      // Card click → open modal
      card.addEventListener("click", () => modal.classList.remove("hidden"));

      // Close modal logic
      modal.querySelector(".close-modal").addEventListener("click", () => modal.classList.add("hidden"));
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
      });

      // Book Now → redirect
      modal.querySelector(".book-now-btn").addEventListener("click", () => {
        window.location.href = room.book_now_url;
      });

      container.appendChild(card);
      document.body.appendChild(modal);
    });
  } catch (err) {
    console.error("Failed to load rooms:", err);
  }
});
