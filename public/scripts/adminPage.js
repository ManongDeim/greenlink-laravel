// ================= Toast Function =================
function showToast(message, type = "success", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ================= Templates =================

const foodCardTemplate = item => `
  <div class="p-5 bg-white/90 backdrop-blur-sm shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition w-full">
    <img id="food-photo-${item.id}" src="${item.productPicture}" alt="${item.productName}"
      class="object-cover w-full h-48 mb-4 rounded-xl shadow-sm">

    <h3 id="food-name-${item.id}" class="text-lg font-semibold text-gray-800 mb-1">${item.productName}</h3>
    <p class="text-sm text-gray-600 mb-4">
      Price: <span id="food-price-${item.id}" class="font-semibold text-teal-700">₱${item.price}</span>
    </p>

    <!-- SMALLER BUTTON GROUP -->
    <div class="flex flex-col gap-2">

      <!-- Edit Name -->
      <button
        onclick="editFoodName(${item.id})"
        class="group flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition text-sm active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2M12 5v14m7 0H5"/>
        </svg>
        <span>Edit Name</span>
      </button>

      <!-- Edit Price -->
      <button
        onclick="editFoodPrice(${item.id})"
        class="group flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition text-sm active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3v1h6v-1c0-1.657-1.343-3-3-3z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14v6H5z"/>
        </svg>
        <span>Edit Price</span>
      </button>

      <!-- Replace Photo -->
      <button
        onclick="replaceFoodPhoto(${item.id})"
        class="group flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4H4zm8 12l-4-4m4 4l4-4m-4 4V8"/>
        </svg>
        <span>Replace Photo</span>
      </button>

      <!-- Edit Ingredients -->
      <button
        onclick="editFoodIngredients(${item.id})"
        class="group flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-sm active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20l9-16H3l9 16z"/>
        </svg>
        <span>Ingredients</span>
      </button>

      <!-- Remove Item -->
      <button
        onclick="removeFoodItem(${item.id})"
        class="group flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Remove</span>
      </button>

    </div>
  </div>
`;

const farmCardTemplate = item => `
  <div class="p-5 bg-white/90 backdrop-blur-sm shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition w-full">
    <img id="farm-photo-${item.id}" src="${item.productPicture}" alt="${item.productName}" 
      class="object-cover w-full h-48 mb-4 rounded-xl shadow-sm">

    <h3 id="farm-name-${item.id}" class="text-lg font-semibold text-gray-800 mb-1">${item.productName}</h3>
    <p class="text-sm text-gray-600 mb-1">
      Price: <span id="farm-price-${item.id}" class="font-semibold text-teal-700">₱${item.price}</span>
    </p>
    <p class="text-sm text-gray-600 mb-1">
      Measurement: <span id="farm-measurement-${item.id}" class="font-semibold text-teal-700">${item.measurement || ''}</span>
    </p>

    <!-- Button Grid -->
    <div class="flex flex-col gap-3 mt-5">
      
      <!-- Edit Name -->
      <button
        onclick="editFarmName(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-sm hover:from-teal-600 hover:to-teal-700 transition-all duration-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2M12 5v14m7 0H5"/>
        </svg>
        <span>Edit Name</span>
      </button>

      <!-- Edit Price -->
      <button
        onclick="editFarmPrice(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-teal-700 rounded-xl shadow-sm hover:from-cyan-200 hover:to-teal-200 transition-all duration-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3v1h6v-1c0-1.657-1.343-3-3-3z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14v6H5z"/>
        </svg>
        <span>Edit Price</span>
      </button>

      <!-- Replace Picture -->
      <button
        onclick="replaceFarmPhoto(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl shadow-sm hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4H4zm4 4l8 8m0-8l-8 8"/>
        </svg>
        <span>Replace Picture</span>
      </button>

      <!-- Remove Item -->
      <button
        onclick="removeFarmItem(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Remove Item</span>
      </button>

    </div>
  </div>
`;


// Generate an order card for a single order
const foodOrderTemplate = order => {
  // List of items in the order table
  const items = [
    { key: 'smokedFish_order', name: 'Smoked Fish' },
    { key: 'deviledFish_order', name: 'Deviled Fish' },
    { key: 'seaSig_order', name: 'SeaSig' },
    { key: 'blueCraze_order', name: 'Blue Craze' },
    { key: 'chickenSheet_order', name: 'Chicken Sheet' },
    { key: 'blackMeal_order', name: 'Black Meal' }
  ];

  // Only keep items with quantity > 0
  const orderedItems = items
    .filter(i => order[i.key] && order[i.key] > 0)
    .map(i => `<li>${order[i.key]}x ${i.name}</li>`).join('');

  return `
  <div class=" mb-4 p-5 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500 w-full" data-id="${order.foodOrder_id}">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-gray-800">Order #${order.foodOrder_id}</h3>
      <span class="px-2 py-1 text-xs font-semibold ${order.payment_status === 'Paid' ? 'text-green-700 bg-green-100' : 'text-teal-700 bg-teal-100'} rounded-full">
        ${order.payment_status}
      </span>
    </div>
    <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
      ${orderedItems}
    </ul>
    <p class="mt-2 text-sm font-semibold text-gray-800">Total Bill: ₱${parseFloat(order.total_bill).toLocaleString()}</p>
    <p class="mt-2 text-sm font-semibold text-gray-800">Order Status: ${order.order_status}</p>
  </div>
  `;
};

// Farm order card template
const farmOrderCardTemplate = order => {
  const items = [];
  if (order.bangus_order > 0) items.push(`${order.bangus_order}x Bangus`);
  if (order.eggs_order > 0) items.push(`${order.eggs_order}x Eggs`);
  if (order.mudCrab_order > 0) items.push(`${order.mudCrab_order}x Mud Crab`);
  if (order.nativeChicken_order > 0) items.push(`${order.nativeChicken_order}x Native Chicken`);
  if (order.nativePork_order > 0) items.push(`${order.nativePork_order}x Native Pork`);
  if (order.squash_order > 0) items.push(`${order.squash_order}x Squash`);

  return `
    <div class="p-5 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500 w-full"
         data-id="${order.farmOrder_id}" data-order-status="${order.order_status ?? ''}">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800">Order #${order.farmOrder_id}</h3>
        <div class="flex items-center gap-2">
          <span class="px-2 py-1 text-xs font-semibold ${order.payment_status === 'Paid' ? 'text-green-700 bg-green-100' : 'text-teal-700 bg-teal-100'} rounded-full">${order.payment_status}</span>
        </div>
      </div>
      <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
        ${items.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <p class="mt-2 text-sm text-gray-700 font-semibold">Total Bill: ₱${parseFloat(order.total_bill).toLocaleString()}</p>
      <p class="text-sm text-gray-700 font-semibold">Payment Method: ${order.payment_method}</p>
      <p class="mt-2 text-sm font-semibold text-gray-800">Order Status: ${order.order_status}</p>
    </div>
  `;
};
// Room Reservation template
const roomReservationTemplate = reservation => `
  <div class="p-5 mb-4 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500 w-full"
       data-id="${reservation.room_reser_id}" data-payment-status="${reservation.payment_status ?? 'Pending'}">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-gray-800">Reservation #${reservation.room_reser_id}</h3>
      <span class="px-2 py-1 text-xs font-semibold ${
        reservation.payment_status === 'Paid'
          ? 'text-green-700 bg-green-100'
          : reservation.payment_status === 'Refunded'
          ? 'text-blue-700 bg-blue-100'
          : reservation.payment_status === 'Failed'
          ? 'text-red-700 bg-red-100'
          : 'text-teal-700 bg-teal-100'
      } rounded-full">${reservation.payment_status ?? 'Pending'}</span>
    </div>
    <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
      <li>Room: ${reservation.room}</li>
      <li>Guest: ${reservation.full_name}</li>
      <li>Check-in: ${reservation.check_in_date}</li>
      <li>Check-out: ${reservation.check_out_date}</li>
    </ul>
    <p class="mt-2 text-sm text-gray-700 font-semibold">Status: ${reservation.status}</p>
  </div>
`;

const roomCardTemplate = item => `
  <div class="p-5 bg-white/90 backdrop-blur-sm shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition w-full">
    <img id="room-photo-${item.id}" src="${item.image}" alt="${item.room_name}" 
      class="object-cover w-full h-48 mb-4 rounded-xl shadow-sm">

    <h3 id="room-name-${item.id}" class="text-lg font-semibold text-gray-800 mb-1">${item.room_name}</h3>
    <p class="text-sm text-gray-600 mb-4">
      Price: <span id="room-price-${item.id}" class="font-semibold text-teal-700">₱${item.price}</span>
    </p>

    <!-- Compact Button Group -->
    <div class="flex flex-col gap-2">

      <!-- Edit Name -->
      <button
        onclick="editRoomName(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2M12 5v14m7 0H5"/>
        </svg>
        <span class="text-sm">Edit Name</span>
      </button>

      <!-- Edit Price -->
      <button
        onclick="editRoomPrice(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3v1h6v-1c0-1.657-1.343-3-3-3z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14v6H5z"/>
        </svg>
        <span class="text-sm">Edit Price</span>
      </button>

      <!-- Replace Photo -->
      <button
        onclick="replaceRoomPhoto(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg shadow-sm hover:bg-amber-500 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4H4zm8 12l-4-4m4 4l4-4m-4 4V8" />
        </svg>
        <span class="text-sm">Replace Photo</span>
      </button>

      <!-- Remove Room -->
      <button
        onclick="removeRoom(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span class="text-sm">Remove</span>
      </button>

    </div>
  </div>
`;


// Event Reservation template
const eventReservationTemplate = reservation => `
  <div class="p-5 mb-4 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500 w-full"
       data-id="${reservation.event_reservation_id}">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-gray-800">Reservation #${reservation.event_reservation_id}</h3>
    </div>
    <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
      <li>Event Type: ${reservation.event_type}</li>
      <li>Guest: ${reservation.full_name}</li>
      <li>Check-in: ${reservation.start_datetime}</li>
      <li>Check-out: ${reservation.end_datetime}</li>
    </ul>
    <p class="mt-2 text-sm text-gray-700 font-semibold">Things to Bring: ${reservation.to_bring}</p>
    <p id="event-status-${reservation.event_reservation_id}" class="mt-2 text-sm text-gray-700 font-semibold">Status: ${reservation.approval_status}</p>
  </div>
`;

const eventManagementTemplate = data => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold text-teal-700">Event Management</h2>
    <button onclick="openAddEventModal()" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
      + Add Event
    </button>
  </div>

  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Event Name</th>
        <th class="px-4 py-2">Max Pax</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(item => `
      <tr class="border-t hover:bg-gray-50 relative">
        <td class="px-4 py-2 relative">
          <button onclick="toggleActionMenu(event, ${item.id})"
                  class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">⚙️</button>

          <div id="actionMenu-${item.id}" class="absolute left-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
            <button onclick="openEditEventNameModal(${item.id})" class="block w-full text-left px-3 py-1 hover:bg-green-100">Edit Name</button>
            <button onclick="openEventPaxModal(${item.id})" class="block w-full text-left px-3 py-1 hover:bg-blue-100">Edit Pax</button>
            <button onclick="removeEvent(${item.id})" class="block w-full text-left px-3 py-1 hover:bg-red-100">Remove</button>
          </div>
        </td>
        <td class="px-4 py-2">${item.event_name}</td>
        <td class="px-4 py-2">${item.max_pax}</td>
      </tr>
      `).join("")}
    </tbody>
  </table>
