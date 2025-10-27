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
    <img src="${item.productPicture}" alt="${item.productName}" 
      class="object-cover w-full h-48 mb-4 rounded-xl shadow-sm">

    <h3 class="text-lg font-semibold text-gray-800 mb-1">${item.productName}</h3>
    <p class="text-sm text-gray-600 mb-4">
      Price: <span class="font-semibold text-teal-700">₱${item.price}</span>
    </p>

    <!-- Modern Button Group -->
    <div class="flex flex-col gap-3">
      <!-- Edit Name -->
      <button
        onclick="editName(${item.id})"
        class="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-sm hover:from-teal-600 hover:to-teal-700 hover:shadow-md transition-all duration-300 active:scale-[0.97]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:-rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2M12 5v14m7 0H5"/>
        </svg>
        <span>Edit Name</span>
      </button>

      <!-- Edit Price -->
      <button
        onclick="editPrice(${item.id})"
        class="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-50 to-teal-50 text-teal-700 border border-teal-100 rounded-xl hover:from-cyan-100 hover:to-teal-100 hover:border-teal-200 hover:shadow-sm transition-all duration-300 active:scale-[0.97]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3v1h6v-1c0-1.657-1.343-3-3-3z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14v6H5z"/>
        </svg>
        <span>Edit Price</span>
      </button>

      <!-- Replace Photo -->
      <button
        onclick="replacePhoto(${item.id})"
        class="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-xl shadow-sm hover:from-amber-500 hover:to-yellow-600 hover:shadow-md transition-all duration-300 active:scale-[0.97]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4H4zm8 12l-4-4m4 4l4-4m-4 4V8" />
        </svg>
        <span>Replace Photo</span>
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
    <p class="text-sm text-gray-600">
      Available Stock: <span id="farm-stock-${item.id}" class="font-semibold text-teal-700">${item.qty}</span>
    </p>

    <!-- Button Grid -->
    <div class="grid grid-cols-2 gap-3 mt-5">
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

      <!-- Add Stock -->
      <button
        onclick="addFarmStock(${item.id})"
        class="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-sm hover:from-emerald-600 hover:to-green-700 transition-all duration-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span>Add Stock</span>
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
  <div class="mb-6"> <!-- Adds space between cards -->
    <div class="space-y-3 text-gray-700 p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      <h2 class="mb-4 text-xl font-bold text-teal-700">Room Reservation</h2>
      <p><span class="font-semibold">Reservation ID:</span> ${reservation.room_reser_id}</p>
      <p><span class="font-semibold">Room Type:</span> ${reservation.room}</p>
      <p><span class="font-semibold">Check in Date:</span> ${reservation.check_in_date}</p>
      <p><span class="font-semibold">Check out Date:</span> ${reservation.check_out_date}</p>
      <p><span class="font-semibold">Full Name:</span> ${reservation.full_name}</p>
      <p><span class="font-semibold">E-mail:</span> ${reservation.email}</p>
      <p><span class="font-semibold">Phone Number:</span> ${reservation.phone_number}</p>
      <p><span class="font-semibold">Number of Pax:</span> ${reservation.pax}</p>
      <p><span class="font-semibold">Payment Status:</span> ${reservation.payment_status}</p>

      <div class="flex justify-end gap-4 mt-6">
        <button class="px-5 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">Checked-in</button>
        <button class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Checked-out</button>
        <button class="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">Cancelled</button>
      </div>
    </div>
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
  container.className = "inline-editor col-span-2 mt-2 flex items-center gap-2";

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
  container.className = "inline-editor col-span-2 mt-2 flex flex-col gap-2";

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
  container.className = "inline-editor col-span-2 mt-2 flex items-center gap-2";

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


// ================= Fetch & Render Functions =================
 async function fetchAndRenderFood() {
  const containerId = 'content';
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show loading
  container.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch('/api/foodProducts'); // Must return array of categories
    const data = await res.json();

    // Ensure the API returns: [{ category: 'Granny\'s Grub Originals', items: [...] }, ...]
    const dataSections = Array.isArray(data[0]?.items) ? data : [{ category: "Food Inventory", items: data }];

    renderItems(containerId, dataSections, foodCardTemplate);
  } catch (err) {
    console.error('Failed to load food inventory:', err);
    container.innerHTML = `<p class="text-red-500">Failed to load data</p>`;
  }
}

