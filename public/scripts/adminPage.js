function formatDateTime(dateString) {
  if (!dateString) return '<span class="text-gray-400 italic">Not Scheduled</span>';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// 🔔 Global Toast Function
function showToast(message, type = "success") {
  // Remove old toast if it exists
  const old = document.getElementById("globalToast");
  if (old) old.remove();

  const bg =
    type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-green-600";

  const toast = document.createElement("div");
  toast.id = "globalToast";
  toast.className = `
    fixed top-5 right-5 z-[9999]
    text-white px-4 py-3 rounded-lg shadow-lg
    ${bg} animate-slide-in
  `;
  toast.textContent = message;

  toast.style.transition = "opacity 0.5s ease";

  document.body.appendChild(toast);

  // Auto-remove after 2.5 sec
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

// Animation style (added once)
if (!document.getElementById("toast-animation-style")) {
  const style = document.createElement("style");
  style.id = "toast-animation-style";
  style.textContent = `
    @keyframes slide-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-in {
      animation: slide-in 0.25s ease-out;
    }
  `;
  document.head.appendChild(style);
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

const googleUserTableTemplate = data => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">PWD/ Senior Citizen Approval</h2>

  <!-- FILTERS -->
  <div class="flex gap-4 mb-4">
    <select id="filterStatus" onchange="applyGoogleUserFilter()"
      class="px-3 py-2 border rounded-lg">
      <option value="">All Statuses</option>
      <option value="Pending Validation">Pending Validation</option>
      <option value="Validated">Validated</option>
      <option value="Rejected">Rejected</option>
    </select>
  </div>

  <!-- SEARCH -->
  <div class="mb-4">
    <input id="googleUserSearch"
           type="text"
           placeholder="Search users..."
           class="w-full px-3 py-2 border rounded-lg"
           oninput="filterGoogleUsers()">
  </div>

  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Name</th>
        <th class="px-4 py-2">Email</th>
        <th class="px-4 py-2">Photo</th>
        <th class="px-4 py-2">Status</th>
      </tr>
    </thead>
    <tbody id="googleUserTableBody">
      ${data.map(user => `
      <tr class="border-t hover:bg-gray-50 cursor-pointer relative"
          onclick="openUserModal(${user.user_id})">

        <!-- ACTION -->
        <td class="px-4 py-2 relative" onclick="event.stopPropagation()">
          <button onclick="toggleActionMenu(event, ${user.user_id})"
                  class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">⚙️</button>

          <div id="actionMenu-${user.user_id}" class="absolute left-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
            <button onclick="updateIdStatus(${user.user_id}, 'Validated')" class="block w-full text-left px-3 py-1 hover:bg-green-100">Validate</button>
            <button onclick="updateIdStatus(${user.user_id}, 'Rejected')" class="block w-full text-left px-3 py-1 hover:bg-red-100">Reject</button>
          </div>
        </td>

        <td class="px-4 py-2">${user.name}</td>
        <td class="px-4 py-2">${user.email}</td>
        <td class="px-4 py-2">
          ${user.id_photo 
            ? `<img src="${user.id_photo}" alt="ID Photo" class="w-16 h-16 object-cover rounded" />`
            : `<span class="text-gray-400">No Photo</span>`}
        </td>
        <td class="px-4 py-2">${user.id_status}</td>
      </tr>
      `).join("")}
    </tbody>
  </table>
</div>

<!-- ID Discount MODAL -->
<div id="userModal" class="fixed inset-0 bg-black bg-opacity-40 hidden flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-xl w-96 shadow-xl">
    <h3 class="text-xl font-bold text-teal-700 mb-3">User Details</h3>

    <p><strong>Name:</strong> <span id="modalUserName"></span></p>
    <p><strong>Email:</strong> <span id="modalUserEmail"></span></p>
    <p><strong>Status:</strong> <span id="modalUserStatus"></span></p>
    <p class="mt-2"><strong>ID Photo:</strong></p>
    <img id="modalUserPhoto" class="w-full h-auto object-cover rounded mt-1" />

    <div class="mt-4 text-right">
      <button onclick="closeUserModal()" 
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
    </div>
  </div>
</div>
`;

// ================ GLOBAL SEARCH FUNCTION FOR GOOGLE USERS =================
function filterGoogleUsers() {
  const query = document.getElementById('googleUserSearch').value.toLowerCase();
  const tableBody = document.getElementById('googleUserTableBody');

  tableBody.querySelectorAll('tr').forEach(row => {
    const name = row.children[1].textContent.toLowerCase();
    const email = row.children[2].textContent.toLowerCase();
    const status = row.children[4].textContent.toLowerCase();

    row.style.display = name.includes(query) || email.includes(query) || status.includes(query) ? '' : 'none';
  });
}


// Reviews customer
const reviewManagementTemplate = data => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">User Reviews</h2>

  <!-- FILTERS -->
  <div class="flex gap-4 mb-4">
    <select id="filterType" onchange="applyReviewFilters()" class="px-3 py-2 border rounded-lg">
      <option value="">All Types</option>
      <option value="food">Food</option>
      <option value="farm">Farm</option>
      <option value="room">Room</option>
      <option value="event">Event</option>
    </select>

    <select id="filterStatus" onchange="applyReviewFilters()" class="px-3 py-2 border rounded-lg">
      <option value="">All Status</option>
      <option value="Not Reviewed">Not Reviewed</option>
      <option value="Reviewed">Reviewed</option>
    </select>
  </div>

  <!-- SEARCH -->
  <div class="mb-4">
    <input id="reviewSearch"
           type="text"
           placeholder="Search reviews..."
           class="w-full px-3 py-2 border rounded-lg"
           oninput="filterReviews()">
  </div>

  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">User</th>
        <th class="px-4 py-2">Order/Reservation ID</th>
        <th class="px-4 py-2">Current Stars</th>
        <th class="px-4 py-2">Comment</th>
        <th class="px-4 py-2">Review Status</th>
        <th class="px-4 py-2">Review Date</th>
      </tr>
    </thead>
    <tbody id="reviewTableBody">
      ${data.map(item => {
        const orderId = item.food_order_id || item.farm_order_id || item.room_reservation_id || item.event_reservation_id || 'N/A';
        const actionBtn = item.review_status === 'Reviewed'
          ? `<button onclick="deleteReview(${item.id})" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>`
          : `<button onclick="markReviewed(${item.id})" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Reviewed</button>`;

        return `
        <tr class="border-t hover:bg-gray-50 cursor-pointer review-row" data-id="${item.id}">
          <td class="px-4 py-2" onclick="event.stopPropagation()">${actionBtn}</td>
          <td class="px-4 py-2">${item.user.name}</td>
          <td class="px-4 py-2">${orderId}</td>
          <td class="px-4 py-2">${item.stars} ★</td>
          <td class="px-4 py-2">${item.comment ?? ''}</td>
          <td class="px-4 py-2">${item.review_status}</td>
          <td class="px-4 py-2">${new Date(item.created_at).toLocaleString()}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
</div>

<!-- MODAL -->
<div id="reviewModal" class="flex inset-0 hidden items-center justify-center z-50">
  <div class="bg-white p-6 rounded-xl w-96 shadow-xl">
    <h3 class="text-xl font-bold text-teal-700 mb-3">Full Review</h3>
    <p><strong>User:</strong> <span id="modalUser"></span></p>
    <p><strong>Order ID:</strong> <span id="modalOrderId"></span></p>
    <p><strong>Stars:</strong> <span id="modalStars"></span></p>
    <p><strong>Status:</strong> <span id="modalStatus"></span></p>
    <p class="mt-2"><strong>Comment:</strong></p>
    <p id="modalComment" class="bg-gray-100 p-2 rounded mt-1"></p>
    <div class="mt-4 text-right">
      <button onclick="closeReviewModal()" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
    </div>
  </div>
</div>
`;

// ================ GLOBAL SEARCH FUNCTION =================
function filterReviews() {
  const query = document.getElementById('reviewSearch').value.toLowerCase();
  const tableBody = document.getElementById('reviewTableBody');

  tableBody.querySelectorAll('tr').forEach(row => {
    const user = row.children[1].textContent.toLowerCase();
    const orderId = row.children[2].textContent.toLowerCase();
    const stars = row.children[3].textContent.toLowerCase();
    const comment = row.children[4].textContent.toLowerCase();
    const status = row.children[5].textContent.toLowerCase();
    const reviewDate = row.children[6].textContent.toLowerCase();

    row.style.display =
      user.includes(query) || orderId.includes(query) || stars.includes(query) ||
      comment.includes(query) || status.includes(query) || reviewDate.includes(query)
        ? ''
        : 'none';
  });
}


// FoodOrders Template
const foodOrdersTableTemplate = (data, selectedOrderStatus = '', selectedPaymentStatus = '') => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">Food Orders</h2>

  <div class="flex gap-4 mb-4">
    <select id="filterOrderStatus" onchange="applyFoodOrderFilter()"
      class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedOrderStatus === '' ? 'selected' : ''}>All Order Status</option>
      <option value="Pending" ${selectedOrderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
      <option value="Completed" ${selectedOrderStatus === 'Completed' ? 'selected' : ''}>Completed</option>
      <option value="Cancelled" ${selectedOrderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
    </select>

    <select id="filterPaymentStatus" onchange="applyFoodOrderFilter()"
      class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedPaymentStatus === '' ? 'selected' : ''}>All Payment Status</option>
      <option value="Paid" ${selectedPaymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
      <option value="Unpaid" ${selectedPaymentStatus === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
    </select>
  </div>

  <div class="mb-4">
    <input id="foodOrdersSearch" 
           type="text" 
           placeholder="Search orders..." 
           class="w-full px-3 py-2 border rounded-lg"
           oninput="filterFoodOrders()">
  </div>

  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Order ID</th>
        <th class="px-4 py-2">Type</th> <th class="px-4 py-2">Scheduled</th> <th class="px-4 py-2">Items</th>
        <th class="px-4 py-2">Total Bill</th>
        <th class="px-4 py-2">Payment Status</th>
        <th class="px-4 py-2">Order Status</th>
      </tr>
    </thead>

    <tbody id="foodOrdersTableBody">
      ${data.map(order => {
        const items = [
          { key: 'smokedFish_order', name: 'Smoked Fish' },
          { key: 'deviledFish_order', name: 'Deviled Fish' },
          { key: 'seaSig_order', name: 'SeaSig' },
          { key: 'blueCraze_order', name: 'Blue Craze' },
          { key: 'chickenSheet_order', name: 'Chicken Sheet' },
          { key: 'blackMeal_order', name: 'Black Meal' }
        ]
        .filter(i => order[i.key] && order[i.key] > 0)
        .map(i => `${order[i.key]}x ${i.name}`)
        .join(', ');

        return `
        <tr class="border-t hover:bg-gray-50 relative cursor-pointer" onclick="openFoodOrderModal('${order.foodOrder_id}')">
          <td class="px-4 py-2 relative" onclick="event.stopPropagation()">
            <button onclick="toggleOrderActionMenu(event, '${order.foodOrder_id}')"
                    class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">⚙️</button>

            <div id="orderActionMenu-${order.foodOrder_id}" 
                 class="absolute left-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
              ${
                order.order_status === 'Pending' 
                ? `
                  <button onclick="updateOrderStatus('${order.foodOrder_id}','Completed')" 
                    class="block w-full text-left px-3 py-1 hover:bg-green-100">Complete</button>
                  <button onclick="updateOrderStatus('${order.foodOrder_id}','Cancelled')" 
                    class="block w-full text-left px-3 py-1 hover:bg-red-100">Cancel</button>
                  `
                : `
                  <button onclick="deleteFoodOrder('${order.foodOrder_id}')" 
                    class="block w-full text-left px-3 py-1 hover:bg-gray-100">Remove</button>
                  `
              }
            </div>
          </td>

          <td class="px-4 py-2 font-mono text-xs">${order.foodOrder_id}</td>

          <td class="px-4 py-2">
            <span class="px-2 py-1 text-xs font-bold rounded uppercase ${
              order.order_type === 'pickup' 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-blue-100 text-blue-800'
            }">
              ${order.order_type || 'Dine-in'}
            </span>
          </td>

          <td class="px-4 py-2 font-medium text-teal-800">
            ${window.formatDateTime ? window.formatDateTime(order.scheduled_datetime) : order.scheduled_datetime}
          </td>

          <td class="px-4 py-2 text-gray-600">${items || '-'}</td>
          <td class="px-4 py-2 font-bold">₱${parseFloat(order.total_bill).toLocaleString()}</td>
          <td class="px-4 py-2">
            <span class="px-2 py-1 text-xs font-semibold ${order.payment_status === 'Paid' ? 'text-green-700 bg-green-100' : 'text-teal-700 bg-teal-100'} rounded-full">
              ${order.payment_status}
            </span>
          </td>
          <td class="px-4 py-2">${order.order_status}</td>
        </tr>
        `;
      }).join('')}
    </tbody>
  </table>
</div>

<div id="foodOrderModal" class="fixed inset-0 bg-black bg-opacity-40 hidden z-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-xl w-96 shadow-xl relative">
    <h3 class="text-xl font-bold text-teal-700 mb-3">Order Details</h3>
    
    <div class="space-y-2 text-sm text-gray-700">
        <p><strong>Order ID:</strong> <span id="foodModalOrderID"></span></p>
        
        <p><strong>Type:</strong> <span id="foodModalOrderType" class="uppercase font-bold"></span></p>
        <p><strong>Schedule:</strong> <span id="foodModalOrderTime" class="text-teal-700 font-bold"></span></p>

        <p><strong>Items:</strong> <span id="modalOrderItems"></span></p>
        <p><strong>Total Bill:</strong> ₱<span id="modalOrderTotal"></span></p>
        <p><strong>Payment Status:</strong> <span id="modalOrderPayment"></span></p>
        <p><strong>Order Status:</strong> <span id="modalOrderStatus"></span></p>

        <div id="foodModalNotesSection" class="hidden mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-gray-700 italic">
           <strong>Note:</strong> <span id="foodModalNotes"></span>
        </div>
    </div>

    <div class="mt-6 text-right">
      <button onclick="closeFoodOrderModal()" 
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Close</button>
    </div>
  </div>
</div>
`;
// ================== GLOBAL FUNCTION ==================
function filterFoodOrders() {
  const query = document.getElementById('foodOrdersSearch').value.toLowerCase();
  const tableBody = document.getElementById('foodOrdersTableBody');
  
  tableBody.querySelectorAll('tr').forEach(row => {
    const orderID = row.children[1].textContent.toLowerCase();
    const items = row.children[2].textContent.toLowerCase();
    const paymentStatus = row.children[4].textContent.toLowerCase();
    const orderStatus = row.children[5].textContent.toLowerCase();
    
    row.style.display = 
      orderID.includes(query) || items.includes(query) || paymentStatus.includes(query) || orderStatus.includes(query)
      ? ''
      : 'none';
  });
}




// Farm order table template
const farmOrderTableTemplate = (data, selectedOrderStatus = '', selectedPaymentStatus = '') => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">Farm Orders</h2>

  <div class="flex gap-4 mb-4">
    <select id="filterFarmOrderStatus" onchange="applyFarmOrderFilter()" class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedOrderStatus === '' ? 'selected' : ''}>All Order Status</option>
      <option value="Pending" ${selectedOrderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
      <option value="Completed" ${selectedOrderStatus === 'Completed' ? 'selected' : ''}>Completed</option>
      <option value="Cancelled" ${selectedOrderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
    </select>

    <select id="filterFarmPaymentStatus" onchange="applyFarmOrderFilter()" class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedPaymentStatus === '' ? 'selected' : ''}>All Payment Status</option>
      <option value="Paid" ${selectedPaymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
      <option value="Unpaid" ${selectedPaymentStatus === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
    </select>
  </div>

  <div class="mb-4">
    <input id="farmOrdersSearch" 
           type="text" 
           placeholder="Search farm orders..." 
           class="w-full px-3 py-2 border rounded-lg"
           oninput="filterFarmOrders()">
  </div>

  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Order ID</th>
        <th class="px-4 py-2">Scheduled Pickup</th> <th class="px-4 py-2">Items</th>
        <th class="px-4 py-2">Total Bill</th>
        <th class="px-4 py-2">Payment Status</th>
        <th class="px-4 py-2">Order Status</th>
      </tr>
    </thead>

    <tbody id="farmOrdersTableBody">
      ${data
        .map((order) => {
          const items = [
            { key: "bangus_order", name: "Bangus" },
            { key: "eggs_order", name: "Eggs" },
            { key: "mudCrab_order", name: "Mud Crab" },
            { key: "nativeChicken_order", name: "Native Chicken" },
            { key: "nativePork_order", name: "Native Pork" },
            { key: "squash_order", name: "Squash" },
          ]
            .filter((i) => order[i.key] && order[i.key] > 0)
            .map((i) => `${order[i.key]}x ${i.name}`)
            .join(", ");

          return `
        <tr class="border-t hover:bg-gray-50 relative cursor-pointer"
            onclick="openFarmOrderModal('${order.farmOrder_id}')">

          <td class="px-4 py-2 relative" onclick="event.stopPropagation()">
            <button onclick="toggleFarmOrderActionMenu(event, '${order.farmOrder_id}')"
                    class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">⚙️</button>

            <div id="farmOrderActionMenu-${order.farmOrder_id}"
                 class="absolute left-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
              ${
                order.order_status === "Pending"
                  ? `
                <button onclick="updateFarmOrderStatus('${order.farmOrder_id}','Completed')"
                        class="block w-full text-left px-3 py-1 hover:bg-green-100">Complete</button>

                <button onclick="updateFarmOrderStatus('${order.farmOrder_id}','Cancelled')"
                        class="block w-full text-left px-3 py-1 hover:bg-red-100">Cancel</button>
                `
                  : `
                <button onclick="deleteFarmOrder('${order.farmOrder_id}')"
                        class="block w-full text-left px-3 py-1 hover:bg-gray-100">Remove</button>
                `
              }
            </div>
          </td>

          <td class="px-4 py-2 font-mono text-xs">${order.farmOrder_id}</td>
          
          <td class="px-4 py-2 font-medium text-teal-800">
            ${formatDateTime(order.scheduled_datetime)}
          </td>

          <td class="px-4 py-2 text-gray-600">${items || "-"}</td>
          <td class="px-4 py-2 font-bold">₱${parseFloat(order.total_bill).toLocaleString()}</td>
          <td class="px-4 py-2">
            <span class="px-2 py-1 text-xs font-semibold ${
              order.payment_status === "Paid"
                ? "text-green-700 bg-green-100"
                : "text-teal-700 bg-teal-100"
            } rounded-full">
              ${order.payment_status}
            </span>
          </td>

          <td class="px-4 py-2">${order.order_status}</td>
        </tr>`;
        })
        .join("")}
    </tbody>
  </table>
</div>

<div id="farmOrderModal" class="fixed inset-0 bg-black bg-opacity-40 hidden z-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-xl w-96 shadow-xl relative">
    <h3 class="text-xl font-bold text-teal-700 mb-3">Order Details</h3>
    
    <div class="space-y-2 text-sm text-gray-700">
        <p><strong>Order ID:</strong> <span id="farmModalOrderID"></span></p>
        
        <p><strong>Scheduled Pickup:</strong> <span id="farmModalOrderTime" class="font-bold text-teal-700"></span></p>
        
        <p><strong>Items:</strong> <span id="farmModalOrderItems"></span></p>
        <p><strong>Total Bill:</strong> ₱<span id="farmModalOrderTotal"></span></p>
        <p><strong>Payment Status:</strong> <span id="farmModalOrderPayment"></span></p>
        <p><strong>Order Status:</strong> <span id="farmModalOrderStatus"></span></p>
    </div>

    <div class="mt-6 text-right">
      <button onclick="closeFarmOrderModal()" 
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Close</button>
    </div>
  </div>
</div>
`;

// ================== GLOBAL FUNCTION ==================
function filterFarmOrders() {
  const query = document.getElementById('farmOrdersSearch').value.toLowerCase();
  const tableBody = document.getElementById('farmOrdersTableBody');

  tableBody.querySelectorAll('tr').forEach(row => {
    const orderID = row.children[1].textContent.toLowerCase();
    const items = row.children[2].textContent.toLowerCase();
    const paymentStatus = row.children[4].textContent.toLowerCase();
    const orderStatus = row.children[5].textContent.toLowerCase();

    row.style.display =
      orderID.includes(query) || items.includes(query) || paymentStatus.includes(query) || orderStatus.includes(query)
        ? ''
        : 'none';
  });
}

// Room Reservation template
const roomReservationTableTemplate = (data, selectedStatus = '', selectedPayment = '') => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">Room Reservations</h2>

  <!-- FILTERS -->
  <div class="flex gap-4 mb-4">
    <select id="filterRoomStatus" onchange="applyRoomReservationFilter()" class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedStatus === '' ? 'selected' : ''}>All Reservation Status</option>
      <option value="Pending" ${selectedStatus === 'Pending' ? 'selected' : ''}>Pending</option>
      <option value="Checked-in" ${selectedStatus === 'Checked-in' ? 'selected' : ''}>Checked-in</option>
      <option value="Checked-out" ${selectedStatus === 'Checked-out' ? 'selected' : ''}>Checked-out</option>
      <option value="Cancelled" ${selectedStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
    </select>

    <select id="filterRoomPayment" onchange="applyRoomReservationFilter()" class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedPayment === '' ? 'selected' : ''}>All Payment Status</option>
      <option value="Paid" ${selectedPayment === 'Paid' ? 'selected' : ''}>Paid</option>
      <option value="Unpaid" ${selectedPayment === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
      <option value="Failed" ${selectedPayment === 'Failed' ? 'selected' : ''}>Failed</option>
      <option value="Refunded" ${selectedPayment === 'Refunded' ? 'selected' : ''}>Refunded</option>
    </select>
  </div>

  <!-- SEARCH -->
  <div class="mb-4">
    <input id="roomReservationSearch" 
           type="text" 
           placeholder="Search reservations..." 
           class="w-full px-3 py-2 border rounded-lg"
           oninput="filterRoomReservations()">
  </div>

  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Reservation ID</th>
        <th class="px-4 py-2">Guest</th>
        <th class="px-4 py-2">Room</th>
        <th class="px-4 py-2">Payment</th>
        <th class="px-4 py-2">Status</th>
        <th class="px-4 py-2">Check-in</th>
      </tr>
    </thead>

    <tbody id="roomReservationTableBody">
      ${data.map(res => `
        <tr class="border-t hover:bg-gray-50 cursor-pointer" onclick="openRoomModal('${res.room_reser_id}')">

          <!-- ACTION MENU -->
          <td class="px-4 py-2 relative" onclick="event.stopPropagation()">
            <button onclick="toggleRoomReservationActionMenu(event, '${res.room_reser_id}')"
                    class="p-2 bg-gray-200 rounded hover:bg-gray-300">⚙️</button>

            <div id="roomReservationActionMenu-${res.room_reser_id}"
                 class="absolute left-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">

              ${
                res.status === "Pending"
                  ? `
                    <button onclick="updateRoomStatus('${res.room_reser_id}','Checked-in')"
                            class="block w-full text-left px-3 py-1 hover:bg-green-100">Check-in</button>
                    <button onclick="updateRoomStatus('${res.room_reser_id}','Cancelled')"
                            class="block w-full text-left px-3 py-1 hover:bg-red-100">Cancel</button>
                  `
                  : res.status === "Checked-in"
                  ? `
                    <button onclick="updateRoomStatus('${res.room_reser_id}','Checked-out')"
                            class="block w-full text-left px-3 py-1 hover:bg-blue-100">Check-out</button>
                  `
                  : ``
              }
            </div>
          </td>

          <td class="px-4 py-2">#${res.room_reser_id}</td>
          <td class="px-4 py-2">${res.full_name}</td>
          <td class="px-4 py-2">${res.room}</td>

          <td class="px-4 py-2">
            <span class="px-2 py-1 text-xs font-semibold rounded-full
              ${res.payment_status === 'Paid' ? 'text-green-700 bg-green-100' :
                res.payment_status === 'Refunded' ? 'text-blue-700 bg-blue-100' :
                res.payment_status === 'Failed' ? 'text-red-700 bg-red-100' :
                'text-teal-700 bg-teal-100'}">
              ${res.payment_status}
            </span>
          </td>

          <td class="px-4 py-2">${res.status}</td>
          <td class="px-4 py-2">${res.check_in_date}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</div>

<!-- MODAL -->
<div id="roomReservationModal" class="fixed inset-0 bg-black bg-opacity-40 hidden items-center justify-center z-50">
  <div class="bg-white p-6 rounded-xl w-96 shadow-xl">
    <h3 id="roomModalTitle" class="text-xl font-bold text-teal-700 mb-3"></h3>
    <p id="roomModalRef"></p>
    <ul id="roomModalItems" class="mt-3 text-sm text-gray-700 list-disc list-inside"></ul>

    <div class="mt-4 text-right">
      <button onclick="closeRoomModal()" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
    </div>
  </div>
</div>
`;

// ================ GLOBAL SEARCH FUNCTION =================
function filterRoomReservations() {
  const query = document.getElementById('roomReservationSearch').value.toLowerCase();
  const tableBody = document.getElementById('roomReservationTableBody');

  tableBody.querySelectorAll('tr').forEach(row => {
    const resID = row.children[1].textContent.toLowerCase();
    const guest = row.children[2].textContent.toLowerCase();
    const room = row.children[3].textContent.toLowerCase();
    const payment = row.children[4].textContent.toLowerCase();
    const status = row.children[5].textContent.toLowerCase();
    const checkin = row.children[6].textContent.toLowerCase();

    row.style.display =
      resID.includes(query) || guest.includes(query) || room.includes(query) ||
      payment.includes(query) || status.includes(query) || checkin.includes(query)
        ? ''
        : 'none';
  });
}


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
const eventReservationTemplate = (data, selectedStatus = '') => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">Event Reservations</h2>

  <!-- FILTER -->
  <div class="flex gap-4 mb-4">
    <select id="filterEventStatus" onchange="applyEventReservationFilter()" class="px-3 py-2 border rounded-lg">
      <option value="" ${selectedStatus === '' ? 'selected' : ''}>All Status</option>
      <option value="Pending" ${selectedStatus === 'Pending' ? 'selected' : ''}>Pending</option>
      <option value="Approved" ${selectedStatus === 'Approved' ? 'selected' : ''}>Approved</option>
      <option value="Started" ${selectedStatus === 'Started' ? 'selected' : ''}>Started</option>
      <option value="Ended" ${selectedStatus === 'Ended' ? 'selected' : ''}>Ended</option>
      <option value="Cancelled" ${selectedStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
      <option value="Disapproved" ${selectedStatus === 'Disapproved' ? 'selected' : ''}>Disapproved</option>
    </select>
  </div>

  <!-- SEARCH -->
  <div class="mb-4">
    <input id="eventReservationSearch"
           type="text"
           placeholder="Search reservations..."
           class="w-full px-3 py-2 border rounded-lg"
           oninput="filterEventReservations()">
  </div>

  <table class="w-full text-sm border">
    <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Reservation ID</th>
        <th class="px-4 py-2">Guest</th>
        <th class="px-4 py-2">Event Type</th>
        <th class="px-4 py-2">Status</th>
        <th class="px-4 py-2">Start</th>
      </tr>
    </thead>

    <tbody id="eventReservationTableBody">
      ${data.map(res => `
        <tr class="border-b hover:bg-gray-50 cursor-pointer"
            onclick="openEventReservationModal('${res.event_reservation_id}')">

          <!-- ACTION MENU -->
          <td class="px-4 py-2 relative" onclick="event.stopPropagation()">

            <button onclick="toggleEventReservationActionMenu(event, '${res.event_reservation_id}')"
                    class="p-2 bg-gray-200 rounded">⚙️</button>

            <div id="eventReservationActionMenu-${res.event_reservation_id}"
                 class="absolute left-0 top-full mt-2 w-40 bg-white border rounded shadow hidden z-50">

              ${
                res.approval_status === "Pending"
                ? `
                  <button onclick="updateEventReservationStatus('${res.event_reservation_id}','Approved')"
                          class='block w-full text-left px-3 py-1 hover:bg-green-100'>Approve</button>
                  <button onclick="updateEventReservationStatus('${res.event_reservation_id}','Disapproved')"
                          class='block w-full text-left px-3 py-1 hover:bg-red-100'>Disapprove</button>
                  <button onclick="updateEventReservationStatus('${res.event_reservation_id}','Cancelled')"
                          class='block w-full text-left px-3 py-1 hover:bg-gray-100'>Cancel</button>
                `
                : res.approval_status === "Approved"
                ? `
                  <button onclick="updateEventReservationStatus('${res.event_reservation_id}','Started')"
                          class='block w-full text-left px-3 py-1 hover:bg-blue-100'>Start</button>
                  <button onclick="updateEventReservationStatus('${res.event_reservation_id}','Ended')"
                          class='block w-full text-left px-3 py-1 hover:bg-gray-100'>End</button>
                `
                : res.approval_status === "Started"
                ? `
                  <button onclick="updateEventReservationStatus('${res.event_reservation_id}','Ended')"
                          class='block w-full text-left px-3 py-1 hover:bg-gray-100'>End</button>
                `
                : ``
              }

            </div>
          </td>

          <td class="px-4 py-2">#${res.event_reservation_id}</td>
          <td class="px-4 py-2">${res.full_name}</td>
          <td class="px-4 py-2">${res.event_type}</td>
          <td class="px-4 py-2" id="eventstatus-${res.event_reservation_id}">${res.approval_status}</td>
          <td class="px-4 py-2">${res.start_datetime}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</div>

<!-- MODAL -->
<div id="eventReservationModal"
     class="fixed inset-0 hidden bg-black bg-opacity-40 flex items-center justify-center z-50">

  <div class="bg-white w-96 p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-3 text-teal-700">Event Reservation</h2>

    <p><strong>Reference:</strong> <span id="eventModalRef"></span></p>
    <p><strong>Name:</strong> <span id="eventModalName"></span></p>
    <p><strong>Event Type:</strong> <span id="eventModalType"></span></p>
    <p><strong>Start:</strong> <span id="eventModalStart"></span></p>
    <p><strong>End:</strong> <span id="eventModalEnd"></span></p>
    <p><strong>Phone:</strong> <span id="eventModalPhone"></span></p>
    <p><strong>To Bring:</strong> <span id="eventModalBring"></span></p>
    <p><strong>Status:</strong> <span id="eventModalStatus"></span></p>

    <button onclick="closeEventReservationModal()"
            class="mt-4 w-full py-2 bg-teal-600 text-white rounded">
      Close
    </button>
  </div>
</div>
`;

// ================ GLOBAL SEARCH FUNCTION =================
function filterEventReservations() {
  const query = document.getElementById('eventReservationSearch').value.toLowerCase();
  const tableBody = document.getElementById('eventReservationTableBody');

  tableBody.querySelectorAll('tr').forEach(row => {
    const resID = row.children[1].textContent.toLowerCase();
    const guest = row.children[2].textContent.toLowerCase();
    const eventType = row.children[3].textContent.toLowerCase();
    const status = row.children[4].textContent.toLowerCase();
    const start = row.children[5].textContent.toLowerCase();

    row.style.display =
      resID.includes(query) || guest.includes(query) || eventType.includes(query) ||
      status.includes(query) || start.includes(query)
        ? ''
        : 'none';
  });
}


const homeEventsTableTemplate = data => `
<div class="p-6 bg-white rounded-2xl shadow-md">
  <h2 class="text-2xl font-bold text-teal-700 mb-4">Home Page Events</h2>

  <div class="flex justify-end mb-4">
    <button id="addHomeEventBtn" 
        class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
        + Add Home Page Event
    </button>
</div>



  <table class="min-w-full border border-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-4 py-2">Action</th>
        <th class="px-4 py-2">Title</th>
        <th class="px-4 py-2">Description</th>
        <th class="px-4 py-2">Highlights</th>
        <th class="px-4 py-2">Image</th>
      </tr>
    </thead>

    <tbody>
      ${data.map(event => `
      <tr class="border-t hover:bg-gray-50 cursor-pointer relative"
          onclick="openEventModal(${event.id})">

        <!-- ACTION MENU -->
        <td class="px-4 py-2 relative" onclick="event.stopPropagation()">
          <button onclick="toggleActionMenu(event, ${event.id})"
                  class="relative z-10 p-2 bg-gray-200 rounded hover:bg-gray-300">⚙️</button>

          <div id="actionMenu-${event.id}" class="absolute left-0 top-full mt-2 w-36 bg-white border rounded shadow-lg hidden z-50">
            <button onclick="editEvent(${event.id})" class="block w-full text-left px-3 py-1 hover:bg-green-100">Edit</button>
            <button onclick="deleteEvent(${event.id})" class="block w-full text-left px-3 py-1 hover:bg-red-100">Delete</button>
          </div>
        </td>

        <td class="px-4 py-2">${event.title}</td>
        <td class="px-4 py-2">${event.description.substring(0, 80)}...</td>
        <td class="px-4 py-2">${event.highlights ? event.highlights.substring(0, 50) : ""}</td>

        <td class="px-4 py-2">
          ${event.image_url
            ? `<img src="${event.image_url}" class="w-20 h-20 object-cover rounded" />`
            : `<span class="text-gray-400">No Image</span>`
          }
        </td>

      </tr>
      `).join("")}
    </tbody>
  </table>
</div>

<!-- MODAL -->
<div id="eventModal" class="fixed flex inset-0 bg-black bg-opacity-40 hidden items-center justify-center z-50">
  <div class="bg-white p-6 rounded-xl w-96 shadow-xl">
    <h3 class="text-xl font-bold text-teal-700 mb-3">Event Details</h3>

    <p><strong>Title:</strong> <span id="modalEventTitle"></span></p>
    <p><strong>Description:</strong></p>
    <p id="modalEventDescription" class="mb-2"></p>

    <p><strong>Highlights:</strong></p>
    <p id="modalEventHighlights" class="mb-2"></p>

    <p><strong>Image:</strong></p>
    <img id="modalEventImage" class="w-full h-auto object-cover rounded mt-2 hidden" />

    <div class="mt-4 text-right">
      <button onclick="closeEventModal()" 
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
    </div>
  </div>
</div>

<div id="addHomeEventModal" class="fixed flex inset-0 bg-black bg-opacity-40 hidden flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl w-full max-w-lg">
        
        <h2 class="text-xl font-bold mb-4">Add Home Page Event</h2>

        <label class="block mb-2">Title</label>
        <input id="eventTitle" type="text" class="w-full p-2 border rounded mb-3">

        <label class="block mb-2">Description</label>
        <textarea id="eventDesc" class="w-full p-2 border rounded mb-3"></textarea>

        <label class="block mb-2">Highlights (optional)</label>
        <textarea id="eventHighlights" class="w-full p-2 border rounded mb-3"></textarea>

        <label class="block mb-2">Event Image</label>
        <input id="eventImage" type="file" class="w-full p-2 border rounded mb-3">

        <div class="flex justify-end gap-3 mt-4">
            <button id="closeAddEventModal" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button id="saveEventBtn" class="px-4 py-2 bg-teal-600 text-white rounded">Save</button>
        </div>
    </div>
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

async function fetchAndRenderHomeEvents() {
  const container = document.getElementById("content");

  try {
    const res = await fetch("/api/home-events");
    const data = await res.json();

    window.homeEventsData = data;
    container.innerHTML = homeEventsTableTemplate(data);

    // 🔥 Attach modal events AFTER rendering
    attachHomeEventListeners();

  } catch (err) {
    console.error("Error fetching home events:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load events</p>`;
  }
}

async function fetchAndRenderReviews(filters = {}) {
  const container = document.getElementById('content');
  const params = new URLSearchParams(filters);

  try {
    const res = await fetch(`/api/reviews?${params.toString()}`);
    const data = await res.json();

    container.innerHTML = reviewManagementTemplate(data);
    window.reviewData = data;

    // Restore selected filters
    if (filters.type) document.getElementById('filterType').value = filters.type;
    if (filters.status) document.getElementById('filterStatus').value = filters.status;
  } catch (err) {
    console.error('Error loading reviews:', err);
    container.innerHTML = '<p class="text-red-500">Failed to load reviews</p>';
  }
}



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
  const container = document.getElementById("content");

  try {
    const res = await fetch("/api/foodOrder");
    const data = await res.json();

    // Save globally for modal lookup
    window.foodOrdersData = data;

    const filtered = status ? data.filter(o => o.order_status === status) : data;

    container.innerHTML = foodOrdersTableTemplate(filtered);
  } catch (err) {
    console.error("Failed to load food orders:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load orders</p>`;
  }
}

let openOrderActionMenuId = null;
function toggleOrderActionMenu(event, id) {
  event.stopPropagation();
  const menu = document.getElementById(`orderActionMenu-${id}`);
  if (!menu) return;

  if (openOrderActionMenuId && openOrderActionMenuId !== id) {
    const prev = document.getElementById(`orderActionMenu-${openOrderActionMenuId}`);
    if (prev) prev.classList.add('hidden');
  }

  menu.classList.toggle('hidden');
  openOrderActionMenuId = menu.classList.contains('hidden') ? null : id;
}

document.addEventListener('click', () => {
  if (openOrderActionMenuId) {
    const menu = document.getElementById(`orderActionMenu-${openOrderActionMenuId}`);
    if (menu) menu.classList.add('hidden');
    openOrderActionMenuId = null;
  }
});


async function fetchAndRenderFarmOrders() {
  const container = document.getElementById("content");

  try {
    const res = await fetch("/api/farmOrder");
    const data = await res.json();

    window.farmOrdersData = data;

    container.innerHTML = farmOrderTableTemplate(data);
  } catch (err) {
    console.error("Failed to load farm orders:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load orders</p>`;
  }
}


// Track the currently open farm action menu
let openFarmOrderActionMenuId = null;

function toggleFarmOrderActionMenu(event, id) {
  event.stopPropagation();
  const menu = document.getElementById(`farmOrderActionMenu-${id}`);
  if (!menu) return;

  // Close previously open menu
  if (openFarmOrderActionMenuId && openFarmOrderActionMenuId !== id) {
    const prev = document.getElementById(`farmOrderActionMenu-${openFarmOrderActionMenuId}`);
    if (prev) prev.classList.add('hidden');
  }

  menu.classList.toggle('hidden');
  openFarmOrderActionMenuId = menu.classList.contains('hidden') ? null : id;
}

document.addEventListener('click', () => {
  if (openFarmOrderActionMenuId) {
    const menu = document.getElementById(`farmOrderActionMenu-${openFarmOrderActionMenuId}`);
    if (menu) menu.classList.add('hidden');
    openFarmOrderActionMenuId = null;
  }
});




async function fetchAndRenderRoomReservations(status = null, payment = null) {
  const container = document.getElementById("content");
  try {
    const res = await fetch("/api/roomReser");
    const data = await res.json();

    // Sort by earliest check-in date ascending
    data.sort((a, b) => new Date(a.check_in_date) - new Date(b.check_in_date));

    // Store globally for modal lookup
    window.roomReservationsData = data;

    // Filter
    let filtered = data;
    if (status) filtered = filtered.filter(r => r.status === status);
    if (payment) filtered = filtered.filter(r => r.payment_status === payment);

    // Render table
    container.innerHTML = roomReservationTableTemplate(filtered, status || '', payment || '');
  } catch (err) {
    console.error("Failed to fetch room reservations:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load room reservations</p>`;
  }
}

let openRoomReservationActionMenuId = null;
function toggleRoomReservationActionMenu(event, id) {
  event.stopPropagation();
  const menu = document.getElementById(`roomReservationActionMenu-${id}`);
  if (!menu) return;

  if (openRoomReservationActionMenuId && openRoomReservationActionMenuId !== id) {
    const prev = document.getElementById(`roomReservationActionMenu-${openRoomReservationActionMenuId}`);
    if (prev) prev.classList.add("hidden");
  }

  menu.classList.toggle("hidden");
  openRoomReservationActionMenuId = menu.classList.contains("hidden") ? null : id;
}

// Close menu when clicking outside
document.addEventListener("click", () => {
  if (openRoomReservationActionMenuId) {
    const menu = document.getElementById(`roomReservationActionMenu-${openRoomReservationActionMenuId}`);
    if (menu) menu.classList.add("hidden");
    openRoomReservationActionMenuId = null;
  }
});

async function fetchAndRenderEventReservations(status = null) {
  const container = document.getElementById("content");

  try {
    const res = await fetch("/api/event-reservations");
    let data = await res.json();

    data.sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));

    const filtered = status ? data.filter(r => r.approval_status === status) : data;

    window.eventReservationsData = data;

    container.innerHTML = eventReservationTemplate(filtered, status);

  } catch (err) {
    console.error("Failed fetching event reservations:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load data.</p>`;
  }
}

let openEventReservationMenuId = null;

function toggleEventReservationActionMenu(event, id) {
  event.stopPropagation();

  const menu = document.getElementById(`eventReservationActionMenu-${id}`);

  if (openEventReservationMenuId && openEventReservationMenuId !== id) {
    document.getElementById(
      `eventReservationActionMenu-${openEventReservationMenuId}`
    )?.classList.add("hidden");
  }

  menu.classList.toggle("hidden");
  openEventReservationMenuId = menu.classList.contains("hidden") ? null : id;
}

document.addEventListener("click", () => {
  if (openEventReservationMenuId) {
    document.getElementById(
      `eventReservationActionMenu-${openEventReservationMenuId}`
    )?.classList.add("hidden");
    openEventReservationMenuId = null;
  }
});


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
        
         <!-- 🔍 Search Bar -->
        <div class="mb-4">
          <input 
            id="kitchenSearch"
            type="text"
            placeholder="Search ingredient..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            oninput="filterKitchenInventory()"
          />
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

// =================== SEARCH FUNCTION ===================
function filterKitchenInventory() {
  const searchValue = document.getElementById("kitchenSearch").value.toLowerCase();
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const ingredient = row.children[1].textContent.toLowerCase(); // Ingredient column
    row.style.display = ingredient.includes(searchValue) ? "" : "none";
  });
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

// =========================Farm Inventory ====================

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

        <!-- Search Box -->
        <div class="mb-4 flex items-center gap-2">
          <input id="farmSearch" 
                 type="text" 
                 placeholder="Search items..." 
                 class="px-3 py-2 border rounded w-full text-sm">
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
          <tbody id="farmTableBody">
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
                  ${item.unit_cost !== null && item.unit_cost !== "" && !isNaN(item.unit_cost)
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

    // --- Instant search functionality ---
    const searchInput = document.getElementById("farmSearch");
    const tableBody = document.getElementById("farmTableBody");

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();

      tableBody.querySelectorAll("tr").forEach(row => {
        const itemName = row.children[1].textContent.toLowerCase();
        const status = row.children[7].textContent.toLowerCase();
        const unit = row.children[4].textContent.toLowerCase();

        // Show row if query matches any column
        row.style.display =
          itemName.includes(query) || status.includes(query) || unit.includes(query)
            ? ""
            : "none";
      });
    });

  } catch (error) {
    console.error("Error fetching farm inventory:", error);
    content.innerHTML = `<p class="text-red-500">Failed to load farm inventory.</p>`;
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

async function fetchAndRenderGoogleUsers() {
  const container = document.getElementById("content");

  try {
    const res = await fetch("/api/google-users");
    const data = await res.json();

    window.googleUsersData = data; // store for filtering
    container.innerHTML = googleUserTableTemplate(data);

  } catch (err) {
    console.error("Error fetching Google users:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load users</p>`;
  }
}





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
    idApproval:{ render: fetchAndRenderGoogleUsers },
    reviews: { render: fetchAndRenderReviews },
    homePage:{ render: fetchAndRenderHomeEvents },
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

// Run immediately
    checkNotifications();
    // Run every 5 seconds
    setInterval(checkNotifications, 5000);
});


  
// ================= Modals =================


// 🔹 Input validation
function validateFloatInput(input) {
  input.value = input.value.replace(/[^0-9.]/g, '');
  if ((input.value.match(/\./g) || []).length > 1) {
    input.value = input.value.substring(0, input.value.length - 1);
  }
}



// Function to open modal for a selected order
function openFoodOrderModal(orderId) {
  // Find the specific order from the global data
  const order = window.foodOrdersData.find(o => o.foodOrder_id === orderId);

  if (order) {
    document.getElementById("foodModalOrderID").textContent = order.foodOrder_id;
    
    // Process Items
    const items = [
       { key: 'smokedFish_order', name: 'Smoked Fish' },
       { key: 'deviledFish_order', name: 'Deviled Fish' },
       { key: 'seaSig_order', name: 'SeaSig' },
       { key: 'blueCraze_order', name: 'Blue Craze' },
       { key: 'chickenSheet_order', name: 'Chicken Sheet' },
       { key: 'blackMeal_order', name: 'Black Meal' }
    ]
    .filter(i => order[i.key] && order[i.key] > 0)
    .map(i => `${order[i.key]}x ${i.name}`)
    .join(', ');

    document.getElementById("modalOrderItems").textContent = items || "No items";
    document.getElementById("modalOrderTotal").textContent = parseFloat(order.total_bill).toLocaleString();
    document.getElementById("modalOrderPayment").textContent = order.payment_status;
    document.getElementById("modalOrderStatus").textContent = order.order_status;

    // ✅ NEW: Fill Type and Time
    document.getElementById("foodModalOrderType").textContent = order.order_type || "Dine-in";
    // Check if formatDateTime exists, otherwise just show raw string
    const timeString = window.formatDateTime ? window.formatDateTime(order.scheduled_datetime) : order.scheduled_datetime;
    document.getElementById("foodModalOrderTime").innerHTML = timeString; 

    // ✅ NEW: Handle Notes
    const noteBox = document.getElementById("foodModalNotesSection");
    const noteText = document.getElementById("foodModalNotes");
    
    if (order.notes && order.notes.trim() !== "") {
        noteText.textContent = order.notes;
        noteBox.classList.remove("hidden");
    } else {
        noteBox.classList.add("hidden");
    }

    // Show Modal
    document.getElementById("foodOrderModal").classList.remove("hidden");
  }
}

function closeFoodOrderModal() {
  document.getElementById("foodOrderModal").classList.add("hidden");
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
    showToast(data.message || 'Order updated');

    // Close the modal if open
    const modal = document.getElementById('foodOrderModal');
    if (modal) modal.classList.add('hidden');

    // Update the table row dynamically
    const row = document.querySelector(`tr[onclick="openFoodOrderModal('${foodOrderId}')"]`);
    if (!row) return;

    // Update order_status column
    row.cells[5].innerText = status;

    // Update payment badge class if needed (optional)
    const badge = row.cells[3].querySelector('span');
    if (badge) {
      if (status === 'Completed') badge.className = 'px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full';
      else if (status === 'Cancelled') badge.className = 'px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full';
      else badge.className = 'px-2 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full';
    }

    // Update action menu buttons
    const menu = document.getElementById(`orderActionMenu-${foodOrderId}`);
    if (menu) {
      menu.innerHTML = `<button onclick="deleteFoodOrder('${foodOrderId}')" 
                          class="block w-full text-left px-3 py-1 hover:bg-gray-100">Remove</button>`;
    }

    // Also update in window.foodOrdersData
    const order = window.foodOrdersData.find(o => o.foodOrder_id === foodOrderId);
    if (order) order.order_status = status;
  })
  .catch(err => console.error(err));
}

function deleteFoodOrder(foodOrderId) {
   showDeletePopup(foodOrderId); // open your popup
}

function deleteFoodOrderConfirmed(foodOrderId) {
  fetch(`/api/foodOrder/${foodOrderId}/delete`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    showToast(data.message || 'Order removed');

    const row = document.querySelector(`tr[onclick="openFoodOrderModal('${foodOrderId}')"]`);
    if (row) row.remove();

    window.foodOrdersData = window.foodOrdersData.filter(o => o.foodOrder_id !== foodOrderId);

    const modal = document.getElementById('foodOrderModal');
    if (modal) modal.classList.add('hidden');
  })
  .catch(err => console.error(err));
}