</div>
`;


// ================= Reusable Render Functions =================

  /**
 * Renders items in a container
 * @param {string} containerId - id of the container
 * @param {Array} sections - array of sections { category: string, items: [] }
 * @param {Function} itemTemplateFn - function to render a single item
 */
function renderItems(containerId, sections, itemTemplateFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!sections.length) {
    container.innerHTML = `<p class="text-gray-500">No items found.</p>`;
    return;
  }

  container.innerHTML = sections.map(section => `
    <h3 class="mb-4 text-xl font-semibold text-gray-800">${section.category}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${section.items.map(itemTemplateFn).join('')}
    </div>
  `).join('');
}

function renderOrders(containerId, orders, templateFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = orders.length
    ? orders.map(templateFn).join('')
    : `<p class="text-gray-500">No orders found.</p>`;

  orders.forEach(order => {
    const card = container.querySelector(`.order-item[data-id="${order.foodOrder_id}"]`);
    if (card) {
      card.addEventListener('click', () => openFoodOrderModal(order));
    }
  });
}


// ================= CRUD Functions =================

// ----------- Farm Product Editing -----------

function closeAllInputBoxes() {
  document.querySelectorAll(".inline-editor").forEach(el => el.remove());
}

// ✅ Edit Product Name
function editFarmName(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  const container = document.createElement("div");
  container.className = "flex items-center col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <input type="text" id="editNameInput${id}" 
           class="border border-gray-300 rounded-lg px-3 py-1 w-full text-sm focus:ring-2 focus:ring-teal-500"
           placeholder="Enter new name">
    <button class="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-700 transition"
            onclick="saveFarmName(${id})">Save</button>
    <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
            onclick="closeAllInputBoxes()">Cancel</button>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveFarmName(id) {
  const input = document.getElementById(`editNameInput${id}`);
  const newName = input.value.trim();
  if (!newName) return showToast("Please enter a name");

  const response = await fetch(`/api/farm/edit-name/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName: newName }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update UI instantly
  const nameEl = document.getElementById(`farm-name-${id}`);
  if (nameEl) nameEl.textContent = newName;

  closeAllInputBoxes();
}


