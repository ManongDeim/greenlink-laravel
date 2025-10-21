

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
    window.location.href = "./pages/FoodOrders.html"; // go to another page
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
  const reservationType = document.querySelector("select");
  const container = document.getElementById("availableRoomsContainer");
  const roomList = document.getElementById("availableRoomsList");
  const searchBtn = document.querySelector(".bg-white.rounded-lg.shadow-md.hover\\:bg-teal-600");

  // Create a div for event calendar dynamically
  const eventCalendarContainer = document.createElement("div");
  eventCalendarContainer.className = "relative w-full max-w-4xl mx-auto mt-6 hidden"; // widened container
  eventCalendarContainer.innerHTML = `
    <label class="block mb-4 text-center text-xl font-semibold text-gray-800">Available Event Dates</label>
    <div id="eventCalendarWrapper" 
         class="flex justify-center p-4 bg-white border rounded-2xl shadow-lg">
      <input id="eventDatePicker" type="text" readonly
        class="w-full max-w-3xl px-4 py-2 text-center bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Select an available event date">
    </div>
  `;
  container.parentNode.insertBefore(eventCalendarContainer, container.nextSibling);

  // --- Room date picker (Check-in/Check-out) ---
  let lastCheckIn = null;

  const picker = flatpickr(checkInInput, {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    showMonths: 2,
    onClose: function (selectedDates) {
      if (selectedDates.length === 2) {
        if (selectedDates[1].getTime() === selectedDates[0].getTime()) {
          const nextDay = new Date(selectedDates[0]);
          nextDay.setDate(nextDay.getDate() + 1);
          picker.setDate([selectedDates[0], nextDay], true);
          selectedDates[1] = nextDay;
        }
        lastCheckIn = selectedDates[0];
        checkInInput.value = selectedDates[0].toLocaleDateString();
        checkOutInput.value = selectedDates[1].toLocaleDateString();
      }
    }
  });

  checkOutInput.addEventListener("click", () => {
    if (lastCheckIn) picker.setDate([lastCheckIn], false);
    picker.open();
  });

  // --- Sample room data ---
  const allRooms = [
    { name: "Square Room", capacity: 2, price: "₱700/night", image: "./src/Pictures/Room/Square 1-2 pax with or eithout meals/328a158b-bae7-48f0-ae5e-95b28e7b1a3f.png", link: "./pages/SquareRoom.html" },
    { name: "Twin Room", capacity: 2, price: "₱1,150/night", image: "./src/Pictures/Room/Twin room 1-2 pax with or without meals/9f410870-4f54-4573-8bb8-bf3e582c97ca.png", link: "./pages/TwinRoom.html" },
    { name: "Bree 2", capacity: 3, price: "₱2,500/night", image: "./src/Pictures/Room/Bree 2 without meals/c7bde137-1e79-4dbf-a197-845ec0df24fb.png", link: "./pages/SquareRoom.html" },
    { name: "Bree 1", capacity: 2, price: "₱2,500/night", image: "./src/Pictures/Room/Villavictoria/VillaVictoria1.jpg", link: "./pages/SquareRoom.html" },
    { name: "Aircon Cabin 2", capacity: 3, price: "₱3,000/night", image: "./src/Pictures/Room/Aircon rooms without meals/Old MCR (copy).png", link: "./pages/SquareRoom.html" },
    { name: "Josie", capacity: 6, price: "₱6,000/night", image: "./src/Pictures/Room/Aircon rooms without meals/AC Room Josie 1&2.png", link: "./pages/SquareRoom.html" },
  ];

  // --- Sample event available dates ---
  const availableEventDates = [
    "2025-11-10",
    "2025-11-17",
    "2025-12-05",
    "2025-12-20",
    "2026-01-15"
  ];

  // --- Flatpickr for Event Dates ---
  const eventPicker = flatpickr("#eventDatePicker", {
    dateFormat: "Y-m-d",
    minDate: "today",
    enable: availableEventDates, // only allow these
    inline: true
  });

  // --- Search button logic ---
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const type = reservationType.value;

    if (type === "Room Reservation") {
      if (!checkInInput.value || !checkOutInput.value) {
        alert("Please select both Check-In and Check-Out dates first.");
        return;
      }
      eventCalendarContainer.classList.add("hidden");
      container.classList.remove("hidden");
      populateRooms();
    } 
    else if (type === "Event Reservation") {
      container.classList.add("hidden");
      eventCalendarContainer.classList.remove("hidden");
    }
  });

  // --- Populate Rooms ---
  function populateRooms() {
    roomList.innerHTML = "";
    const available = allRooms.filter(() => true);
    if (available.length === 0) {
      roomList.innerHTML = `<div class="p-4 text-center text-gray-500">No rooms available for the selected dates.</div>`;
      return;
    }

    available.forEach(room => {
      const card = document.createElement("div");
      card.className = "flex items-center gap-4 p-3 hover:bg-teal-50 cursor-pointer transition duration-150";
      card.innerHTML = `
        <img src="${room.image}" alt="${room.name}" class="w-20 h-20 object-cover rounded-lg shadow">
        <div>
          <h3 class="font-semibold text-gray-800">${room.name}</h3>
          <p class="text-sm text-gray-600">${room.capacity} pax • ${room.price}</p>
        </div>
      `;
      card.addEventListener("click", () => window.location.href = room.link);
      roomList.appendChild(card);
    });
  }
};