let pendingDeleteId = null;

function showDeletePopup(id) {
  pendingDeleteId = id;
  document.getElementById("deletePopup").classList.remove("hidden");
}

function hideDeletePopup() {
  pendingDeleteId = null;
  document.getElementById("deletePopup").classList.add("hidden");
}

document.getElementById("cancelDeleteBtn").addEventListener("click", hideDeletePopup);

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  deleteFoodOrderConfirmed(pendingDeleteId);
  hideDeletePopup();
});




function applyFoodOrderFilter() {
  const orderStatus = document.getElementById('filterOrderStatus').value;
  const paymentStatus = document.getElementById('filterPaymentStatus').value;

  let filtered = window.foodOrdersData;

  if (orderStatus) filtered = filtered.filter(o => o.order_status === orderStatus);
  if (paymentStatus) filtered = filtered.filter(o => o.payment_status === paymentStatus);

  const container = document.getElementById("content");
  container.innerHTML = foodOrdersTableTemplate(filtered, orderStatus, paymentStatus);
}

// Farm Order Modals and Functions

// Function to open modal for a selected order
function openFarmOrderModal(orderId) {
  // Find the specific order from the global data
  const order = window.farmOrdersData.find(o => o.farmOrder_id === orderId);

  if (order) {
    document.getElementById("farmModalOrderID").textContent = order.farmOrder_id;
    
    // Format Items
    const items = [
      { key: "bangus_order", name: "Bangus" },
      { key: "eggs_order", name: "Eggs" },
      { key: "mudCrab_order", name: "Mud Crab" },
      { key: "nativeChicken_order", name: "Native Chicken" },
      { key: "nativePork_order", name: "Native Pork" },
      { key: "squash_order", name: "Squash" },
    ]
    .filter((i) => order[i.key] && order[i.key] > 0)
    .map((i) => `${order[i.key]}x ${i.name}`)
    .join(", ");

    document.getElementById("farmModalOrderItems").textContent = items || "No items";
    document.getElementById("farmModalOrderTotal").textContent = parseFloat(order.total_bill).toLocaleString();
    document.getElementById("farmModalOrderPayment").textContent = order.payment_status;
    document.getElementById("farmModalOrderStatus").textContent = order.order_status;

    // ✅ Fill the new Time Field
    document.getElementById("farmModalOrderTime").textContent = formatDateTime(order.scheduled_datetime); // Removed HTML tags for textContent

    // Show Modal
    document.getElementById("farmOrderModal").classList.remove("hidden");
  }
}