// ✅ Edit Product Price
function editFarmPrice(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  // 🧾 Get current displayed price and measurement
  const priceEl = document.getElementById(`farm-price-${id}`);
  const currentPrice = priceEl ? priceEl.textContent.replace("₱", "").trim() : "";

  const measurementEl = document.getElementById(`farm-measurement-${id}`);
  const currentMeasurement = measurementEl ? measurementEl.textContent.trim() : "";

  const container = document.createElement("div");
  container.className = "flex flex-col col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <div class="flex items-center gap-2">
      <input type="text" id="editPriceInput${id}"
             value="${currentPrice}"
             class="border border-gray-300 rounded-lg px-3 py-1 w-1/2 text-sm focus:ring-2 focus:ring-cyan-500"
             placeholder="Enter new price">

      <input type="text" id="editMeasurementInput${id}"
             value="${currentMeasurement || ''}"
             class="border border-gray-300 rounded-lg px-3 py-1 w-1/2 text-sm focus:ring-2 focus:ring-teal-500"
             placeholder="e.g. per 1/2 kg">
    </div>

    <div class="flex gap-2">
      <button class="bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-700 transition"
              onclick="saveFarmPrice(${id})">Save</button>
      <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
              onclick="closeAllInputBoxes()">Cancel</button>
    </div>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveFarmPrice(id) {
  const priceInput = document.getElementById(`editPriceInput${id}`);
  const measurementInput = document.getElementById(`editMeasurementInput${id}`);

  const newPrice = priceInput.value.trim();
  const newMeasurement = measurementInput.value.trim();

  if (!newPrice || isNaN(newPrice)) return showToast("Please enter a valid price");

  const response = await fetch(`/api/farm/edit-price/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price: newPrice,
      measurement: newMeasurement,
    }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update price and measurement text
  const priceEl = document.getElementById(`farm-price-${id}`);
  if (priceEl) priceEl.textContent = `₱${newPrice}`;

  const measureEl = document.getElementById(`farm-measurement-${id}`);
  if (measureEl) measureEl.textContent = newMeasurement || "";

  closeAllInputBoxes();
}


// ✅ Add Stock
function addFarmStock(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  const container = document.createElement("div");
  container.className = "flex items-center col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <input type="number" id="addStockInput${id}" 
           class="border border-gray-300 rounded-lg px-3 py-1 w-full text-sm focus:ring-2 focus:ring-green-500"
           placeholder="Enter quantity to add"
           min="1" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
    <button class="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
            onclick="saveFarmStock(${id})">Save</button>
    <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
            onclick="closeAllInputBoxes()">Cancel</button>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveFarmStock(id) {
  const input = document.getElementById(`addStockInput${id}`);
  const qty = input.value.trim();
  if (!qty || isNaN(qty) || qty <= 0) return showToast("Please enter a valid quantity");

  const response = await fetch(`/api/farm/add-stock/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty: parseInt(qty) }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update stock count
  const stockEl = document.getElementById(`farm-stock-${id}`);
  if (stockEl) {
    const current = parseInt(stockEl.textContent);
    stockEl.textContent = current + parseInt(qty);
  }

  closeAllInputBoxes();
}


// ✅ Replace Picture stays as file upload popup
function replaceFarmPhoto(id) {
  closeAllInputBoxes();

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("productPicture", file);

    const response = await fetch(`/api/farm/replace-photo/${id}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    showToast(result.message);

    // ✅ Update image instantly
    const imgEl = document.getElementById(`farm-photo-${id}`);
    if (imgEl && result.path) {
      imgEl.src = result.path + `?t=${Date.now()}`; // cache-buster
    }
  };

  fileInput.click();
}

// ----------- Food Product Editing -----------

// ✅ Edit Product Name
function editFoodName(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  const container = document.createElement("div");
  container.className = "flex items-center col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <input type="text" id="editNameInput${id}" 
           class="border border-gray-300 rounded-lg px-3 py-1 w-full text-sm focus:ring-2 focus:ring-teal-500"
           placeholder="Enter new name">
    <button class="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-700 transition"
            onclick="saveFoodName(${id})">Save</button>
    <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
            onclick="closeAllInputBoxes()">Cancel</button>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveFoodName(id) {
  const input = document.getElementById(`editNameInput${id}`);
  const newName = input.value.trim();
  if (!newName) return showToast("Please enter a name");

  const response = await fetch(`/api/food/edit-name/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName: newName }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update UI instantly
  const nameEl = document.getElementById(`food-name-${id}`);
  if (nameEl) nameEl.textContent = newName;

  closeAllInputBoxes();
}

// ✅ Edit Product Price
function editFoodPrice(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  // 🧾 Get current displayed price and measurement
  const priceEl = document.getElementById(`food-price-${id}`);
  const currentPrice = priceEl ? priceEl.textContent.replace("₱", "").trim() : "";

  const container = document.createElement("div");
  container.className = "flex flex-col col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <div class="flex items-center gap-2">
      <input type="text" id="editPriceInput${id}"
             value="${currentPrice}"
             class="border border-gray-300 rounded-lg px-3 py-1 w-1/2 text-sm focus:ring-2 focus:ring-cyan-500"
             placeholder="Enter new price">
    </div>

    <div class="flex gap-2">
      <button class="bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-700 transition"
              onclick="saveFoodPrice(${id})">Save</button>
      <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
              onclick="closeAllInputBoxes()">Cancel</button>
    </div>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveFoodPrice(id) {
  const priceInput = document.getElementById(`editPriceInput${id}`);

  const newPrice = priceInput.value.trim();

  if (!newPrice || isNaN(newPrice)) return showToast("Please enter a valid price");

  const response = await fetch(`/api/food/edit-price/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price: newPrice
    }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update price and measurement text
  const priceEl = document.getElementById(`food-price-${id}`);
  if (priceEl) priceEl.textContent = `₱${newPrice}`;

  closeAllInputBoxes();
}

// ✅ Replace Picture stays as file upload popup
function replaceFoodPhoto(id) {
  closeAllInputBoxes();

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("productPicture", file);

    const response = await fetch(`/api/food/replace-photo/${id}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    showToast(result.message);

    // ✅ Update image instantly
    const imgEl = document.getElementById(`food-photo-${id}`);
    if (imgEl && result.path) {
      imgEl.src = result.path + `?t=${Date.now()}`; // cache-buster
    }
  };

  fileInput.click();
}

// ----------- Room Product Editing -----------

// ✅ Edit Product Name
function editRoomName(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  const container = document.createElement("div");
  container.className = "flex items-center col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <input type="text" id="editNameInput${id}" 
           class="border border-gray-300 rounded-lg px-3 py-1 w-full text-sm focus:ring-2 focus:ring-teal-500"
           placeholder="Enter new name">
    <button class="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-700 transition"
            onclick="saveRoomName(${id})">Save</button>
    <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
            onclick="closeAllInputBoxes()">Cancel</button>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveRoomName(id) {
  const input = document.getElementById(`editNameInput${id}`);
  const newName = input.value.trim();
  if (!newName) return showToast("Please enter a name");

  const response = await fetch(`/api/room/edit-name/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room_name: newName }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update UI instantly
  const nameEl = document.getElementById(`room-name-${id}`);
  if (nameEl) nameEl.textContent = newName;

  closeAllInputBoxes();
}

// ✅ Edit Product Price
function editRoomPrice(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  // 🧾 Get current displayed price and measurement
  const priceEl = document.getElementById(`room-price-${id}`);
  const currentPrice = priceEl ? priceEl.textContent.replace("₱", "").trim() : "";

  const container = document.createElement("div");
  container.className = "flex flex-col col-span-2 gap-2 mt-2 inline-editor";

  container.innerHTML = `
    <div class="flex items-center gap-2">
      <input type="text" id="editPriceInput${id}"
             value="${currentPrice}"
             class="border border-gray-300 rounded-lg px-3 py-1 w-1/2 text-sm focus:ring-2 focus:ring-cyan-500"
             placeholder="Enter new price">
    </div>

    <div class="flex gap-2">
      <button class="bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-700 transition"
              onclick="saveRoomPrice(${id})">Save</button>
      <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
              onclick="closeAllInputBoxes()">Cancel</button>
    </div>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveRoomPrice(id) {
  const priceInput = document.getElementById(`editPriceInput${id}`);

  const newPrice = priceInput.value.trim();

  if (!newPrice || isNaN(newPrice)) return showToast("Please enter a valid price");

  const response = await fetch(`/api/room/edit-price/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price: newPrice
    }),
  });

  const result = await response.json();
  showToast(result.message);

  // ✅ Update price and measurement text
  const priceEl = document.getElementById(`room-price-${id}`);
  if (priceEl) priceEl.textContent = `₱${newPrice}`;

  closeAllInputBoxes();
}

// ✅ Replace Picture stays as file upload popup
function replaceRoomPhoto(id) {
  closeAllInputBoxes();

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`/api/room/replace-photo/${id}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    showToast(result.message);

    // ✅ Update image instantly
    const imgEl = document.getElementById(`room-photo-${id}`);
    if (imgEl && result.path) {
      imgEl.src = result.path + `?t=${Date.now()}`; // cache-buster
    }
  };

  fileInput.click();
}



// ================= Fetch & Render Functions =================
 async function fetchAndRenderFood() {
  const containerId = 'content';
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch('/api/foodProducts'); // Must return array of categories
    const data = await res.json();

    // Ensure the API returns: [{ category: 'Granny\'s Grub Originals', items: [...] }, ...]
    const dataSections = Array.isArray(data[0]?.items) ? data : [{ category: "Food Items", items: data }];

    renderItems(containerId, dataSections, foodCardTemplate);
    insertAddFoodButton();
  } catch (err) {
    console.error('Failed to load food items:', err);
    container.innerHTML = `<p class="text-red-500">Failed to load data</p>`;
  }
}

function insertAddFoodButton() {
  const container = document.getElementById("content");
  if (!container) return;

  const btn = document.createElement("button");
  btn.innerHTML = `
    <span class="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5"/>
      </svg>
      Add Food Item
    </span>
  `;

  // Remove absolute positioning and use a wrapper div for spacing
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-end mb-4"; // button aligned to right inside content
  wrapper.appendChild(btn);

  btn.onclick = () => {
    openAddFoodModal(); // your modal opening function
  };

  // Insert the button at the top of the main content
  container.prepend(wrapper);
}



async function fetchAndRenderRoom() {
  const containerId = 'content';
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show loading
  container.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch('/api/rooms'); // Must return array of categories
    const data = await res.json();

    // Ensure the API returns: [{ category: 'Granny\'s Grub Originals', items: [...] }, ...]
    const dataSections = Array.isArray(data[0]?.items) ? data : [{ category: "Room Management", items: data }];

    renderItems(containerId, dataSections, roomCardTemplate);
    insertAddRoomButton();
  } catch (err) {
    console.error('Failed to load food items:', err);
    container.innerHTML = `<p class="text-red-500">Failed to load data</p>`;
  }
}

function insertAddRoomButton() {
  const container = document.getElementById("content");
  if (!container) return;

  const btn = document.createElement("button");
  btn.innerHTML = `
    <span onclick="openAddRoomModal()" class="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5"/>
      </svg>
      Add Room
    </span>
  `;

  // Remove absolute positioning and use a wrapper div for spacing
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-end mb-4"; // button aligned to right inside content
  wrapper.appendChild(btn);

  // Insert the button at the top of the main content
  container.prepend(wrapper);
}


async function fetchAndRenderFarmProducts() {
  const containerId = 'content'; // You can reuse the same container
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch('/api/farmProducts'); // your API endpoint
    const data = await res.json();

    const dataSections = Array.isArray(data[0]?.items) ? data : [{ category: "Farm Products", items: data }];

    renderItems(containerId, dataSections, farmCardTemplate);
  } catch (err) {
    console.error('Failed to load farm products:', err);
    container.innerHTML = `<p class="text-red-500">Failed to load data</p>`;
  }
}

async function fetchAndRenderFoodOrders(status = null) {
  const containerId = "content";
  const container = document.getElementById(containerId);

  try {
    const res = await fetch("/api/foodOrder"); // fetch all orders
    const data = await res.json();

    // Filter by status if provided
    const filteredData = status ? data.filter(order => order.order_status === status) : data;

    // Render filtered orders
    renderOrders(containerId, filteredData, foodOrderTemplate);
  } catch (err) {
    console.error("Failed to load food orders:", err);
    if (container) container.innerHTML = `<p class="text-red-500">Failed to load orders</p>`;
  }
}

async function fetchAndRenderFarmOrders(statusFilter = null) {
  const container = document.getElementById('content');
  if (!container) return;
  container.innerHTML = `<p class="text-gray-500">Loading farm orders...</p>`;

  try {
    const res = await fetch('/api/farmOrder');
    let data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p class="text-gray-500">No farm orders found.</p>`;
      return;
    }

    // sort by created_at if present
    data.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });

    // filter if requested
    const display = statusFilter ? data.filter(o => o.order_status === statusFilter) : data;

    if (!display.length) {
      container.innerHTML = `<p class="text-gray-500">No ${statusFilter ?? ''} orders found.</p>`;
      return;
    }

    container.innerHTML = `
      <h2 class="mb-6 text-2xl font-bold text-teal-700">Farm Orders</h2>
      <div class="space-y-4">
        ${display.map(farmOrderCardTemplate).join('')}
      </div>
    `;

    // attach click handlers to cards (after render)
    container.querySelectorAll('.order-item[data-id]').forEach(card => {
      const id = card.getAttribute('data-id');
      const order = display.find(o => o.farmOrder_id == id);
      if (!order) return;
      card.addEventListener('click', () => {
        const showButtons = order.order_status === 'Pending';
        openFarmOrderModal(order, showButtons);
      });
    });

  } catch (err) {
    console.error('Failed to load farm orders:', err);
    container.innerHTML = `<p class="text-red-500">Failed to load farm orders.</p>`;
  }
}


async function fetchAndRenderRoomReservations(status = null) {
  const container = document.getElementById("content");
  try {
    const res = await fetch("/api/roomReser");
    const data = await res.json();

    // Filter by status
    const filtered = status ? data.filter(r => r.status === status) : data;

    // Render each reservation card
    container.innerHTML = filtered.map(roomReservationTemplate).join("");

    // ✅ Store the fetched data on the container for later reference
    container.dataset.roomReservations = JSON.stringify(data);

    // ✅ Add click handlers for each card
    document.querySelectorAll(".order-item").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        const allReservations = JSON.parse(container.dataset.roomReservations);
        const reservation = allReservations.find(r => r.room_reser_id == id);
        if (reservation) openRoomModal(reservation);
      });
    });
  } catch (err) {
    console.error("Error fetching room reservations:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load room reservations</p>`;
  }
}

async function fetchAndRenderEventReservations(status = null) {
  const container = document.getElementById("content");
  try {
    const res = await fetch("/api/event-reservations");
    const data = await res.json();

    // Filter by status
    const filtered = status ? data.filter(r => r.approval_status === status) : data;

    // Render each reservation card
    container.innerHTML = filtered.map(eventReservationTemplate).join("");

    // ✅ Store the fetched data on the container for later reference
    container.dataset.eventReservations = JSON.stringify(data);

    // ✅ Add click handlers for each card
    document.querySelectorAll(".order-item").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        const allReservations = JSON.parse(container.dataset.eventReservations);
        const reservation = allReservations.find(r => r.event_reservation_id == id);
        if (reservation) openEventModal(reservation);
      });
    });
  } catch (err) {
    console.error("Error fetching room reservations:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load room reservations</p>`;
  }
}


