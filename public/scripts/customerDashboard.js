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
//Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/RoomReser.html"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/FoodOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/FarmOrders.html"; // go to another page
  });
});

// Fetch Data for Customer Dashboard

// scripts/customerDashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');

  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      openSection(section); // ✅ now loads dynamically
    });
  });
});

// ✅ Dynamically render content instead of reloading
async function openSection(section) {
  const content = document.getElementById('content');

  switch (section) {
    case "foodOrders":
      fetchAndRender("/api/customer/food-orders", "🍴 Food Orders");
      break;
    case "farmOrders":
      fetchAndRender("/api/customer/farm-orders", "🌾 Farm Orders");
      break;
    case "room":
      fetchAndRender("/api/customer/room-reservations", "🏡 Room Reservations");
      break;
    case "event":
      fetchAndRender("/api/customer/event-reservations", "📅 Event Reservations");
      break;
    default:
      content.innerHTML = "<p>Invalid section selected.</p>";
  }
}

async function fetchAndRender(endpoint, title) {
  const content = document.getElementById("content");
  content.innerHTML = `<h2 class="mb-6 text-2xl font-bold text-gray-800">${title}</h2><p>Loading...</p>`;

  try {
    const token = localStorage.getItem("authToken"); // or however you store Sanctum token
    const res = await fetch(endpoint, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.length) {
      content.innerHTML = `<h2 class="mb-6 text-2xl font-bold text-gray-800">${title}</h2>
        <p class="text-gray-500">No records found.</p>`;
      return;
    }

    const cards = data.map(item => createCard(item, title)).join("");
    content.innerHTML = `
      <h2 class="mb-6 text-2xl font-bold text-gray-800">${title}</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">${cards}</div>
    `;
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p class="text-red-500">Failed to load data. ${err.message}</p>`;
  }
}

function createCard(item, type) {
  const ratingSection = (id) => `
    <div class="mt-3">
      <p class="text-gray-700 font-medium">Rate your experience:</p>
      <div class="flex space-x-1 mt-1 stars" data-id="${id}" data-type="${type}">
        ${[1,2,3,4,5].map(n => `<span class="cursor-pointer text-gray-300 hover:text-yellow-400 text-xl">&#9733;</span>`).join('')}
      </div>
      <div class="mt-2 hidden feedback-section">
        <textarea class="w-full border rounded p-2 mt-1 text-gray-700" placeholder="Write a comment (optional)"></textarea>
        <button class="mt-2 px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 submit-feedback">Submit</button>
      </div>
    </div>
  `;

  switch (type) {
    case "🍴 Food Orders":
      return `
        <div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">Order #${item.foodOrder_id}</h3>
          <p class="text-gray-600 mt-2">Total: ₱${item.total_bill}</p>
          <p class="text-gray-600">Payment: ${item.payment_method} (${item.payment_status})</p>
          <p class="text-gray-600">Status: ${item.order_status ?? 'N/A'}</p>
          ${ratingSection(item.foodOrder_id)}
        </div>`;

    case "🌾 Farm Orders":
      return `
        <div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">Farm Order #${item.farmOrder_id}</h3>
          <p class="text-gray-600 mt-2">Total: ₱${item.total_bill}</p>
          <p class="text-gray-600">Payment: ${item.payment_method} (${item.payment_status})</p>
          <p class="text-gray-600">Status: ${item.order_status ?? 'N/A'}</p>
          ${ratingSection(item.farmOrder_id)}
        </div>`;

    case "🏡 Room Reservations":
      return `
        <div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">${item.room}</h3>
          <p class="text-gray-600">Reservation ID: <span class="font-medium">${item.room_reser_id}</span></p>
          <p class="text-gray-600 mt-2">Check-in: ${item.check_in_date}</p>
          <p class="text-gray-600">Check-out: ${item.check_out_date}</p>
          <p class="text-gray-600">Total: ₱${item.total_bill}</p>
          <p class="text-gray-600">Payment: ${item.payment_method ?? 'N/A'} (${item.payment_status ?? 'N/A'})</p>
          ${ratingSection(item.room_reser_id)}
        </div>`;

    case "📅 Event Reservations":
      return `
        <div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">${item.event_type}</h3>
          <p class="text-gray-600">Reservation ID: <span class="font-medium">${item.event_reservation_id}</span></p>
          <p class="text-gray-600 mt-2">From: ${item.start_datetime}</p>
          <p class="text-gray-600">To: ${item.end_datetime}</p>
          <p class="text-gray-600">Guests: ${item.pax}</p>
          <p class="text-gray-600">Status: ${item.approval_status ?? 'Pending'}</p>
          ${ratingSection(item.event_reservation_id)}
        </div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Hover effect for stars
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.stars span')) {
      const star = e.target;
      const stars = star.parentElement.querySelectorAll('span');
      const index = Array.from(stars).indexOf(star);

      stars.forEach((s, i) => {
        s.classList.toggle('text-yellow-400', i <= index);
        s.classList.toggle('text-gray-300', i > index);
      });
    }
  });

  // Reset stars on mouseout if not clicked
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.stars span')) {
      const starsContainer = e.target.parentElement;
      const stars = starsContainer.querySelectorAll('span');
      const feedbackSection = starsContainer.nextElementSibling;
      const rating = feedbackSection.dataset.rating || 0;

      stars.forEach((s, i) => {
        s.classList.toggle('text-yellow-400', i < rating);
        s.classList.toggle('text-gray-300', i >= rating);
      });
    }
  });

  // Click to select rating
  document.addEventListener('click', function(e) {
    if (e.target.closest('.stars span')) {
      const star = e.target;
      const starsContainer = star.parentElement;
      const stars = starsContainer.querySelectorAll('span');
      const index = Array.from(stars).indexOf(star) + 1;

      stars.forEach((s, i) => {
        s.classList.toggle('text-yellow-400', i < index);
        s.classList.toggle('text-gray-300', i >= index);
      });

      // Show feedback section
      const feedbackSection = starsContainer.nextElementSibling;
      feedbackSection.classList.remove('hidden');
      feedbackSection.dataset.rating = index;
    }

    // Submit feedback
    if (e.target.classList.contains('submit-feedback')) {
      const feedbackSection = e.target.closest('.feedback-section');
      const rating = feedbackSection.dataset.rating;
      const comment = feedbackSection.querySelector('textarea').value;

      const id = e.target.closest('.stars').dataset.id;
      const type = e.target.closest('.stars').dataset.type;

      console.log(`Feedback for ${type} ID ${id}: Rating=${rating}, Comment="${comment}"`);

      e.target.disabled = true;
      feedbackSection.querySelector('textarea').disabled = true;
      e.target.innerText = "Submitted ✅";
    }
  });
});