function closeFarmOrderModal() {
  document.getElementById("farmOrderModal").classList.add("hidden");
}

function updateFarmOrderStatus(orderId, status) {
  fetch(`/api/farmOrder/${orderId}/update-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_status: status }),
  })
    .then(res => res.json())
    .then(json => {
      showToast(json.message || "Order updated");

      const row = document.querySelector(`tr[onclick="openFarmOrderModal('${orderId}')"]`);
      if (!row) return;

      row.cells[5].innerText = status;

      const menu = document.getElementById(`farmOrderActionMenu-${orderId}`);
      if (menu) {
        menu.innerHTML = `
          <button onclick="deleteFarmOrder('${orderId}')"
                  class="block w-full text-left px-3 py-1 hover:bg-gray-100">
            Remove
          </button>`;
      }

      const order = window.farmOrdersData.find(o => o.farmOrder_id === orderId);
      if (order) order.order_status = status;

      closeFarmOrderModal();
    });
}

function deleteFarmOrder(orderId) {
 showFarmDeletePopup(orderId); // open popup instead of confirm()
}

function deleteFarmOrderConfirmed(orderId) {
  fetch(`/api/farmOrder/${orderId}/delete`, { method: "DELETE" })
    .then(res => res.json())
    .then(json => {
      showToast(json.message || "Order removed");

      const row = document.querySelector(
        `tr[onclick="openFarmOrderModal('${orderId}')"]`
      );
      if (row) row.remove();

      window.farmOrdersData = window.farmOrdersData.filter(o => o.farmOrder_id !== orderId);

      closeFarmOrderModal();
    });
}

let pendingFarmDeleteId = null;

function showFarmDeletePopup(id) {
  pendingFarmDeleteId = id;
  document.getElementById("farmDeletePopup").classList.remove("hidden");
}

function hideFarmDeletePopup() {
  pendingFarmDeleteId = null;
  document.getElementById("farmDeletePopup").classList.add("hidden");
}

document.getElementById("farmCancelDeleteBtn").addEventListener("click", hideFarmDeletePopup);

document.getElementById("farmConfirmDeleteBtn").addEventListener("click", () => {
  deleteFarmOrderConfirmed(pendingFarmDeleteId);
  hideFarmDeletePopup();
});


function applyFarmOrderFilter() {
  const orderStatus = document.getElementById("filterFarmOrderStatus").value;
  const paymentStatus = document.getElementById("filterFarmPaymentStatus").value;

  let filtered = window.farmOrdersData;

  if (orderStatus) filtered = filtered.filter(o => o.order_status === orderStatus);
  if (paymentStatus) filtered = filtered.filter(o => o.payment_status === paymentStatus);

  document.getElementById("content").innerHTML =
    farmOrderTableTemplate(filtered, orderStatus, paymentStatus);
}

// Room Reservation Modals and Functions
function openRoomModal(reservationId) {
  const allReservations = window.roomReservationsData || [];
  const res = allReservations.find(r => r.room_reser_id === reservationId);
  if (!res) return;

  document.getElementById("roomModalTitle").textContent = `Reservation #${res.room_reser_id}`;
  document.getElementById("roomModalRef").textContent = `Guest: ${res.full_name}`;
  document.getElementById("roomModalItems").innerHTML = `
    <li>Room: ${res.room}</li>
    <li>Check-in: ${res.check_in_date}</li>
    <li>Check-out: ${res.check_out_date}</li>
    <li>Contact: ${res.phone_number}</li>
    <li>Payment Status: ${res.payment_status}</li>
    <li>Status: ${res.status}</li>
  `;

  document.getElementById("roomReservationModal").classList.remove("hidden");
}



function closeRoomModal() {
  document.getElementById("roomReservationModal").classList.add("hidden");
}


// --- Update reservation status ---
function updateRoomStatus(id, status) {
  fetch(`/api/roomReservation/${id}/update-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  .then(res => res.json())
  .then(data => {
    showToast(data.message);
    applyRoomReservationFilter(); // re-render table
  })
  .catch(err => console.error(err));
}

function applyRoomReservationFilter() {
  const status = document.getElementById('filterRoomStatus').value;
  const payment = document.getElementById('filterRoomPayment').value;

  fetchAndRenderRoomReservations(status, payment);
}




function openEventReservationModal(id) {
  const res = window.eventReservationsData.find(r => r.event_reservation_id == id);
  if (!res) return;

  document.getElementById("eventModalRef").innerText = res.event_reservation_id;
  document.getElementById("eventModalName").innerText = res.full_name;
  document.getElementById("eventModalType").innerText = res.event_type;
  document.getElementById("eventModalStart").innerText = res.start_datetime;
  document.getElementById("eventModalEnd").innerText = res.end_datetime;
  document.getElementById("eventModalPhone").innerText = res.phone_number;
  document.getElementById("eventModalBring").innerText = res.to_bring;
  document.getElementById("eventModalStatus").innerText = res.approval_status;

  document.getElementById("eventReservationModal").classList.remove("hidden");
}

function closeEventReservationModal() {
  document.getElementById("eventReservationModal").classList.add("hidden");
}

function updateEventReservationStatus(id, status) {
  fetch(`/api/eventReservation/${id}/update-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.message);

      const el = document.getElementById(`eventstatus-${id}`);
      if (el) el.innerText = status;

      const obj = window.eventReservationsData.find(r => r.event_reservation_id == id);
      if (obj) obj.approval_status = status;

      // ⭐ INSTANT RELOAD WITH CURRENT FILTER
      const selected = document.getElementById("filterEventStatus").value;
      fetchAndRenderEventReservations(selected === "" ? null : selected);
    })
    .catch(err => console.error("Update failed:", err));
}