// =================== Kitchen Inventory ===================
async function fetchAndRenderKitchen() {
  const content = document.getElementById("content");
  content.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch("/api/inventory");
    const data = await res.json();

    content.innerHTML = `
      <div class="p-6 bg-white rounded-2xl shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-teal-700">Kitchen Inventory</h2>
          <button onclick="openAddKitchenModal()" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            + Add Item
          </button>
        </div>

        <table class="min-w-full border border-gray-200 text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-2">Action</th>
              <th class="px-4 py-2">Ingredient</th>
              <th class="px-4 py-2">Min Stock</th>
              <th class="px-4 py-2">Current Stock</th>
              <th class="px-4 py-2">Unit</th>
              <th class="px-4 py-2">EOQ</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
<tr class="border-t hover:bg-gray-50 relative">
  <td class="px-4 py-2 relative">
    <!-- Toggle button -->
    <button onclick="toggleActionMenu(event, ${item.id})" class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">
      ⚙️
    </button>

    <!-- Dropdown menu (hidden by default) -->
    <div id="actionMenu-${item.id}" class="absolute right-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
      <button onclick="removeKitchenItem(${item.id})" class="block w-full text-left px-3 py-1 hover:bg-red-100">Remove</button>
      <button onclick="openKitchenStockModal(${item.id})" class="block w-full text-left px-3 py-1 hover:bg-blue-100">+ Stock</button>
      <button onclick="openSpoilageModal(${item.id})" class="block w-full text-left px-3 py-1 hover:bg-yellow-100">Spoilage/Loss</button>
    </div>
  </td>
  <td class="px-4 py-2">${item.item_name}</td>
  <td class="px-4 py-2">${item.min_stock}</td>
  <td class="px-4 py-2">${item.current_stock}</td>
  <td class="px-4 py-2">${item.unit ?? '—'}</td>
  <td class="px-4 py-2">${item.eoq ? item.eoq.toFixed(2) : '—'}</td>
  <td class="px-4 py-2 font-medium ${
    item.status === 'Low Stock'
      ? 'text-yellow-600'
      : item.status === 'Restock Needed'
      ? 'text-red-500'
      : 'text-green-600'
  }">${item.status}</td>
  <td class="px-4 py-2">${item.last_updated ?? '—'}</td>
</tr>
`).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error("Failed to load kitchen inventory:", err);
    content.innerHTML = `<p class="text-red-500">Failed to load kitchen inventory</p>`;
  }
}

// Toggle action menu
let openActionMenuId = null;

function toggleActionMenu(event, id) {
  event.stopPropagation();

  const menu = document.getElementById(`actionMenu-${id}`);
  if (!menu) {
    console.warn("⚠️ action menu not found for id:", id);
    return; // exit if element doesn't exist
  }

  // Close previously open menu if different
  if (openActionMenuId && openActionMenuId !== id) {
    const prevMenu = document.getElementById(`actionMenu-${openActionMenuId}`);
    if (prevMenu) prevMenu.classList.add('hidden');
  }

  // Toggle current menu
  menu.classList.toggle('hidden');
  openActionMenuId = menu.classList.contains('hidden') ? null : id;
}

// Close menu when clicking outside
document.addEventListener('click', () => {
  if (openActionMenuId) {
    const menu = document.getElementById(`actionMenu-${openActionMenuId}`);
    if (menu) menu.classList.add('hidden');
    openActionMenuId = null;
  }
});

// =================== Farm Inventory ===================
async function fetchAndRenderFarm() {
  const content = document.getElementById("content");
  content.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch("/api/farmInventory");
    const data = await res.json();

    content.innerHTML = `
      <div class="p-6 bg-white rounded-2xl shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-teal-700">Farm Inventory</h2>
          <button onclick="openAddFarmModal()" 
                  class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            + Add Item
          </button>
        </div>

        <table class="min-w-full border border-gray-200 text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-2">Action</th>
              <th class="px-4 py-2">Item</th>
              <th class="px-4 py-2">Min Stock</th>
              <th class="px-4 py-2">Current Stock</th>
              <th class="px-4 py-2">Unit</th>
              <th class="px-4 py-2">Unit Conversion</th>
              <th class="px-4 py-2">Unit Cost</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr class="border-t hover:bg-gray-50 relative">
                <td class="px-4 py-2 relative">
                  <button onclick="toggleActionMenu(event, ${item.id})" 
                          class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">
                    ⚙️
                  </button>

                  <div id="actionMenu-${item.id}" 
                       class="absolute right-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
                    <button onclick="removeFarmItem(${item.id})" 
                            class="block w-full text-left px-3 py-1 hover:bg-red-100">
                      Remove
                    </button>
                    <button onclick="openFarmStockModal(${item.id})" 
                            class="block w-full text-left px-3 py-1 hover:bg-blue-100">
                      + Stock
                    </button>
                    <button onclick="openFarmSpoilageModal(${item.id})" 
                            class="block w-full text-left px-3 py-1 hover:bg-yellow-100">
                      Spoilage/Loss
                    </button>
                  </div>
                </td>
                <td class="px-4 py-2">${item.item_name}</td>
                <td class="px-4 py-2">${item.min_stock !== null ? item.min_stock.toFixed(2) : '—'}</td>
                <td class="px-4 py-2">${item.current_stock !== null ? item.current_stock.toFixed(2) : '—'}</td>
                <td class="px-4 py-2">${item.unit ?? '—'}</td>
                <td class="px-4 py-2">${item.unit_conversion ?? '1'}</td>
                <td class="px-4 py-2">
                ${
                item.unit_cost !== null && item.unit_cost !== "" && !isNaN(item.unit_cost)
                ? "₱" + Number(item.unit_cost).toFixed(2)
                 : "—"
                  }
                </td>
                <td class="px-4 py-2 font-medium ${
                  item.status === 'Low Stock'
                    ? 'text-yellow-600'
                    : item.status === 'Restock Needed'
                    ? 'text-red-500'
                    : 'text-green-600'
                }">${item.status}</td>
                <td class="px-4 py-2">${item.last_updated ?? '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error("Failed to load farm inventory:", err);
    content.innerHTML = `<p class="text-red-500">Failed to load farm inventory</p>`;
  }
}

// Fetch and Render Event Management

async function fetchAndRenderEventManagement() {
  const container = document.getElementById("content");

  try {
    const res = await fetch("/api/events");
    const data = await res.json();

    container.innerHTML = eventManagementTemplate(data);

    container.dataset.eventManagement = JSON.stringify(data);

  } catch (err) {
    console.error("Error fetching event management data:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load events</p>`;
  }
}