async function fetchAndRenderFarm() {
  const containerId = 'content'; // You can reuse the same container
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch('/api/farmProducts'); // your API endpoint
    const data = await res.json();

    const dataSections = Array.isArray(data[0]?.items) ? data : [{ category: "Farm Inventory", items: data }];

    renderItems(containerId, dataSections, farmCardTemplate);
  } catch (err) {
    console.error('Failed to load farm inventory:', err);
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


async function fetchAndRenderRoomReservations() {
  const containerId = 'content'; // Main content container
  const container = document.getElementById(containerId);
  container.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const res = await fetch('/api/roomReser'); // Your API endpoint
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p class="text-gray-500">No room reservations found.</p>`;
      return;
    }

    // Render each reservation
    container.innerHTML = data.map(roomReservationTemplate).join('');

    // Attach approve/disapprove events
    container.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRoomApproval(btn.dataset.id, 'Approved'));
    });
    container.querySelectorAll('.disapprove-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRoomApproval(btn.dataset.id, 'Disapproved'));
    });

  } catch (err) {
    console.error('Failed to load room reservations:', err);
    container.innerHTML = `<p class="text-red-500">Failed to load room reservations.</p>`;
  }
}




// Side Buttons Logic
document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");
  const content = document.getElementById("content");

  // =================== Section Mapping ===================
  const sections = {
    food: { render: fetchAndRenderFood },
    farm: { render: fetchAndRenderFarm },
    foodOrders: { render: fetchAndRenderFoodOrders },
    farmOrders: { render: fetchAndRenderFarmOrders },
    room: { render: fetchAndRenderRoomReservations },
    event: {
      custom: `
        <h2 class="mb-4 text-xl font-bold text-teal-700">Event Reservation</h2>
        <div class="space-y-3 text-gray-700">
          <p><span class="font-semibold">Reservation ID:</span> <span id="reservationID"></span></p>
          <p><span class="font-semibold">Event Start Date:</span> <span id="eventStart"></span></p>
          <p><span class="font-semibold">Event End Date:</span> <span id="eventEnd"></span></p>
          <p><span class="font-semibold">Full Name:</span> <span id="fullName"></span></p>
          <p><span class="font-semibold">Event Type:</span> <span id="eventType"></span></p>
          <p><span class="font-semibold">E-mail:</span> <span id="email"></span></p>
          <p><span class="font-semibold">Phone Number:</span> <span id="phoneNumber"></span></p>
          <p><span class="font-semibold">Number of Pax:</span> <span id="pax"></span></p>
          <p><span class="font-semibold">Things to be brought:</span> <span id="toBring"></span></p>
          <p><span class="font-semibold">Approval Status:</span> <span id="approvalStat"></span></p>
        </div>
        <div class="flex justify-end gap-4 mt-20">
          <button class="px-5 py-2 text-gray-700 bg-gray-300 rounded-lg disapprove-btn hover:bg-gray-400">Disapprove</button>
          <button class="px-5 py-2 text-white bg-teal-600 rounded-lg approve-btn hover:bg-teal-700">Approve</button>
        </div>
      `
    },
    cancel: {
      title: "Cancellation",
      text: "This is the Cancellation section. Manage cancellations and refund requests here."
    }
  };

  // =================== Sidebar Button Logic ===================
  sidebarButtons.forEach(btn => {
    btn.addEventListener("click", () => {
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

      const section = sections[btn.dataset.section];
      if (section.render) section.render();
      else if (section.custom) content.innerHTML = section.custom;
      else
        content.innerHTML = `
          <h2 class="mb-4 text-xl font-bold text-teal-700">${section.title}</h2>
          <p class="text-gray-700">${section.text}</p>
        `;
    });
  });

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
});


  
// ================= Modals =================

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