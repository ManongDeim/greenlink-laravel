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
});