// Action Menu
let OpenActionMenuId = null;
function toggleActionMenu(event, id) {
  event.stopPropagation();
  const menu = document.getElementById(`actionMenu-${id}`);
  if (!menu) return;

  if (OpenActionMenuId && OpenActionMenuId !== id) {
    const prev = document.getElementById(`actionMenu-${OpenActionMenuId}`);
    if (prev) prev.classList.add('hidden');
  }

  menu.classList.toggle('hidden');
  OpenActionMenuId = menu.classList.contains('hidden') ? null : id;
}
document.addEventListener('click', () => {
  if (OpenActionMenuId) {
    const menu = document.getElementById(`actionMenu-${OpenActionMenuId}`);
    if (menu) menu.classList.add('hidden');
    OpenActionMenuId = null;
  }
});



// Side Buttons Logic
document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");
  const content = document.getElementById("content");

  // =================== Section Mapping ===================
  const sections = {
    food: { render: fetchAndRenderFood },
    farmProducts: { render: fetchAndRenderFarmProducts },
    kitchen: { render: fetchAndRenderKitchen },
    farm: { render: fetchAndRenderFarm },
    foodOrders: { render: fetchAndRenderFoodOrders },
    farmOrders: { render: fetchAndRenderFarmOrders },
    room: { render: fetchAndRenderRoomReservations },
    roomManagement: {render: fetchAndRenderRoom},
    event: { render: fetchAndRenderEventReservations},
    eventManagement: { render: fetchAndRenderEventManagement },
    cancel: {
      title: "Cancellation",
      text: "This is the Cancellation section. Manage cancellations and refund requests here."
    }
  };

  // =================== Sidebar Button Logic ===================
try {
    console.log("🔍 Initializing sidebar buttons...");

    sidebarButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            console.log("▶ Sidebar clicked:", btn.dataset.section);

            if (btn.classList.contains("submenu-toggle")) {
                console.log("⏩ Submenu toggle button, skipping highlight logic");
                return;
            }

            // Reset all buttons
            sidebarButtons.forEach(b => {
                b.classList.remove("bg-teal-600", "text-white", "hover:bg-teal-700", "hover:border-teal-700");
                if (!b.classList.contains("text-red-700")) {
                    b.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200", "hover:border-gray-400");
                }
            });

            // Highlight active
            btn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200", "hover:border-gray-400");
            btn.classList.add("bg-teal-600", "text-white", "hover:bg-teal-700", "hover:border-teal-700");

            console.log("📌 Loading section:", btn.dataset.section);

            const section = sections[btn.dataset.section];
            if (!section) {
                console.error("❌ No section found for:", btn.dataset.section);
                return;
            }

            if (section.render) {
                console.log("🎨 Rendering custom section");
                section.render();
            } else if (section.custom) {
                console.log("📄 Loading custom HTML section");
                content.innerHTML = section.custom;
            } else {
                console.log("📝 Loading default title/text section");
                content.innerHTML = `
                  <h2 class="mb-4 text-xl font-bold text-teal-700">${section.title}</h2>
                  <p class="text-gray-700">${section.text}</p>
                `;
            }
        });
    });
} catch (err) {
    console.error("❌ ERROR in Sidebar Button Logic:", err);
}

  // =================== Submenu Logic ===================
  // Food Orders submenu
  const foodOrdersBtn = document.getElementById("foodOrdersBtn");
  const foodOrdersSubmenu = document.getElementById("foodOrdersSubmenu");
  if (foodOrdersBtn && foodOrdersSubmenu) {
    foodOrdersBtn.addEventListener("click", () => {
      foodOrdersSubmenu.classList.toggle("hidden");
    });

    foodOrdersSubmenu.querySelectorAll("button[data-status]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const status = btn.dataset.status;
        await fetchAndRenderFoodOrders(status);
      });
    });
  }

  // Farm Orders submenu
  const farmOrdersBtn = document.getElementById("farmOrdersBtn");
  const farmOrdersSubmenu = document.getElementById("farmOrdersSubmenu");
  if (farmOrdersBtn && farmOrdersSubmenu) {
    farmOrdersBtn.addEventListener("click", () => {
      farmOrdersSubmenu.classList.toggle("hidden");
    });

    farmOrdersSubmenu.querySelectorAll("button[data-status]").forEach(btn => {
      btn.addEventListener("click", async () => {
        farmOrdersSubmenu.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const status = btn.dataset.status;
        await fetchAndRenderFarmOrders(status);
      });
    });
  }

  // Room Reservations submenu
const roomBtn = document.getElementById("roomReservationsBtn");
const roomSubmenu = document.getElementById("roomReservationsSubmenu");

if (roomBtn && roomSubmenu) {
  roomBtn.addEventListener("click", () => {
    roomSubmenu.classList.toggle("hidden");
  });

  roomSubmenu.querySelectorAll("button[data-status]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const status = btn.dataset.status;
      await fetchAndRenderRoomReservations(status);
    });
  });
}


// Event Reservations submenu
const eventBtn = document.getElementById("eventReservationsBtn");
const eventSubmenu = document.getElementById("eventReservationsSubmenu");

if (eventBtn && eventSubmenu) {
  eventBtn.addEventListener("click", () => {
    eventSubmenu.classList.toggle("hidden");
  });

  eventSubmenu.querySelectorAll("button[data-status]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const status = btn.dataset.status;
      await fetchAndRenderEventReservations(status);
    });
  });
}


// Page Management submenu

const pageManagementBtn = document.getElementById('pageManagementBtn');
const pageManagementSubmenu = document.getElementById('pageManagementSubmenu');

pageManagementBtn.addEventListener('click', () => {
  pageManagementSubmenu.classList.toggle('hidden');
});

});


  
// ================= Modals =================


// 🔹 Input validation
function validateFloatInput(input) {
  input.value = input.value.replace(/[^0-9.]/g, '');
  if ((input.value.match(/\./g) || []).length > 1) {
    input.value = input.value.substring(0, input.value.length - 1);
  }
}


// Food Order Details Modal

const foodOrderModal = document.getElementById('foodOrderModal');
const modalTitle = document.getElementById('modalTitle');
const modalItems = document.getElementById('modalItems');
const modalTotal = document.getElementById('modalTotal');
const modalRef = document.getElementById('modalRef');
const modalButtons = document.getElementById('modalButtons');
const closeModal = document.getElementById('closeModal');
const completeOrderBtn = document.getElementById('completeOrderBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');

closeModal.addEventListener('click', () => foodOrderModal.classList.add('hidden'));

// Function to open modal for a selected order
function openFoodOrderModal(order) {
  modalTitle.textContent = `Order #${order.foodOrder_id}`;
  modalRef.textContent = `Reference: ${order.ref_number}`;

  // Populate items
  const items = [
    { key: 'smokedFish_order', name: 'Smoked Fish' },
    { key: 'deviledFish_order', name: 'Deviled Fish' },
    { key: 'seaSig_order', name: 'SeaSig' },
    { key: 'blueCraze_order', name: 'Blue Craze' },
    { key: 'chickenSheet_order', name: 'Chicken Sheet' },
    { key: 'blackMeal_order', name: 'Black Meal' }
  ];

  modalItems.innerHTML = items
    .filter(i => order[i.key] && order[i.key] > 0)
    .map(i => `<li>${order[i.key]}x ${i.name}</li>`).join('');

  modalTotal.textContent = `Total Bill: ₱${parseFloat(order.total_bill).toLocaleString()}`;

  // Hide buttons if order is already completed or cancelled
  if (order.order_status === 'Completed' || order.order_status === 'Cancelled') {
    modalButtons.style.display = 'none';
  } else {
    modalButtons.style.display = 'flex';
    completeOrderBtn.onclick = () => updateOrderStatus(order.foodOrder_id, 'Completed');
    cancelOrderBtn.onclick = () => updateOrderStatus(order.foodOrder_id, 'Cancelled');
  }

  foodOrderModal.classList.remove('hidden');
}