function applyEventReservationFilter() {
  const status = document.getElementById("filterEventStatus").value;
  fetchAndRenderEventReservations(status === "" ? null : status);
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
function showPopup(message, type = "info") {
  // Remove old popup if it exists
  const existing = document.getElementById("dynamicPopup");
  if (existing) existing.remove();

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "dynamicPopup";
  overlay.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";

  // Box
  const box = document.createElement("div");
  box.className =
    "w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-lg";

  // Message
  const msg = document.createElement("p");
  msg.className = "mb-4 text-gray-800";
  msg.textContent = message;

  // Button
  const btn = document.createElement("button");
  btn.className =
    "px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700";
  btn.textContent = "OK";
  btn.addEventListener("click", () => overlay.remove());

  box.appendChild(msg);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

 function showConfirmPopup(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";

  const box = document.createElement("div");
  box.className =
    "w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-lg";

  const msg = document.createElement("p");
  msg.className = "mb-5 text-gray-800";
  msg.textContent = message;

  const btnWrap = document.createElement("div");
  btnWrap.className = "flex justify-center gap-4";

  const yesBtn = document.createElement("button");
  yesBtn.className =
    "px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700";
  yesBtn.textContent = "Yes";
  yesBtn.onclick = () => {
    overlay.remove();
    onConfirm();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.className =
    "px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => overlay.remove();

  btnWrap.appendChild(yesBtn);
  btnWrap.appendChild(cancelBtn);

  box.appendChild(msg);
  box.appendChild(btnWrap);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

async function removeFarmItem(id) {
  showConfirmPopup("Are you sure you want to remove this item?", async () => {
    try {
      const res = await fetch(`/api/farmInventory/${id}`, { method: "DELETE" });
      const data = await res.json();

      showPopup(data.message, "success");
      fetchAndRenderFarm();
    } catch (err) {
      showPopup("Failed to remove item", "error");
    }
  });
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

// Update Status ID Approval

async function updateIdStatus(userId, status) {
  try {
    const res = await fetch(`/api/google-users/${userId}/update-id-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ id_status: status })
    });

    const result = await res.json();
    if (result.message) {
      // update the local data for instant UI update
      const user = window.googleUsersData.find(u => u.user_id === userId);
      if (user) user.id_status = status;
      applyGoogleUserFilter(); // re-render table
      alert(`Status updated to ${status}`);
    }
  } catch (err) {
    console.error("Error updating status:", err);
    alert("Failed to update status");
  }
}


function applyGoogleUserFilter() {
console.log("applyGoogleUserFilter called");

const statusSelect = document.getElementById('filterStatus');
if (!statusSelect) {
console.error("Filter select element not found!");
return;
}

const status = statusSelect.value;
console.log("Selected status:", status);

if (!window.googleUsersData) {
console.error("window.googleUsersData is undefined!");
return;
}

let filtered = window.googleUsersData;
console.log("Original data length:", filtered.length);

if (status) {
filtered = filtered.filter(user => user.id_status === status);
console.log("Filtered data length:", filtered.length);
}

const container = document.getElementById("content");
if (!container) {
console.error("Content container not found!");
return;
}

// Use the existing template function
container.innerHTML = googleUserTableTemplate(filtered);
console.log("Table re-rendered with filtered data");

// Restore select value
document.getElementById('filterStatus').value = status;
}


function openUserModal(userId) {
  const user = window.googleUsersData.find(u => u.user_id === userId);
  if (!user) return;

  document.getElementById('modalUserName').innerText = user.name;
  document.getElementById('modalUserEmail').innerText = user.email;
  document.getElementById('modalUserStatus').innerText = user.id_status;

  const photoEl = document.getElementById('modalUserPhoto');
  if (user.id_photo) {
    photoEl.src = user.id_photo;
    photoEl.classList.remove('hidden');
  } else {
    photoEl.src = '';
    photoEl.classList.add('hidden');
  }

  document.getElementById('userModal').classList.remove('hidden');
}

function closeUserModal() {
  document.getElementById('userModal').classList.add('hidden');
}


// Reviews Functions

async function markReviewed(id) {
  console.log("Marking as reviewed:", id);
  await fetch(`/api/reviews/${id}/mark-reviewed`, { method: "POST" });
  fetchAndRenderReviews(getCurrentFilters());
}

function deleteReview(id) {
  showReviewDeletePopup(id);
}

async function deleteReviewConfirmed(id) {
  console.log("Deleting review:", id);
  await fetch(`/api/reviews/${id}`, { method: "DELETE" });

  // Refresh UI
  fetchAndRenderReviews(getCurrentFilters());
}

let pendingReviewDeleteId = null;

function showReviewDeletePopup(id) {
  pendingReviewDeleteId = id;
  document.getElementById("reviewDeletePopup").classList.remove("hidden");
}

function hideReviewDeletePopup() {
  pendingReviewDeleteId = null;
  document.getElementById("reviewDeletePopup").classList.add("hidden");
}

document.getElementById("cancelReviewDeleteBtn").addEventListener("click", hideReviewDeletePopup);

document.getElementById("confirmReviewDeleteBtn").addEventListener("click", () => {
  deleteReviewConfirmed(pendingReviewDeleteId);
  hideReviewDeletePopup();
});


function getCurrentFilters() {
  const typeInput = document.getElementById("filterType");
  const statusInput = document.getElementById("filterStatus");
  return {
    type: typeInput?.value,
    status: statusInput?.value
  };
}


document.addEventListener("click", async (e) => {
  // OPEN MODAL
  const row = e.target.closest(".review-row");
  if (row && id) {
    console.log("Opening modal for row:", id);
    const review = window.reviewData.find(r => r.id == id);
    if (!review) {
      console.warn("Review not found for row:", id);
      return;
    }

    const orderId = review.food_order_id || review.farm_order_id || review.room_reservation_id || review.event_reservation_id || "N/A";

    document.getElementById("modalUser").textContent = review.user_name || review.user?.name || "Unknown";
    document.getElementById("modalOrderId").textContent = orderId;
    document.getElementById("modalStars").textContent = review.stars;
    document.getElementById("modalStatus").textContent = review.review_status;
    document.getElementById("modalComment").textContent = review.comment ?? "";

    document.getElementById("reviewModal").classList.remove("hidden");
  }
});





function closeReviewModal() {
  document.getElementById('reviewModal').classList.add('hidden');
}


async function applyReviewFilters() {
  const type = document.getElementById('filterType')?.value;
  const status = document.getElementById('filterStatus')?.value;

  const filters = {};
  if (type) filters.type = type;
  if (status) filters.status = status;

  await fetchAndRenderReviews(filters);}



  

  function openEventModal(id) {
  const event = window.homeEventsData.find(e => e.id == id);
  if (!event) return;

  document.getElementById('modalEventTitle').innerText = event.title;
  document.getElementById('modalEventDescription').innerText = event.description;
  document.getElementById('modalEventHighlights').innerText = event.highlights ?? "";

  const img = document.getElementById('modalEventImage');
  if (event.image_url) {
    img.src = event.image_url;
    img.classList.remove('hidden');
  } else {
    img.src = "";
    img.classList.add('hidden');
  }

  document.getElementById('eventModal').classList.remove('hidden');
}

function closeEventModal() {
  document.getElementById('eventModal').classList.add('hidden');
}

function toggleActionMenu(event, id) {
  event.stopPropagation();

  document.querySelectorAll("[id^='actionMenu-']").forEach(m => {
    if (m.id !== `actionMenu-${id}`) m.classList.add("hidden");
  });

  const menu = document.getElementById(`actionMenu-${id}`);
  menu.classList.toggle("hidden");
}

document.addEventListener("click", () => {
  document.querySelectorAll("[id^='actionMenu-']").forEach(m => m.classList.add("hidden"));
});


function editEvent(id) {
  alert("Edit event " + id + "\nImplement your edit form here.");
}

async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;

  try {
    const res = await fetch(`/api/home-events/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");

    fetchAndRenderHomeEvents();
  } catch (err) {
    console.error(err);
    alert("Failed to delete event");
  }
}

// OPEN MODAL
document.getElementById("addHomeEventBtn").onclick = () => {
    document.getElementById("addHomeEventModal").classList.remove("hidden");
};

// CLOSE MODAL
document.getElementById("closeAddEventModal").onclick = () => {
    document.getElementById("addHomeEventModal").classList.add("hidden");
};

async function saveHomeEvent() {
    const title = document.getElementById("eventTitle").value.trim();
    const desc = document.getElementById("eventDesc").value.trim();
    const highlights = document.getElementById("eventHighlights").value.trim();
    const imageFile = document.getElementById("eventImage").files[0];

    if (!title || !desc || !imageFile) {
        alert("Please fill in all required fields.");
        return;
    }

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("highlights", highlights);
    formData.append("image_url", imageFile);

    try {
        console.log("Submitting Home Event:", { title, desc, highlights, imageFile });

        const res = await fetch("/api/home-events", {
            method: "POST",
            body: formData,
        });

        console.log("Raw Response:", res);

        const text = await res.text(); // read as text first
        console.log("Response text:", text);

        try {
            const data = JSON.parse(text);
            console.log("Parsed JSON Response:", data);

            alert("Event added successfully!");
            document.getElementById("addHomeEventModal").classList.add("hidden");
            fetchAndRenderHomeEvents();
        } catch (jsonErr) {
            console.error("Failed to parse JSON:", jsonErr);
            alert("Failed to parse response. Check console for details.");
        }

    } catch (err) {
        console.error("Error saving event:", err);
        alert("Failed to save event. Check console for details.");
    }
}



function attachHomeEventListeners() {
    const addBtn = document.getElementById("addHomeEventBtn");
    const closeBtn = document.getElementById("closeAddEventModal");
    const saveBtn = document.getElementById("saveEventBtn");

    if (addBtn) addBtn.onclick = () => {
        document.getElementById("addHomeEventModal").classList.remove("hidden");
    };

    if (closeBtn) closeBtn.onclick = () => {
        document.getElementById("addHomeEventModal").classList.add("hidden");
    };

    if (saveBtn) saveBtn.onclick = saveHomeEvent;
}

// --- LIVE NOTIFICATIONS SYSTEM ---

// Store counts
let prevCounts = { food: 0, farm: 0, room: 0, event: 0, approval: 0, review: 0 };
let isFirstLoad = true; // Prevent toast spam on page refresh

// 1. Fetch from Backend
async function checkNotifications() {
  try {
    const res = await fetch('/api/notifications-counts');
    
    if (!res.ok) {
        console.warn("⚠️ Notification API error:", res.status);
        return;
    }

    const counts = await res.json();
    console.log("🔔 Live Counts:", counts); // Debugging

    // Update UI Badges
    updateBadge('badgeFood', counts.food);
    updateBadge('badgeFarm', counts.farm);
    updateBadge('badgeRoom', counts.room);
    updateBadge('badgeEvent', counts.event);
    updateBadge('badgeApproval', counts.approval);
    updateBadge('badgeReview', counts.review);

    // Show Toasts (Only if NOT first load AND count increased)
    if (!isFirstLoad) {
        if (counts.food > prevCounts.food) showToast("🔔 New Food Order Received!");
        if (counts.farm > prevCounts.farm) showToast("🔔 New Farm Order Received!");
        if (counts.room > prevCounts.room) showToast("🔔 New Room Reservation!");
        if (counts.event > prevCounts.event) showToast("🔔 New Event Reservation!");
        if (counts.approval > prevCounts.approval) showToast("🔔 New ID Approval Request!");
        if (counts.review > prevCounts.review) showToast("🔔 New Review Posted!");
    }

    // Update state
    prevCounts = counts;
    isFirstLoad = false;

  } catch (err) {
    console.error("❌ Notification check failed:", err);
  }
}

// 2. Helper to toggle badge visibility
function updateBadge(id, count) {
  const badge = document.getElementById(id);
  if (!badge) {
      // console.warn(`Badge element #${id} not found in HTML`);
      return;
  }

  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
    // Optional: Add bounce effect
    badge.classList.add('animate-bounce'); 
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('animate-bounce');
  }
}

if (typeof showToast === 'undefined') {
    window.showToast = function(message) {
        // Create simple toast if your main one isn't loaded
        const div = document.createElement('div');
        div.className = "fixed z-50 px-6 py-3 text-white bg-teal-800 rounded-lg shadow-xl bottom-5 right-5 animate-bounce";
        div.innerText = message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
}