document.addEventListener('DOMContentLoaded', () => {

  // --- Modals ---
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // --- Page navigation ---
  const pageButtons = [
    { id: 'roomReser', url: '../pages/RoomReser.html' },
    { id: 'eventReser', url: '../pages/EventReser.html' },
    { id: 'foodOrder', url: '../pages/FoodOrders.html' },
    { id: 'farmOrder', url: '../pages/FarmOrders.html' },
  ];

  pageButtons.forEach(btn => {
    const el = document.getElementById(btn.id);
    if (el) el.addEventListener('click', () => window.location.href = btn.url);
  });

  // --- Dashboard: Load sections dynamically ---
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      openSection(section);
    });
  });

  async function openSection(section) {
  const content = document.getElementById('content');
  let endpoint, title;

  switch(section) {
    case "foodOrders":
      endpoint = "/api/customer/food-orders";
      title = "🍴 Food Orders";
      break;
    case "farmOrders":
      endpoint = "/api/customer/farm-orders";
      title = "🌾 Farm Orders";
      break;
    case "room":
      endpoint = "/api/customer/room-reservations";
      title = "🏡 Room Reservations";
      break;
    case "event":
      endpoint = "/api/customer/event-reservations";
      title = "📅 Event Reservations";
      break;
    default:
      content.innerHTML = "<p>Invalid section selected.</p>";
      return;
  }

  // Initial loading UI
  content.innerHTML = `
    <h2 class="mb-6 text-2xl font-bold text-gray-800">${title}</h2>
    <p>Loading...</p>
  `;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
    });
    
    const data = await response.json();

    // Save globally for filtering
    window.currentSectionData = data;

    // Render section with filters
    renderSection(title, data);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p class='text-red-600'>Failed to load data.</p>";
  }

  document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('cancel-btn')) {
    const id = e.target.dataset.id;
    const card = e.target.closest('div.p-5');

    let typeMap = {
      "🍴 Food Orders": 'food',
      "🌾 Farm Orders": 'farm',
      "📅 Event Reservations": 'event'
    };

    const sectionTitle = card.querySelector('h3').innerText.includes('Food') ? "🍴 Food Orders"
      : card.querySelector('h3').innerText.includes('Farm') ? "🌾 Farm Orders"
      : card.querySelector('h3').innerText.includes('Room') ? "🏡 Room Reservations"
      : "📅 Event Reservations";

    const typeKey = typeMap[sectionTitle];

    if (!confirm("Are you sure you want to cancel this " + typeKey + "?")) return;

    try {
      const res = await fetch(`/api/customer/cancel-${typeKey}/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        card.querySelector('.cancel-btn').disabled = true;
        card.querySelector('.cancel-btn').innerText = "Cancelled ❌";
        // Optionally update status text on card
        if (sectionTitle === "🏡 Room Reservations") card.querySelector('p:nth-child(6)').innerText = "Status: Cancelled";
        else card.querySelector('p:nth-child(4)').innerText = "Status: Cancelled";
      } else {
        alert("Failed to cancel.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling the order/reservation.");
    }
  }

  document.addEventListener('click', async (e) => {
  if(e.target.classList.contains('cancel-room-btn')) {
    const id = e.target.dataset.id;
    const card = e.target.closest('div');

    const checkIn = new Date(card.querySelector('p:nth-child(3)').innerText.split(': ')[1]);
    const now = new Date();
    const diffHours = (checkIn - now) / 36e5;

    const confirmMsg = diffHours >= 24
      ? "Are you sure? Cancellation is fully refundable."
      : "Are you sure? Cancellation less than 24 hours before check-in is non-refundable.";

    if(!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/cancel-room/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if(data.success) {
        alert(data.message);
        // Optionally remove card from dashboard
        card.remove();
      } else {
        alert(data.message || 'Failed to cancel reservation.');
      }
    } catch(err) {
      console.error(err);
      alert('Error cancelling reservation.');
    }
  }
});

});

}

function renderSection(title, data) {
  const content = document.getElementById("content");

  let filters = "";

  // ---- SECTION-SPECIFIC FILTER UI ----
  if (title === "🍴 Food Orders") {
    filters = `
      <div class="flex gap-3 mb-5">
        <select id="filterStatus" class="px-3 py-2 border rounded">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select id="filterPayment" class="px-3 py-2 border rounded">
          <option value="">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    `;
  }

  if (title === "🌾 Farm Orders") {
    filters = `
      <div class="flex gap-3 mb-5">
        <select id="filterStatus" class="px-3 py-2 border rounded">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select id="filterPayment" class="px-3 py-2 border rounded">
          <option value="">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    `;
  }

  if (title === "🏡 Room Reservations") {
    filters = `
      <div class="flex gap-3 mb-5">
        <select id="filterStatus" class="px-3 py-2 border rounded">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Checked-in">Checked-in</option>
          <option value="Checked-out">Checked-out</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select id="filterPayment" class="px-3 py-2 border rounded">
          <option value="">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    `;
  }

  if (title === "📅 Event Reservations") {
    filters = `
      <div class="flex gap-3 mb-5">
        <select id="filterStatus" class="px-3 py-2 border rounded">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Started</option>
          <option value="Approved">Ended</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select id="filterPayment" class="px-3 py-2 border rounded">
          <option value="">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    `;
  }

  // ---- Build HTML ----
  content.innerHTML = `
    <h2 class="mb-6 text-2xl font-bold text-gray-800">${title}</h2>
    ${filters}
    <div id="sectionCards" class="grid gap-4"></div>
  `;

  renderFilteredCards(title, data);

  // ---- Bind filters ----
  const statusEl = document.getElementById("filterStatus");
  const paymentEl = document.getElementById("filterPayment");

  if (statusEl) statusEl.addEventListener("change", () => renderFilteredCards(title));
  if (paymentEl) paymentEl.addEventListener("change", () => renderFilteredCards(title));
}


  // --- Create Card with rating section ---
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

     let cancelBtn = `<button class="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cancel-btn" data-id="${item[type.includes('Food') ? 'foodOrder_id' : type.includes('Farm') ? 'farmOrder_id' : type.includes('Room') ? 'room_reser_id' : 'event_reservation_id']}">Cancel</button>`;

    switch(type) {
      case "🍴 Food Orders":
        return `<div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">Order #${item.foodOrder_id}</h3>
          <p class="text-gray-600 mt-2">Total: ₱${item.total_bill}</p>
          <p class="text-gray-600">Payment: ${item.payment_method} (${item.payment_status})</p>
          <p class="text-gray-600">Status: ${item.order_status ?? 'N/A'}</p>
          ${ratingSection(item.foodOrder_id)}
            ${cancelBtn}
        </div>`;
      case "🌾 Farm Orders":
        return `<div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">Farm Order #${item.farmOrder_id}</h3>
          <p class="text-gray-600 mt-2">Total: ₱${item.total_bill}</p>
          <p class="text-gray-600">Payment: ${item.payment_method} (${item.payment_status})</p>
          <p class="text-gray-600">Status: ${item.order_status ?? 'N/A'}</p>
          ${ratingSection(item.farmOrder_id)}
            ${cancelBtn}
        </div>`;
      case "🏡 Room Reservations":
        return `<div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">${item.room}</h3>
          <p class="text-gray-600">Reservation ID: <span class="font-medium">${item.room_reser_id}</span></p>
          <p class="text-gray-600 mt-2">Check-in: ${item.check_in_date}</p>
          <p class="text-gray-600">Check-out: ${item.check_out_date}</p>
          <p class="text-gray-600">Total: ₱${item.total_bill}</p>
          <p class="text-gray-600">Payment: ${item.payment_method ?? 'N/A'} (${item.payment_status ?? 'N/A'})</p>
          ${ratingSection(item.room_reser_id)}
            ${cancelBtn}
        </div>`;
      case "📅 Event Reservations":
        return `<div class="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-teal-700">${item.event_type}</h3>
          <p class="text-gray-600">Reservation ID: <span class="font-medium">${item.event_reservation_id}</span></p>
          <p class="text-gray-600 mt-2">From: ${item.start_datetime}</p>
          <p class="text-gray-600">To: ${item.end_datetime}</p>
          <p class="text-gray-600">Guests: ${item.pax}</p>
          <p class="text-gray-600">Status: ${item.approval_status ?? 'Pending'}</p>
          <p class="text-gray-600">Payment Status: ${item.payment_status ?? 'Pending'}</p>
           <button class="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cancel-room-btn" data-id="${item.room_reser_id}">Cancel</button>
          ${ratingSection(item.event_reservation_id)}
         
        </div>`;
    }
  }
  function renderFilteredCards(title) {
  const container = document.getElementById("sectionCards");
  let items = window.currentSectionData;

  // Read dropdown values (if they exist)
  const statusF = document.getElementById("filterStatus")?.value || "";
  const paymentF = document.getElementById("filterPayment")?.value || "";

  // ---- Filter logic for Food Orders ----
  if (
  title === "🍴 Food Orders" ||
  title === "🌾 Farm Orders" ||
  title === "🏡 Room Reservations" ||
  title === "📅 Event Reservations"
) {
  items = items.filter(item => {
    // Determine the correct field to filter by
    let statusValue = "";
    if (title === "🏡 Room Reservations") statusValue = item.status;
    else if (title === "📅 Event Reservations") statusValue = item.approval_status;
    else statusValue = item.order_status;

    const matchStatus = statusF
      ? statusValue?.toLowerCase().trim() === statusF.toLowerCase().trim()
      : true;

    const matchPayment = paymentF
      ? item.payment_status?.toLowerCase().trim() === paymentF.toLowerCase().trim()
      : true;

    return matchStatus && matchPayment;
  });
}


  container.innerHTML = items.length
    ? items.map(item => createCard(item, title)).join("")
    : `<p class="text-gray-500">No matching results.</p>`;
}


  // --- Stars hover and reset ---
  document.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.stars span');
    if (!star) return;
    const stars = star.parentElement.querySelectorAll('span');
    const index = Array.from(stars).indexOf(star);
    stars.forEach((s,i) => {
      s.classList.toggle('text-yellow-400', i <= index);
      s.classList.toggle('text-gray-300', i > index);
    });
  });

  document.addEventListener('mouseout', (e) => {
    const star = e.target.closest('.stars span');
    if (!star) return;
    const starsContainer = star.parentElement;
    const stars = starsContainer.querySelectorAll('span');
    const feedbackSection = starsContainer.nextElementSibling;
    const rating = feedbackSection.dataset.rating || 0;
    stars.forEach((s,i) => {
      s.classList.toggle('text-yellow-400', i < rating);
      s.classList.toggle('text-gray-300', i >= rating);
    });
  });

  // --- Click stars & submit feedback ---
  document.addEventListener('click', async (e) => {
  console.log("🔹 Click event:", e.target);

  const star = e.target.closest('.stars span');
  if (star) {
    console.log("⭐ Star clicked:", star);
    const starsContainer = star.parentElement;
    console.log("📦 starsContainer:", starsContainer);
    const stars = starsContainer.querySelectorAll('span');
    const index = Array.from(stars).indexOf(star) + 1;
    stars.forEach((s,i) => {
      s.classList.toggle('text-yellow-400', i < index);
      s.classList.toggle('text-gray-300', i >= index);
    });
    const feedbackSection = starsContainer.nextElementSibling;
    console.log("📝 feedbackSection:", feedbackSection);
    feedbackSection.classList.remove('hidden');
    feedbackSection.dataset.rating = index;
  }

  if (e.target.classList.contains('submit-feedback')) {
    console.log("✅ Submit feedback clicked:", e.target);
    const feedbackSection = e.target.closest('.feedback-section');
    console.log("📝 feedbackSection for submit:", feedbackSection);

    if (!feedbackSection) {
      console.error("❌ feedbackSection is null!");
      return;
    }

    const rating = feedbackSection.dataset.rating;
    const comment = feedbackSection.querySelector('textarea').value;

    // Fix: find the stars container as the previous sibling
    const starsContainer = feedbackSection.previousElementSibling;
    console.log("📦 starsContainer for submit (fixed):", starsContainer);

    if (!starsContainer || !starsContainer.classList.contains('stars')) {
      console.error("❌ starsContainer is missing or not a stars container!");
      return;
    }

    const id = starsContainer.dataset.id;
    const typeMap = {
      "🍴 Food Orders": "food",
      "🌾 Farm Orders": "farm",
      "🏡 Room Reservations": "room",
      "📅 Event Reservations": "event"
    };
    const typeKey = typeMap[starsContainer.dataset.type];

    console.log("🔹 Submitting review:", { typeKey, id, rating, comment });

    // ...send fetch request as before

    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: typeKey, id, stars: rating, comment })
      });
      const data = await res.json();
      console.log("🔹 Response from submit-review:", data);
      if (data.success) {
        e.target.disabled = true;
        feedbackSection.querySelector('textarea').disabled = true;
        e.target.innerText = "Submitted ✅";
      } else {
        alert("Failed to submit review.");
      }
    } catch(err) {
      console.error("Error submitting review:", err);
    }
  }
});


});
