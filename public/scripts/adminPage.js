document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");
  const content = document.getElementById("content");

  // Sections definition
  const sections = {
    food: { render: fetchAndRenderFood },
     farm: { render: fetchAndRenderFarm },
     foodOrders: { render: fetchAndRenderFoodOrders },
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


  // Food template & render function
  const foodCardTemplate = item => `
  <div class="p-4 transition bg-white shadow rounded-2xl hover:shadow-lg">
    <img src="${item.productPicture}" alt="${item.productName}" class="object-cover w-full h-48 mb-4 rounded-lg">
    <h3 class="text-lg font-bold text-gray-800">${item.productName}</h3>
    <p class="text-sm text-gray-600">Available Stock: <span class="font-semibold text-teal-700">${item.qty}</span></p>
    <div class="flex items-center mt-4 space-x-3">
      <input type="number" value="0" min="0" class="w-16 p-2 text-center border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none">
      <button class="flex-1 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500">Add Stock</button>
    </div>
  </div>
`;

const farmCardTemplate = item => `
  <div class="p-4 transition bg-white shadow rounded-2xl hover:shadow-lg">
    <img src="${item.productPicture}" alt="${item.productName}" class="object-cover w-full h-48 mb-4 rounded-lg">
    <h3 class="text-lg font-bold text-gray-800">${item.productName}</h3>
    <p class="text-sm text-gray-600">Available Stock: <span class="font-semibold text-teal-700">${item.qty}</span></p>
    <div class="flex items-center mt-4 space-x-3">
      <input type="number" value="0" min="0" class="w-16 p-2 text-center border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none">
      <button class="flex-1 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500">Add Stock</button>
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
  <div class="p-5 transition bg-white border border-gray-200 shadow-md cursor-pointer order-item rounded-2xl hover:shadow-lg hover:border-teal-500" data-id="${order.foodOrder_id}">
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
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  const containerId = 'food-container';
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
  const containerId = 'food-container'; // You can reuse the same container
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
  const containerId = 'foodOrders-container'; // Create this div in your HTML
  try {
    const res = await fetch('/api/foodOrders'); // Your API endpoint
    const data = await res.json();

    renderOrders(containerId, data, foodOrderTemplate);
  } catch (err) {
    console.error('Failed to load food orders:', err);
    document.getElementById(containerId).innerHTML = `<p class="text-red-500">Failed to load orders</p>`;
  }
}



});