// Update order status
function updateOrderStatus(foodOrderId, status) {
  fetch(`/api/foodOrder/${foodOrderId}/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_status: status })
  })
  .then(res => res.json())
  .then(data => {
    showToast(data.message); // optional toast instead of alert
    foodOrderModal.classList.add('hidden');

    // Update the order card on the page if it exists
    const card = document.querySelector(`.order-item[data-id="${foodOrderId}"]`);
    if (card) {
      // Update status text
      const statusBadge = card.querySelector('span');
      if (statusBadge) {
        statusBadge.textContent = status;
        if (status === 'Completed') {
          statusBadge.className = 'px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full';
        } else if (status === 'Cancelled') {
          statusBadge.className = 'px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full';
        } else {
          statusBadge.className = 'px-2 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full';
        }
      }
    }
  })
  .catch(err => console.error(err));
}

// --- Farm Modal elements (IDs must match the modal HTML) ---
const farmOrderModal = document.getElementById('farmOrderModal');
const farmModalTitle = document.getElementById('farmModalTitle');
const farmModalRef = document.getElementById('farmModalRef');
const farmModalItems = document.getElementById('farmModalItems');
const farmModalTotal = document.getElementById('farmModalTotal');
const farmModalOrderStatus = document.getElementById('farmModalOrderStatus');
const farmModalButtons = document.getElementById('farmModalButtons');
const farmCloseModal = document.getElementById('farmCloseModal');
const farmCompleteBtn = document.getElementById('farmCompleteBtn');
const farmCancelBtn = document.getElementById('farmCancelBtn');

farmCloseModal?.addEventListener('click', () => farmOrderModal.classList.add('hidden'));

// Open modal for farm order
function openFarmOrderModal(order, showButtons = true) {
  farmModalTitle.textContent = `Order #${order.farmOrder_id}`;
  farmModalRef.textContent = `Reference: ${order.ref_number ?? 'N/A'}`;

  const items = [
    { key: 'bangus_order', name: 'Bangus' },
    { key: 'eggs_order', name: 'Eggs' },
    { key: 'mudCrab_order', name: 'Mud Crab' },
    { key: 'nativeChicken_order', name: 'Native Chicken' },
    { key: 'nativePork_order', name: 'Native Pork' },
    { key: 'squash_order', name: 'Squash' }
  ];

  farmModalItems.innerHTML = items
    .filter(i => order[i.key] && order[i.key] > 0)
    .map(i => `<li>${order[i.key]}x ${i.name}</li>`).join('');

  farmModalTotal.textContent = `Total Bill: ₱${parseFloat(order.total_bill).toLocaleString()}`;
  farmModalOrderStatus.textContent = `Order Status: ${order.order_status ?? 'N/A'}`;

  const shouldShowButtons = showButtons && order.order_status === 'Pending';
  farmModalButtons.style.display = shouldShowButtons ? 'flex' : 'none';

  // set handlers (replace previous handlers if any)
  farmCompleteBtn.onclick = () => updateFarmOrderStatus(order.farmOrder_id, 'Completed');
  farmCancelBtn.onclick = () => updateFarmOrderStatus(order.farmOrder_id, 'Cancelled');

  farmOrderModal.classList.remove('hidden');
}

function updateFarmOrderStatus(farmOrderId, status) {
  fetch(`/api/farmOrder/${farmOrderId}/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_status: status })
  })
    .then(r => r.json())
    .then(json => {
      if (json.message) showToast(json.message);

      // update card in DOM
      const container = document.getElementById('content');
      const card = container?.querySelector(`.order-item[data-id="${farmOrderId}"]`);
      if (card) {
        card.dataset.orderStatus = status;
        const orderStatusEl = card.querySelector('[data-field="order-status"]');
        if (orderStatusEl) orderStatusEl.textContent = status;

        // adjust payment/status badge styles if you want:
        const badge = card.querySelector('span');
        if (badge) {
          if (status === 'Completed') badge.className = 'px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full';
          else if (status === 'Cancelled') badge.className = 'px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full';
          else badge.className = 'px-2 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full';
        }
      }

      // hide modal and update modal UI
      farmModalOrderStatus.textContent = `Order Status: ${status}`;
      farmModalButtons.style.display = 'none';
      farmOrderModal.classList.add('hidden');

      // refresh current filter if there is an active one
      const activeBtn = document.querySelector('#farmOrdersSubmenu button.active');
      const activeStatus = activeBtn ? activeBtn.dataset.status : null;
      fetchAndRenderFarmOrders(activeStatus);
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to update order', 'error');
    });
}

function openRoomModal(reservation) {
  document.getElementById("roomModalTitle").textContent = `Reservation #${reservation.room_reser_id}`;
  document.getElementById("roomModalRef").textContent = `Guest: ${reservation.full_name}`;
  document.getElementById("roomModalItems").innerHTML = `
    <li>Room: ${reservation.room}</li>
    <li>Check-in: ${reservation.check_in_date}</li>
    <li>Check-out: ${reservation.check_out_date}</li>
    <li>Phone: ${reservation.phone_number}</li>
    <li>Payment Status: ${reservation.payment_status}</li>
  `;

  const modalButtons = document.getElementById("roomModalButtons");
  if (["Checked-in", "Checked-out", "Cancelled"].includes(reservation.status)) {
    modalButtons.style.display = "none";
  } else {
    modalButtons.style.display = "flex";
    document.getElementById("checkInBtn").onclick = () => updateRoomStatus(reservation.room_reser_id, "Checked-in");
    document.getElementById("checkOutBtn").onclick = () => updateRoomStatus(reservation.room_reser_id, "Checked-out");
    document.getElementById("cancelRoomBtn").onclick = () => updateRoomStatus(reservation.room_reser_id, "Cancelled");
  }

  document.getElementById("roomReservationModal").classList.remove("hidden");
}

// Close modal
document.getElementById("closeRoomModal").addEventListener("click", () => {
  document.getElementById("roomReservationModal").classList.add("hidden");
});

// --- Update reservation status ---
function updateRoomStatus(reservationId, status) {
  fetch(`/api/roomReservation/${reservationId}/update-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.message);
      document.getElementById("roomReservationModal").classList.add("hidden");

      // Update UI instantly
      const card = document.querySelector(`.order-item[data-id="${reservationId}"]`);
      if (card) {
        const badge = card.querySelector("span");
        badge.textContent = status;
        if (status === "Checked-in") badge.className = "px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full";
        else if (status === "Checked-out") badge.className = "px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full";
        else if (status === "Cancelled") badge.className = "px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full";
        else badge.className = "px-2 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full";
      }
    })
    .catch(err => console.error(err));
}




function openEventModal(reservation) {
  document.getElementById("eventModalTitle").textContent = `Reservation #${reservation.event_reservation_id}`;
  document.getElementById("eventModalRef").textContent = `Guest: ${reservation.full_name}`;
  document.getElementById("eventModalItems").innerHTML = `
    <li>Event: ${reservation.event_type}</li>
    <li>Start: ${reservation.start_datetime}</li>
    <li>End: ${reservation.end_datetime}</li>
    <li>Phone: ${reservation.phone_number}</li>
    <li>Things to Bring: ${reservation.to_bring}</li>
    <li>Status: ${reservation.approval_status}</li>
  `;

  const modalButtons = document.getElementById("eventModalButtons");

  // 🔥 FIRST HIDE ALL BUTTONS
  const buttons = [
    "approveBtn",
    "disapproveBtn",
    "cancelEventBtn",
    "startEventBtn",
    "endEventBtn"
  ];
  buttons.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  // 🔥 NOW SHOW BUTTONS BASED ON STATUS
  const status = reservation.approval_status;

  if (["Dissaproved", "Cancelled", "Ended"].includes(status)) {
    modalButtons.style.display = "none";   // nothing to show
  } 
  
  else if (status === "Pending") {
    modalButtons.style.display = "flex";
    document.getElementById("approveBtn").style.display = "block";
    document.getElementById("disapproveBtn").style.display = "block";
    document.getElementById("cancelEventBtn").style.display = "block";

    document.getElementById("approveBtn").onclick = () =>
      updateEventStatus(reservation.event_reservation_id, "Approved");
    document.getElementById("disapproveBtn").onclick = () =>
      updateEventStatus(reservation.event_reservation_id, "Disapproved");
    document.getElementById("cancelEventBtn").onclick = () =>
      updateEventStatus(reservation.event_reservation_id, "Cancelled");
  }

  else if (status === "Approved") {
    modalButtons.style.display = "flex";
    document.getElementById("startEventBtn").style.display = "block";
    document.getElementById("endEventBtn").style.display = "block";

    document.getElementById("startEventBtn").onclick = () =>
      updateEventStatus(reservation.event_reservation_id, "Started");
    document.getElementById("endEventBtn").onclick = () =>
      updateEventStatus(reservation.event_reservation_id, "Ended");
  }

  else if (status === "Started") {
    modalButtons.style.display = "flex";
    document.getElementById("endEventBtn").style.display = "block";

    document.getElementById("endEventBtn").onclick = () =>
      updateEventStatus(reservation.event_reservation_id, "Ended");
  }

  document.getElementById("eventReservationModal").classList.remove("hidden");
}


document.getElementById("closeEventModal").addEventListener("click", () => {
  document.getElementById("eventReservationModal").classList.add("hidden");
});

function updateEventStatus(event_reservation_id, status) {
  fetch(`/api/eventReservation/${event_reservation_id}/update-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.message);
      document.getElementById("eventReservationModal").classList.add("hidden");

      const statusEl = document.getElementById(`event-status-${event_reservation_id}`);
      if (statusEl) {
        statusEl.textContent = `Status: ${status}`;
      }

      const container = document.getElementById("content");
      if (container.dataset.eventReservations) {
        let list = JSON.parse(container.dataset.eventReservations);
        let record = list.find(r => r.event_reservation_id == event_reservation_id);
        if (record) record.approval_status = status;
        container.dataset.eventReservations = JSON.stringify(list);
      }
    })
    .catch(err => console.error(err));

    
}


// Kitchen Inventory Modal

// Add Item
function openAddKitchenModal() {
  const modal = `
    <div id="addKitchenModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-teal-700">Add Ingredient</h2>
        <form id="addKitchenForm" class="space-y-3">
          <input type="text" name="item_name" placeholder="Item Name" required class="w-full border rounded-lg p-2">

          <input type="text" name="min_stock" placeholder="Minimum Stock" required 
            class="w-full border rounded-lg p-2" oninput="validateFloatInput(this)">

          <input type="text" name="current_stock" placeholder="Current Stock" required 
            class="w-full border rounded-lg p-2" oninput="validateFloatInput(this)">

          <input type="text" name="unit" placeholder="Unit (e.g., kg, pcs, L)" required class="w-full border rounded-lg p-2">

          <input type="text" name="unit_cost" placeholder="Unit Cost (₱ per unit, e.g., per kg or pcs)" 
            class="w-full border rounded-lg p-2" oninput="validateFloatInput(this)">

          <hr class="my-3">
          <h3 class="text-md font-semibold text-gray-700">Optional EOQ Fields</h3>

          <input type="text" name="weekly_demand" placeholder="Weekly Demand" 
            class="w-full border rounded-lg p-2" oninput="validateFloatInput(this)">

          <input type="text" name="ordering_cost" placeholder="Ordering Cost" 
            class="w-full border rounded-lg p-2" oninput="validateFloatInput(this)">

          <p class="text-sm text-gray-500 italic">* Holding cost and EOQ will be calculated automatically.</p>

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" onclick="closeKitchenModal('addKitchenModal')" class="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Add</button>
          </div>
        </form>
      </div>
    </div>`;
  
  document.body.insertAdjacentHTML("beforeend", modal);

  // 🔹 Handle Add Ingredient submission
  document.getElementById("addKitchenForm").onsubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));

    const numericFields = ["min_stock", "current_stock", "unit_cost", "weekly_demand", "ordering_cost"];
    for (const field of numericFields) {
      if (formData[field] && isNaN(parseFloat(formData[field]))) {
        alert(`${field.replace('_', ' ')} must be a valid number`);
        return;
      }
    }

    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      closeKitchenModal("addKitchenModal");
      fetchAndRenderKitchen();
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    }
  };
}


// Add Stock
function openKitchenStockModal(id) {
  const modal = `
    <div id="stockKitchenModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-teal-700">Add Stock</h2>
        <form id="stockKitchenForm" class="space-y-3">
          <input type="text" name="amount" placeholder="Amount to Add" required 
            class="w-full border rounded-lg p-2" oninput="validateFloatInput(this)">
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" onclick="closeKitchenModal('stockKitchenModal')" class="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
          </div>
        </form>
      </div>
    </div>`;
  
  document.body.insertAdjacentHTML("beforeend", modal);

  // 🔹 Handle Add Stock submission
  document.getElementById("stockKitchenForm").onsubmit = async (e) => {
    e.preventDefault();
    const { amount } = Object.fromEntries(new FormData(e.target));

    // ✅ Check if amount is valid float
    if (isNaN(parseFloat(amount))) {
      alert("Amount must be a valid number");
      return;
    }

    await fetch(`/api/inventory/add-stock/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    closeKitchenModal("stockKitchenModal");
    fetchAndRenderKitchen();
  };
}

// Remove Item
function customConfirm(message) {
  return new Promise((resolve) => {
    // Create popup container
    const popup = document.createElement("div");
    popup.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";

    popup.innerHTML = `
      <div class="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
        <p class="text-gray-800 text-lg font-medium mb-6">${message}</p>
        <div class="flex justify-center gap-4">
          <button id="confirmYes" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Yes
          </button>
          <button id="confirmNo" 
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
            No
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Handle Yes
    popup.querySelector("#confirmYes").onclick = () => {
      popup.remove();
      resolve(true);
    };

    // Handle No
    popup.querySelector("#confirmNo").onclick = () => {
      popup.remove();
      resolve(false);
    };
  });
}

async function removeKitchenItem(id) {
  const confirmed = await customConfirm("Remove this ingredient?");
  if (!confirmed) return;

  await fetch(`/api/inventory/${id}`, { method: "DELETE" });
  fetchAndRenderKitchen();
}


// Close modal helper 
function closeKitchenModal(id) {
  document.getElementById(id)?.remove();
}

// Spoilage/Loss Modal

// Open Spoilage/Loss modal
function openSpoilageModal(itemId) {
    const modal = document.getElementById('spoilageModal');
    const input = document.getElementById('spoilageItemId');

    if (!modal || !input) {
        console.error("Spoilage modal or input not found!");
        return;
    }

    input.value = itemId; // Save the item ID for the action
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // disable scroll
}

// Close Spoilage/Loss modal
function closeSpoilageModal() {
    const modal = document.getElementById('spoilageModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // re-enable scroll
    }
}

// Handle spoilage/loss form submission
async function submitSpoilage() {
    const itemId = document.getElementById('spoilageItemId').value;
    const qty = parseFloat(document.getElementById('spoilageQty').value);
    const reason = document.getElementById('spoilageReason').value;

    if (!itemId || !qty || !reason) {
        alert("Please fill in all fields.");
        return;
    }

    try {
       const res = await fetch(`https://greenlinklolasayong.site/api/kitchenInventory/${itemId}/spoilage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: qty, reason })
});

        const data = await res.json();
        
        function showPopup(message, type = "success") {
    // Colors based on success or error
    const bg = type === "success" ? "bg-green-600" : "bg-red-600";

    // Create popup
    const popup = document.createElement("div");
    popup.className = `
        fixed top-5 right-5 z-[9999]
        text-white px-4 py-3 rounded-lg shadow-lg
        ${bg} animate-fade-in
    `;
    popup.textContent = message;

    // Add fade-out animation
    popup.style.transition = "opacity 0.5s ease";

    // Add to page
    document.body.appendChild(popup);

    // Auto-remove after 2.5 sec
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 500);
    }, 2500);
}

// Add animation if not existing
if (!document.getElementById("popup-animation-style")) {
    const style = document.createElement("style");
    style.id = "popup-animation-style";
    style.textContent = `
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
    `;
    document.head.appendChild(style);
}


        if (res.ok) {
    showPopup("Spoilage/loss recorded!", "success");
    closeSpoilageModal();
    fetchAndRenderKitchen();
} else {
    console.error("Error:", data);
    showPopup("Failed to record spoilage/loss.", "error");
}
} catch (err) {
    console.error(err);
    showPopup("Error submitting spoilage/loss.", "error");
}
}

