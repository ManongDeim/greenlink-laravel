// ✅ --- Flatpickr Date Range Replacement ---
document.addEventListener("DOMContentLoaded", function () {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  let lastStart = null;

  // Load Flatpickr dynamically if not already included
  if (typeof flatpickr === "undefined") {
    const flatpickrScript = document.createElement("script");
    flatpickrScript.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    document.head.appendChild(flatpickrScript);
    flatpickrScript.onload = initFlatpickr;
  } else {
    initFlatpickr();
  }

  function initFlatpickr() {
    const rangePicker = flatpickr(startInput, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      showMonths: 2,
      onClose: function (selectedDates) {
        if (selectedDates.length === 2) {
          // Auto-extend 1 day if same start/end selected
          if (selectedDates[1].getTime() === selectedDates[0].getTime()) {
            const nextDay = new Date(selectedDates[0]);
            nextDay.setDate(nextDay.getDate() + 1);
            rangePicker.setDate([selectedDates[0], nextDay], true);
            selectedDates[1] = nextDay;
          }
          lastStart = selectedDates[0];
          startInput.value = selectedDates[0].toLocaleDateString();
          endInput.value = selectedDates[1].toLocaleDateString();
        }
      }
    });

    endInput.addEventListener("click", () => {
      if (lastStart) rangePicker.setDate([lastStart], false);
      rangePicker.open();
    });
  }
});


// --- For Event Reservation ---
async function sendReservation() {
  let formE1 = document.getElementById("eventBookingForm");
  let form = new FormData(formE1);

  try {
    let response = await fetch("http://greenlinklolasayong.site/laravel/api/eventReservation", {
      method: "POST",
      body: form
    });

    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }

    let result = await response.json();
    showAlert("✅ " + result.message + " ");
    console.log("Success:", result);

    // Clear form after success
    formE1.reset();

    // Close modal after success
    closeConfirmationModal();
  } catch (error) {
    console.error("Error:", error);
    showAlert("❌ An error occurred. Please try again." + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("confirmBtn").addEventListener("click", () => {
    console.log("Confirm clicked");
    sendReservation();
  });
});


// --- Modals ---
function openReserModal() {
  document.getElementById("reservationModal").classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeReserModal() {
  document.getElementById("reservationModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function openOrderModal() {
  document.getElementById("orderModal").classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function openConfirmationModal() {
  const form = document.getElementById("eventBookingForm");

  const start_date = form.querySelector("input[name='start_date']").value;
  const end_date = form.querySelector("input[name='end_date']").value;
  const fullName = form.querySelector("input[name='full_name']").value;
  const event_type = form.querySelector("select[name='event_type']").value;
  const pax = form.querySelector("input[name='pax']").value;
  const email = form.querySelector("input[name='email']").value;
  const phone = form.querySelector("input[name='phone']").value;
  const to_bring = form.querySelector("textarea[name='to_bring']").value;

  const summaryHtml = `
    <p><strong>Check-In:</strong> ${start_date}</p>
    <p><strong>Check-Out:</strong> ${end_date}</p>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Event Type:</strong> ${event_type}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Things to be brought:</strong> ${to_bring}</p>
    `;

  document.getElementById("confirmationSummary").innerHTML = summaryHtml;
  document.getElementById("confirmationModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  document.body.style.overflow = "";
}

function showAlert(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("alertModal").classList.remove("hidden");
}

function closeAlert() {
  document.getElementById("alertModal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const reservationModal = document.getElementById("reservationModal");
  const orderModal = document.getElementById("orderModal");

  if (orderModal) {
    orderModal.addEventListener("click", (e) => {
      const target = e.target;
      if (target.id === "foodOrder") {
        window.location.href = "./FoodOrders.html";
      } else if (target.id === "farmOrder") {
        window.location.href = "./FarmOrders.html";
      }
    });
  }

  if (reservationModal) {
    reservationModal.addEventListener("click", (e) => {
      const target = e.target;
      if (target.id === "roomReser") {
        window.location.href = "./RoomReser.html";
      } else if (target.id === "eventReser") {
        window.location.href = "./EventReser.html";
      }
    });
  }
});

document.addEventListener("click", function (event) {
  const reservationModal = document.getElementById("reservationModal");
  const orderModal = document.getElementById("orderModal");

  if (!reservationModal.classList.contains("hidden") && event.target === reservationModal) {
    closeReserModal();
  }
  if (!orderModal.classList.contains("hidden") && event.target === orderModal) {
    closeOrderModal();
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeReserModal();
      closeOrderModal();
    }
  });
});

function goBack() {
  window.history.back();
}


// Validation 
const fullnameInput = document.getElementById("fullname");
const nameError = document.getElementById("nameError");
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const paxInput = document.getElementById('pax');
const paxError = document.getElementById('paxError');
const eventTypeInput = document.getElementById('event_type');
const eventTypeError = document.getElementById('eventTypeError');

fullnameInput.addEventListener("input", () => {
  fullnameInput.value = fullnameInput.value.replace(/[^A-Za-z\s]/g, "");
});
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
  if (phoneInput.value.length > 11) phoneInput.value = phoneInput.value.slice(0, 11);
});

function validateForm() {
  let isValid = true;

  if (fullnameInput.value.trim() === "") {
    nameError.textContent = "Full name is required.";
    nameError.classList.remove("hidden");
    fullnameInput.classList.add("border-red-500");
    isValid = false;
  } else if (!/^[A-Za-z\s]+$/.test(fullnameInput.value.trim())) {
    nameError.textContent = "Names can only include letters. Please try again.";
    nameError.classList.remove("hidden");
    fullnameInput.classList.add("border-red-500");
    isValid = false;
  } else {
    nameError.classList.add("hidden");
    fullnameInput.classList.remove("border-red-500");
  }


  // Phone
  if (!/^\d{11}$/.test(phoneInput.value.trim())) {
    phoneError.classList.remove("hidden");
    phoneInput.classList.add("border-red-500");
    isValid = false;
  } else {
    phoneError.classList.add("hidden");
    phoneInput.classList.remove("border-red-500");
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailInput.value.trim())) {
    emailError.classList.remove("hidden");
    emailInput.classList.add("border-red-500");
    isValid = false;
  } else {
    emailError.classList.add("hidden");
    emailInput.classList.remove("border-red-500");
  }

  // Pax
if (paxInput.value.trim() === '' || isNaN(paxInput.value) || paxInput.value <= 0) {
  paxError.classList.remove('hidden');
  paxInput.classList.add('border-red-500');
  isValid = false;
} else {
  paxError.classList.add('hidden');
  paxInput.classList.remove('border-red-500');
}

// Event Type
if (eventTypeInput.value === '') {
  eventTypeError.classList.remove('hidden');
  eventTypeInput.classList.add('border-red-500');
  isValid = false;
} else {
  eventTypeError.classList.add('hidden');
  eventTypeInput.classList.remove('border-red-500');
}

  if (isValid) {
    openConfirmationModal();
  }
}
}