document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");
  const content = document.getElementById("content");

  // Sections definition
  const sections = {
    food: { render: fetchAndRenderFood },
     farm: { render: fetchAndRenderFarm },
     foodOrders: { render: fetchAndRenderFoodOrders },
     farmOrders: { render: fetchAndRenderFarmOrders },
     room: {render: fetchAndRenderRoomReservations},
    event: { 
      custom: `
       <h2 class="mb-4 text-xl font-bold text-teal-700">Event Reservation</h2>
        <div class="space-y-3 text-gray-700">
          <p><span class="font-semibold">Reservation ID:</span> <span id="reservationID"></span></p>
          <p><span class="font-semibold">Event Start Date:</span> <span id="eventStart"></span></p>
          <p><span class="font-semibold">Event End Date:</span> <span id="eventEnd"></span></p>
          <p><span class="font-semibold">Full Name:</span> <span id="fullName"></span></p>
          <p><span class="font-semibold">Event Type:</span> <span id="email"></span></p>
          <p><span class="font-semibold">E-mail: </span> <span id="phoneNumber"></span></p>
          <p><span class="font-semibold">Phone Number:</span> <span id="pax"></span></p>
          <p><span class="font-semibold">Number of Pax:</span> <span id="toBring"></span></p>
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

  // Sidebar button click logic
  sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Reset styles
    sidebarButtons.forEach(b => {
      b.classList.remove("bg-teal-600","text-white","hover:bg-teal-700","hover:border-teal-700");
      if (!b.classList.contains("text-red-700")) {
        b.classList.add("bg-gray-100","text-gray-700","hover:bg-gray-200","hover:border-gray-400");
      }
    });

    btn.classList.remove("bg-gray-100","text-gray-700","hover:bg-gray-200","hover:border-gray-400");
    btn.classList.add("bg-teal-600","text-white","hover:bg-teal-700","hover:border-teal-700");

    const section = sections[btn.dataset.section];
    if (section.render) section.render();
    else if (section.custom) content.innerHTML = section.custom;
    else content.innerHTML = `<h2 class="mb-4 text-xl font-bold text-teal-700">${section.title}</h2>
                             <p class="text-gray-700">${section.text}</p>`;
  });
});


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
    <img src="${item.productPicture}" alt="${item.productName}" 
      class="object-cover w-full h-48 mb-4 rounded-xl shadow-sm">

    <h3 class="text-lg font-semibold text-gray-800 mb-1">${item.productName}</h3>
    <p class="text-sm text-gray-600 mb-1">
      Price: <span class="font-semibold text-teal-700">₱${item.price}</span>
    </p>
    <p class="text-sm text-gray-600">
      Available Stock: <span class="font-semibold text-teal-700">${item.qty}</span>
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
  <div class="p-5 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500 w-full" data-id="${order.foodOrder_id}">
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
  </div>
  `;
};

// Farm order card template
const farmOrderCardTemplate = order => {
  // Collect ordered items dynamically
  const items = [];
  if (order.bangus_order > 0) items.push(`${order.bangus_order}x Bangus`);
  if (order.eggs_order > 0) items.push(`${order.eggs_order}x Eggs`);
  if (order.mudCrab_order > 0) items.push(`${order.mudCrab_order}x Mud Crab`);
  if (order.nativeChicken_order > 0) items.push(`${order.nativeChicken_order}x Native Chicken`);
  if (order.nativePork_order > 0) items.push(`${order.nativePork_order}x Native Pork`);
  if (order.squash_order > 0) items.push(`${order.squash_order}x Squash`);

  return `
    <div class="p-5 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500 w-full">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800">Order #${order.farmOrder_id}</h3>
        <span class="px-2 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full">${order.payment_status}</span>
      </div>
      <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
        ${items.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <p class="mt-2 text-sm text-gray-700 font-semibold">Total Bill: ₱${parseFloat(order.total_bill).toLocaleString()}</p>
      <p class="text-sm text-gray-700 font-semibold">Payment Method: ${order.payment_method}</p>
    </div>
  `;
};

// Room Reservation template
const roomReservationTemplate = reservation => `
<div class="space-y-3 text-gray-700 p-6 bg-white shadow-md rounded-2xl">
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
`;


  // Reusable render function

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
}



// Fetch and render

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

async function fetchAndRenderFoodOrders() {
  const containerId = 'content'; // Create this div in your HTML
  try {
    const res = await fetch('/api/foodOrder'); // Your API endpoint
    const data = await res.json();

    renderOrders(containerId, data, foodOrderTemplate);
  } catch (err) {
    console.error('Failed to load food orders:', err);
    document.getElementById(containerId).innerHTML = `<p class="text-red-500">Failed to load orders</p>`;
  }
}

async function fetchAndRenderFarmOrders() {
  const container = document.getElementById('content'); // render in main content
  container.innerHTML = `<p class="text-gray-500">Loading farm orders...</p>`;

  try {
    const res = await fetch('/api/farmOrder'); // endpoint for farm orders
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = `<p class="text-gray-500">No farm orders found.</p>`;
      return;
    }

    container.innerHTML = `
      <h2 class="mb-6 text-2xl font-bold text-teal-700">Farm Orders</h2>
      <div class="space-y-4">
        ${data.map(farmOrderCardTemplate).join('')}
      </div>
    `;
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
});

// CURD for Farm Products

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
  if (!newName) return alert("Please enter a name");

  const response = await fetch(`/api/farm/edit-name/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName: newName }),
  });

  const result = await response.json();
  alert(result.message);
  closeAllInputBoxes();
  location.reload();
}

// ✅ Edit Product Price
function editFarmPrice(id) {
  closeAllInputBoxes();

  const button = event.target.closest("button");
  const parent = button.parentElement;

  const container = document.createElement("div");
  container.className = "inline-editor col-span-2 mt-2 flex items-center gap-2";

  container.innerHTML = `
    <input type="text" id="editPriceInput${id}" 
           class="border border-gray-300 rounded-lg px-3 py-1 w-full text-sm focus:ring-2 focus:ring-cyan-500"
           placeholder="Enter new price">
    <button class="bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-700 transition"
            onclick="saveFarmPrice(${id})">Save</button>
    <button class="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
            onclick="closeAllInputBoxes()">Cancel</button>
  `;

  parent.insertAdjacentElement("afterend", container);
}

async function saveFarmPrice(id) {
  const input = document.getElementById(`editPriceInput${id}`);
  const newPrice = input.value.trim();
  if (!newPrice || isNaN(newPrice)) return alert("Please enter a valid price");

  const response = await fetch(`/api/farm/edit-price/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: newPrice }),
  });

  const result = await response.json();
  alert(result.message);
  closeAllInputBoxes();
  location.reload();
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
  if (!qty || isNaN(qty) || qty <= 0) return alert("Please enter a valid quantity");

  const response = await fetch(`/api/farm/add-stock/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty: parseInt(qty) }),
  });

  const result = await response.json();
  alert(result.message);
  closeAllInputBoxes();
  location.reload();
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
    alert(result.message);
    location.reload();
  };

  fileInput.click();
}