// Farm Inventory


async function removeFarmItem(id) {
  if (!confirm("Are you sure you want to remove this item?")) return;

  try {
    const res = await fetch(`/api/farmInventory/${id}`, { method: "DELETE" });
    const data = await res.json();

    showToast(data.message);
    fetchAndRenderFarm();
  } catch (err) {
    showToast("Failed to remove item", "error");
  }
}

// 🌾 --- Farm Inventory Modal Logic ---

function openAddFarmModal() {
  document.getElementById("addFarmModal").classList.remove("hidden");
}

function closeAddFarmModal() {
  document.getElementById("addFarmModal").classList.add("hidden");
}

async function submitAddFarmItem(e) {
  if (e) e.preventDefault();

  const form = document.getElementById("addFarmForm");
  const formData = new FormData(form);

  try {
    const res = await fetch(`/api/farmInventoryStore`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to add item");

    closeAddFarmModal();
    form.reset();
    await fetchAndRenderFarm();
  } catch (err) {
    alert("Error adding item: " + err.message);
  }
}


function openFarmSpoilageModal(id) {
  document.getElementById("farmSpoilageItemId").value = id;
  document.getElementById("farmSpoilageModal").classList.remove("hidden");
}

function closeFarmSpoilageModal() {
  document.getElementById("farmSpoilageModal").classList.add("hidden");
  document.getElementById("farmSpoilageQty").value = "";
  document.getElementById("farmSpoilageReason").value = "";
}

async function submitFarmSpoilage() {
  const id = document.getElementById("farmSpoilageItemId").value;
  const quantity = document.getElementById("farmSpoilageQty").value;
  const reason = document.getElementById("farmSpoilageReason").value;

  if (!quantity || quantity <= 0) {
    showToast("Enter valid quantity", "error");
    return;
  }

  const res = await fetch(`/api/farmInventory/${id}/spoilage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity, reason }),
  });

  const data = await res.json();
  showToast(data.message);
  closeFarmSpoilageModal();
  fetchAndRenderFarm();
}

function openFarmStockModal(id) {
  document.getElementById("farmStockItemId").value = id;
  document.getElementById("farmStockModal").classList.remove("hidden");
}

function closeFarmStockModal() {
  document.getElementById("farmStockModal").classList.add("hidden");
  document.getElementById("farmStockAmount").value = "";
}

async function submitFarmStock() {
  const id = document.getElementById("farmStockItemId").value;
  const amount = document.getElementById("farmStockAmount").value;

  if (!amount || amount <= 0) {
    showToast("Enter valid stock amount", "error");
    return;
  }

  const res = await fetch(`/api/farmInventory/add-stock/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();
  showToast(data.message);
  closeFarmStockModal();
  fetchAndRenderFarm();
}

// 🌾 --- Event Management Modal Logic ---

function openAddEventModal() {
  document.getElementById("addEventModal").classList.remove("hidden");
}

function closeAddEventModal() {
  document.getElementById("addEventModal").classList.add("hidden");
}

async function submitAddEvent(e) {
  if (e) e.preventDefault();

  const form = document.getElementById("addEventForm");
  const formData = new FormData(form);

  try {
    const res = await fetch(`/api/event-management/add`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to add item");

    closeAddEventModal();
    form.reset();
    await fetchAndRenderEventManagement();
  } catch (err) {
    alert("Error adding event: " + err.message);
  }
}


function openEditEventNameModal(id) {
  document.getElementById("eventId").value = id;
  document.getElementById("editEventNameModal").classList.remove("hidden");
}

function closeEditEventNameModal() {
  document.getElementById("editEventNameModal").classList.add("hidden");
  document.getElementById("eventName").value = "";
}

async function submitEventName() {
  const id = document.getElementById("eventId").value;
  const name = document.getElementById("eventName").value;


  const res = await fetch(`/api/event-management/edit-event-name/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({event_name: name }),
  });

  const data = await res.json();
  showToast(data.message);
  closeEditEventNameModal();
  fetchAndRenderEventManagement();
}

function openEventPaxModal(id) {
  document.getElementById("eventPaxId").value = id;
  document.getElementById("editEventPaxModal").classList.remove("hidden");
}

function closeEventPaxModal() {
  document.getElementById("editEventPaxModal").classList.add("hidden");
  document.getElementById("eventMaxPax").value = "";
}

async function submitEventPax() {
  const id = document.getElementById("eventPaxId").value;
  const amount = document.getElementById("eventMaxPax").value;

   console.log("Sending to server:", { id, amount });

  if (!amount || amount <= 0) {
    showToast("Enter valid pax amount", "error");
    return;
  }

  const res = await fetch(`/api/event-management/edit-pax/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({max_pax: amount }),
  });

   console.log("Raw response:", res);

  const text = await res.text();  
  console.log("Response text:", text); 

  const data = JSON.parse(text); 
  showToast(data.message);
  closeEventPaxModal();
  fetchAndRenderEventManagement();
}

async function removeEvent(id) {
  if (!confirm("Are you sure you want to remove this item?")) return;

  try {
    const res = await fetch(`/api/event-management/remove/${id}`, {
      method: "POST"
    });
    const data = await res.json();

    showToast(data.message);
    fetchAndRenderEventManagement();
  } catch (err) {
    showToast("Failed to remove item", "error");
  }
}

// Add Food Items

// Open modal and load kitchen inventory
async function openAddFoodModal() {
  const modal = document.getElementById("addFoodModal");
  modal.classList.remove("hidden");

  // Fetch kitchen inventory
  const res = await fetch('/api/kitchen-inventory-list');
  const ingredients = await res.json();

  const container = document.getElementById("ingredient-list");
  container.innerHTML = '';

  ingredients.forEach(item => {
    container.innerHTML += `
      <div class="flex items-center gap-2">
        <input type="checkbox" name="ingredients[]" value="${item.id}" id="ingredient-${item.id}" />
        <label for="ingredient-${item.id}" class="flex-1">${item.item_name} (${item.current_stock} ${item.unit})</label>
        <input type="number" name="quantities[${item.id}]" step="0.001" min="0" placeholder="Qty" class="w-20 px-2 border rounded"/>
      </div>
    `;
  });
}

// Close modal
function closeAddFoodModal() {
  const modal = document.getElementById("addFoodModal");
  modal.classList.add("hidden");
  document.getElementById("addFoodForm").reset();
}

// Submit new food item
document.getElementById("addFoodForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch(`/api/add-food-products`, {
      method: 'POST',
      body: formData,
    });

    const text = await res.text(); // read raw response first
    let data;
    try {
      data = JSON.parse(text); // try parsing JSON
    } catch {
      console.error("Non-JSON response:", text);
      throw new Error("Server returned an unexpected response. Check console.");
    }

    if (!res.ok) {
      // Validation or other errors
      if (data.errors) {
        // Show each validation error in toast
        for (const field in data.errors) {
          data.errors[field].forEach(msg => showToast(msg, "error"));
        }
      } else {
        showToast(data.message || "Failed to add food item", "error");
      }
      return;
    }

    showToast(data.message || "Food added successfully", "success");
    closeAddFoodModal();
    await fetchAndRenderFood(); // refresh the food list
  } catch (err) {
    showToast(err.message, "error");
  }
});


