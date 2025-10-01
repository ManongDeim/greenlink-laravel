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



  
//Modals
  
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

      function openPaymentModal() {

    const form = document.getElementById("roomBookingForm");

    const room = document.querySelector("#roomName").innerText;
    const check_in_date = form.querySelector("input[name='check_in_date']").value;
    const check_out_date = form.querySelector("input[name='check_out_date']").value;
    const fullName = form.querySelector("input[name='full_name']").value;
    const pax = form.querySelector("input[name='pax']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone_number']").value;

    // Build summary HTML 
    const summaryHtml = `
    <p><strong>Cottage:</strong> ${room}</p>
    <p><strong>Check-In:</strong> ${check_in_date}</p>
    <p><strong>Check-Out:</strong> ${check_out_date}</p>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    `;

      // Insert into modal
      document.getElementById("paymentSummary").innerHTML = summaryHtml;

      // Open modal
      document.getElementById('paymentModal').classList.remove('hidden');
       document.body.style.overflow = 'hidden';
    }
    function closePaymentModal() {
      document.getElementById('paymentModal').classList.add('hidden');
       document.body.style.overflow = '';
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




