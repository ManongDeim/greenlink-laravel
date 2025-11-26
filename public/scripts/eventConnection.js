// ✅ --- Flatpickr Date Range Replacement ---
document.addEventListener("DOMContentLoaded", function () {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");

  // Dynamically load Flatpickr if not yet included
  if (typeof flatpickr === "undefined") {
    const flatpickrScript = document.createElement("script");
    flatpickrScript.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    document.head.appendChild(flatpickrScript);
    flatpickrScript.onload = initFlatpickr;
  } else {
    initFlatpickr();
  }

  function initFlatpickr() {
    // ✅ Calendar for date range
    const datePicker = flatpickr(startDateInput, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      showMonths: 2,
      onClose: function (selectedDates) {
        if (selectedDates.length === 2) {
          // Handle same start & end date
          if (selectedDates[1].getTime() === selectedDates[0].getTime()) {
            const nextDay = new Date(selectedDates[0]);
            datePicker.setDate([selectedDates[0], nextDay], true);
          }

          // Fill start & end date fields
          startDateInput.value = flatpickr.formatDate(selectedDates[0], "Y-m-d");
          endDateInput.value = flatpickr.formatDate(selectedDates[1], "Y-m-d");
        }
      }
    });

    // ✅ Separate time picker for start time
    flatpickr(startTimeInput, {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
      dateFormat: "H:i",
      minuteIncrement: 5
    });

    // ✅ Separate time picker for end time
    flatpickr(endTimeInput, {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
      dateFormat: "H:i",
      minuteIncrement: 5
    });

    // Reopen range picker when clicking end date field
    endDateInput.addEventListener("click", () => {
      datePicker.open();
    });
  }
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
  const start_time = form.querySelector("input[name='start_time']").value;
  const end_time = form.querySelector("input[name='end_time']").value;
  const fullName = form.querySelector("input[name='full_name']").value;
  const event_type_id = form.querySelector("select[name='event_type']").value;
  const pax = form.querySelector("input[name='pax']").value;
  const email = form.querySelector("input[name='email']").value;
  const phone = form.querySelector("input[name='phone']").value;
  const to_bring = form.querySelector("textarea[name='to_bring']").value;

  // ✅ Find event name using stored eventData (from fetchEvents)
  let event_name = "Unknown Event";
  if (window.eventData && window.eventData.length > 0) {
    const selectedEvent = window.eventData.find(e => e.id == event_type_id);
    if (selectedEvent) event_name = selectedEvent.event_name;
  }

  // ✅ Build summary with times and proper event name
  const summaryHtml = `
    <p><strong>Check-In:</strong> ${start_date} (${start_time})</p>
    <p><strong>Check-Out:</strong> ${end_date} (${end_time})</p>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Event Type:</strong> ${event_name}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Things to be brought:</strong> ${to_bring || "None"}</p>
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
const useDefaultEmail = document.getElementById("useDefaultEmail");
const paxInput = document.getElementById('pax');
const paxError = document.getElementById('paxError');
const eventTypeInput = document.getElementById('event_type');
const eventTypeError = document.getElementById('eventTypeError');
const agreeCheckbox = document.getElementById("agreeCheckbox");
const termsError = document.getElementById("termsError");

// ✅ Input restrictions
fullnameInput.addEventListener("input", () => {
  fullnameInput.value = fullnameInput.value.replace(/[^\p{L}\s]/gu, "");
});
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
  if (phoneInput.value.length > 11) phoneInput.value = phoneInput.value.slice(0, 11);
});

function validateForm() {
  let isValid = true;
    
    // Validate time sequence
const start = combineDateTime(
  document.querySelector("input[name='start_date']").value,
  document.querySelector("input[name='start_time']").value
);
const end = combineDateTime(
  document.querySelector("input[name='end_date']").value,
  document.querySelector("input[name='end_time']").value
);

if (new Date(end) <= new Date(start)) {
  showAlert("End time must be later than start time.");
  return;
}

   // ✅ Terms and Conditions validation
  if (!agreeCheckbox.checked) {
    termsError.classList.remove("hidden");
    isValid = false;
  } else {
    termsError.classList.add("hidden");
  }


  // Full Name
if (fullnameInput.value.trim() === "") {
  nameError.textContent = "Full name is required.";
  nameError.classList.remove("hidden");
  fullnameInput.classList.add("border-red-500");
  isValid = false;

} else if (!/^[\p{L}\s]+$/u.test(fullnameInput.value.trim())) {
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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim())) {
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

function toggleDefaultEmail() {
  const icon = document.getElementById("defaultEmailIcon");
  const emailInput = document.getElementById("email");

  // Toggle highlight on the button icon
  const isUsingDefault = icon.classList.toggle("text-teal-600");

  if (isUsingDefault) {
    // Try to get logged-in user's email
    const userEmail =
      (window.currentUser && window.currentUser.email) ||
      localStorage.getItem("userEmail");

    if (userEmail) {
      emailInput.value = userEmail;
      emailInput.disabled = true;
      emailInput.classList.add("bg-gray-100", "cursor-not-allowed");
    } else {
      // If not logged in — revert the icon and show alert
      alert("⚠️ Please log in first to use your saved email.");
      icon.classList.remove("text-teal-600");
    }
  } else {
    // Restore normal editable email input
    emailInput.disabled = false;
    emailInput.classList.remove("bg-gray-100", "cursor-not-allowed");
    emailInput.value = "";
  }
}


function openTermsModal() {
      document.getElementById('termsModal').classList.remove('hidden');
      document.getElementById('termsModal').classList.add('flex');
    }
    function closeTermsModal() {
      document.getElementById('termsModal').classList.add('hidden');
    }
    function handleReviewClick() {
      const checkbox = document.getElementById('termsCheckbox');
      if (!checkbox.checked) {
        document.getElementById('alertMessage').textContent = 'Please agree to the Terms and Conditions before proceeding.';
        document.getElementById('alertModal').classList.remove('hidden');
        return;
      }
      openPaymentModal();
    }

// --- Event Type Seeder + Max Pax Limiter ---
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("event_type");
  const paxInput = document.getElementById("pax");
  const paxError = document.getElementById("paxError");
  let eventData = [];

  async function fetchEvents() {
    try {
      const response = await fetch("https://greenlinklolasayong.site/api/events");
      eventData = await response.json(); // ✅ store it here
      window.eventData = eventData;

      // Populate dropdown
      select.innerHTML = '<option value="" disabled selected>Select Event Type</option>';
      eventData.forEach((event) => {
        const option = document.createElement("option");
        option.value = event.id;
        option.textContent = event.event_name;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading event types:", error);
      select.innerHTML = '<option disabled>Error loading event types</option>';
    }
  }

  // When user selects an event type
  select.addEventListener("change", function () {
    const selectedType = eventData.find((e) => e.id == select.value);
    if (selectedType) {
      paxInput.max = selectedType.max_pax; // ✅ set HTML max attribute
      paxError.textContent = `Maximum allowed pax: ${selectedType.max_pax}`;
      paxError.classList.remove("hidden");
      paxInput.value = ""; // reset pax input
    }
  });

  // When user types pax
  paxInput.addEventListener("input", function () {
    const selectedType = eventData.find((e) => e.id == select.value);
    if (!selectedType) return;

    const max = parseInt(selectedType.max_pax);
    const val = parseInt(paxInput.value);

    if (val > max) {
      paxInput.value = max; // ✅ enforce limit
      paxError.textContent = `Maximum allowed pax: ${max}`;
      paxError.classList.remove("hidden");
    } else {
      paxError.classList.add("hidden");
    }
  });

  fetchEvents();
});

// Store and send to database

document.getElementById("confirmBtn").addEventListener("click", async function () {
  const form = document.getElementById("eventBookingForm");

  const payload = {
    event_id: form.querySelector("select[name='event_type']").value,
    start_datetime: combineDateTime(
      form.querySelector("input[name='start_date']").value,
      form.querySelector("input[name='start_time']").value
    ),
    end_datetime: combineDateTime(
      form.querySelector("input[name='end_date']").value,
      form.querySelector("input[name='end_time']").value
    ),
    full_name: form.querySelector("input[name='full_name']").value,
    event_type: getEventName(form.querySelector("select[name='event_type']").value),
    email: form.querySelector("input[name='email']").value,
    phone_number: form.querySelector("input[name='phone']").value,
    pax: form.querySelector("input[name='pax']").value,
    to_bring: form.querySelector("textarea[name='to_bring']").value,
  };
  
  function openSuccessPopup() {
  document.getElementById("successPopup").classList.remove("hidden");
}

window.closeSuccessPopup = function() {
  document.getElementById("successPopup").classList.add("hidden");
}

  try {
    const response = await fetch("https://greenlinklolasayong.site/api/event-reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include", // ✅ send session cookie for authentication
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      openSuccessPopup();
      closeConfirmationModal();
      form.reset();
    } else {
      alert("❌ Error: " + (data.message || "Something went wrong"));
    }
  } catch (error) {
    console.error("Error submitting reservation:", error);
    alert("⚠️ Network error. Please try again.");
  }
});

// 🧩 Helper: Combine date + time into MySQL DATETIME
function combineDateTime(date, time12h) {
  if (!date || !time12h) return null;

  // Make sure time12h is like "02:30 PM"
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

  // Convert back to 12-hour format with AM/PM for Laravel
  let hh = hours % 12;
  hh = hh === 0 ? 12 : hh; // 12-hour format
  const mm = minutes.toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  return `${date} ${hh.toString().padStart(2, '0')}:${mm} ${ampm}`;
}



// 🧩 Helper: Get event name from global eventData
function getEventName(eventId) {
  if (window.eventData) {
    const event = window.eventData.find((e) => e.id == eventId);
    return event ? event.event_name : "Unknown";
  }
  return "Unknown";
}

document.addEventListener('DOMContentLoaded', function () {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Format time as HH:MM for Flatpickr minTime
  function formatTime(h, m) {
    return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');
  }

  flatpickr("#startTime", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K", // 12-hour format with AM/PM
    time_24hr: false,
    minTime: formatTime(hours, minutes) // disables past times today
  });

  flatpickr("#endTime", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K", // 12-hour format with AM/PM
    time_24hr: false,
    minTime: formatTime(hours, minutes) // disables past times today
  });
});
