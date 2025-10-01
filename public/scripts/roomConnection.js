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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cashPayment").addEventListener("click", () => {
        console.log("Cash clicked"); 
        sendReservation("Cash");
    });

});

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

  // --- Checkout Modal ---
  document.getElementById("cancelCheckout")?.addEventListener("click", () => closeModal("checkoutModal"));
  document.getElementById("confirmCheckout")?.addEventListener("click", () => {
    alert("Order Confirmed ✅"); // Replace with your checkout logic
    closeModal("checkoutModal");
  });
});

  

function openRoomModal(modalId) {
      document.getElementById(modalId).classList.remove('hidden');
    }
    function closeRoomModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    // Close modal when clicking outside
    document.querySelectorAll('[id$="Modal"]').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll('[id$="Modal"]').forEach(modal => modal.classList.add('hidden'));
      }
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

// Add this inside roomConnection.js
function setupModalOutsideClick(modalId) {
  const modal = document.getElementById(modalId);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) { // clicked backdrop, not modal content
      modal.classList.add("hidden");
    }
  });
}

// Call this for each modal
setupModalOutsideClick("soloHut");
setupModalOutsideClick("DuoHut");
setupModalOutsideClick("TrioHut");
setupModalOutsideClick("airconCabin1");
setupModalOutsideClick("airconCabin2");
setupModalOutsideClick("airconRoomCabin");
setupModalOutsideClick("checkoutModal");
setupModalOutsideClick("reservationModal");
setupModalOutsideClick("orderModal");

// Close modal function
function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}

// Setup outside click + Escape
function setupModalControls(modalId) {
  const modal = document.getElementById(modalId);

  // Close when clicking outside the modal content
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });

  // Close when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal(modalId);
    }
  });
}

// Apply to all your modals
setupModalControls("soloHut");
setupModalControls("DuoHut");
setupModalControls("TrioHut");
setupModalControls("airconCabin1");
setupModalControls("airconCabin2");
setupModalControls("airconRoomCabin");
setupModalControls("checkoutModal");
setupModalControls("reservationModal");
setupModalControls("orderModal");

 function goBack() {
    window.history.back();
 }