// Edit Food Ingredients

async function editFoodIngredients(foodId) {
  document.getElementById("editFoodId").value = foodId;

  const modal = document.getElementById("editIngredientsModal");
  modal.classList.remove("hidden");

  // Fetch product + kitchen list
  const res = await fetch(`/api/food-products/${foodId}/ingredients`);
  const data = await res.json();

  const productIngredients = data.product.ingredients_details;
  const kitchenList = data.kitchen;

  const container = document.getElementById("editIngredientList");
  container.innerHTML = "";

  kitchenList.forEach(item => {
    // find existing ingredient
    const existing = productIngredients.find(i => i.ingredient_id === item.id);
    const qty = existing ? existing.quantity_used : "";

    container.innerHTML += `
      <div class="flex items-center gap-2">
        <input type="checkbox" 
               class="ingredient-check"
               data-id="${item.id}"
               ${existing ? "checked" : ""}>

        <label class="flex-1">${item.item_name} (${item.current_stock} ${item.unit})</label>

        <input type="number"
               step="0.001"
               min="0"
               class="qty-input border rounded px-2 w-20"
               data-id="${item.id}"
               value="${qty}"
               ${existing ? "" : "disabled"}>
      </div>
    `;
  });

  // Enable/disable quantity on check
  document.querySelectorAll(".ingredient-check").forEach(chk => {
    chk.addEventListener("change", () => {
      const id = chk.getAttribute("data-id");
      const qtyInput = document.querySelector(`.qty-input[data-id="${id}"]`);

      qtyInput.disabled = !chk.checked;
      if (!chk.checked) qtyInput.value = "";
    });
  });
}

function closeEditIngredients() {
  document.getElementById("editIngredientsModal").classList.add("hidden");
}

document.getElementById("editIngredientsForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const foodId = document.getElementById("editFoodId").value;

  const selectedIngredients = [];
  const quantities = {};

  document.querySelectorAll(".ingredient-check").forEach(chk => {
    const id = chk.getAttribute("data-id");
    const qty = document.querySelector(`.qty-input[data-id="${id}"]`).value;

    if (chk.checked && qty > 0) {
      selectedIngredients.push(id);
      quantities[id] = qty;
    }
  });

  const res = await fetch(`/api/food-products/${foodId}/ingredients/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients: selectedIngredients,
      quantities: quantities
    })
  });

  const data = await res.json();

  if (data.success) {
    showToast("Ingredients updated!", "success");
    closeEditIngredients();
    fetchAndRenderFood(); // refresh list
  } else {
    showToast("Error saving ingredients", "error");
  }
});

//Delete Food Item
async function removeFoodItem(id) {
  if (!confirm("Are you sure you want to delete this food item?")) return;

  try {
    const res = await fetch(`/api/delete-food/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to delete food item.");
    }

    const data = await res.json(); // ONLY read once

    showToast(data.message || "Food item removed", "success");
    await fetchAndRenderFood();
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
}

// Add Room 

function openAddRoomModal() {
  document.getElementById("addRoomModal").classList.remove("hidden");
}

function closeAddRoomModal() {
  document.getElementById("addRoomModal").classList.add("hidden");
  document.getElementById("addRoomForm").reset();
}


document.getElementById("addRoomForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    const res = await fetch(`/api/rooms/add`, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    console.log("Raw response:", text);

    const data = JSON.parse(text);

    showToast(data.message, "success");
    closeAddRoomModal();
    fetchAndRenderRoom();
  } catch (err) {
    showToast("Failed to add room: " + err.message, "error");
  }
});

//Delete Room
async function removeRoom(id) {
  if (!confirm("Are you sure you want to delete this room?")) return;

  try {
    const res = await fetch(`api/rooms/delete-room/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to delete room.");
    }

    const data = await res.json(); // ONLY read once

    showToast(data.message || "Room removed", "success");
    await fetchAndRenderFood();
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
}

