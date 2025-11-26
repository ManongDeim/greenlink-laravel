 let productData = {};
let userId = null;
window.counters = {};
 
 function incrementCounter(id) {
      if (!window.counters[id]) window.counters[id] = 0;
  window.counters[id]++;
  document.getElementById(id).textContent = window.counters[id];
    }

    function decrementCounter(id) {
      if (!window.counters[id]) window.counters[id] = 0;
  if (window.counters[id] > 0) {
    window.counters[id]--;
    document.getElementById(id).textContent = window.counters[id];
      }
    }
    // Toast Notification
    function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  
  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("opacity-100");

  // Hide automatically after 3 seconds
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 500); // wait for fade-out animation
  }, 3000);
    }

    let cart = [];

// Add item to cart
function addItem(itemName, counterId) {
  event.preventDefault();
  let qty = parseInt(document.getElementById(counterId).textContent);

  if (qty > 0) {
    let existing = cart.find(c => c.name === itemName);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name: itemName, qty: qty });
    }

    // reset counter
    document.getElementById(counterId).textContent = 0;
    if (typeof counters !== "undefined") {
      counters[counterId] = 0; 
    }

    updateCartBadge();
    updateModal();

    showToast(qty + " × " + itemName + " added to cart!");
  } else {
    showAlert("Please select quantity before adding");  
  }
}

// Update cart badge count
function updateCartBadge() {
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

// Checkout button
document.querySelector("form").addEventListener("button", function(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  openModal();
});

// Open modal
function openModal() {
  updateModal();
  document.getElementById("checkoutModal").classList.remove("hidden");
  document.body.classList.add("overflow-hidden"); // disable scroll
}

// Close modal
function closeModal() {
  document.getElementById("checkoutModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden"); // re-enable scroll
}

// Update modal live
function updateModal() {
  let cartSummary = document.getElementById("cartSummary");
  let cartTotal = document.getElementById("cartTotal");
  cartSummary.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let price = getPrice(item.name);
    let itemTotal = price * item.qty;
    total += itemTotal;

    cartSummary.innerHTML += `
      <div class="flex justify-between items-center border-b pb-1">
        <span>${item.name}</span>
        <div class="flex items-center gap-2">
          <button onclick="changeQty(${index}, -1)" class="px-2 bg-gray-300 rounded">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)" class="px-2 bg-gray-300 rounded">+</button>
          <span class="ml-2">₱${itemTotal}</span>
          <button onclick="removeItem(${index})" class="text-red-600 hover:text-red-800 text-sm ml-2">Remove</button>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = `₱${total}`;
}

// Change quantity inside modal
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1); // remove if qty 0
  }
  updateCartBadge();
  updateModal();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  updateCartBadge();
  updateModal();
}

// Confirm order
function confirmOrder() {
  const orderType = document.querySelector('input[name="orderType"]:checked')?.value;
  const date = document.getElementById('pickupDate').value;
  const hour = document.getElementById('hourSelect').value;
  const minute = document.getElementById('minuteSelect').value;
  const time = `${hour}:${minute}`;

  if (!orderType || !date || !hour || !minute) {
    alert("Please select order type, date, and time before confirming.");
    return;
  }

  // ✅ Proceed to payment summary modal
  if (cart.length === 0) {
    showAlert("Your cart is empty!");
    return;
  }

  let summary = "";
  let total = 0;

  cart.forEach(item => {
    let price = getPrice(item.name);
    let itemTotal = price * item.qty;
    total += itemTotal;

    summary += `<div class="flex justify-between">
      <span>${item.name} x ${item.qty}</span>
      <span>₱${itemTotal.toFixed(2)}</span>
    </div>`;
  });

  summary += `
    <div class="mt-2 flex justify-between font-bold">
      <span>Total:</span>
      <span>₱${total.toFixed(2)}</span>
    </div>`;

  document.getElementById("paymentSummary").innerHTML = summary;

  closeModal();
  document.getElementById("paymentModal").classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}


// Send to Laravel + Log in guard

let hasDiscount = false; // Set this dynamically if needed

async function sendOrder(paymentMethod) {
  // fetch user info to check discount
  if (!window.userId) {
    const res = await fetch("https://greenlinklolasayong.site/api/user-info", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      window.userId = data.user.id;
      hasDiscount = data.user.id_status === "Validated"; // check if validated senior/PWD
    }
  }

  const orderData = cart.map(item => {
    let price = getPrice(item.name);
    if (hasDiscount) price *= 0.8; // apply discount
    return { name: item.name, qty: item.qty, price };
  });

  // Calculate total
  const total = orderData.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Update payment summary
  let summaryHTML = "";
  orderData.forEach(item => {
    summaryHTML += `<div class="flex justify-between">
      <span>${item.name} x ${item.qty}</span>
      <span>₱${(item.price * item.qty).toFixed(2)}</span>
    </div>`;
  });
  summaryHTML += `<div class="mt-2 flex justify-between font-bold">
      <span>Total:</span>
      <span>₱${total.toFixed(2)}</span>
  </div>`;
  if (hasDiscount) {
    summaryHTML += `<p class="text-green-600 mt-1 font-semibold">20% Discount Applied!</p>`;
  }
  document.getElementById("paymentSummary").innerHTML = summaryHTML;

  // send to backend
  fetch("https://greenlinklolasayong.site/api/foodOrder/create-link", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: window.userId, cart: orderData, payment_method: paymentMethod })
  })
  .then(res => res.json())
  .then(data => {
    if (data.payment_url) window.location.href = data.payment_url;
    else alert("No payment URL returned.");
  });
}


// Price list
function getPrice(itemName) {
   return parseFloat(productData[itemName]) || 0;
}

// --- DOMContentLoaded Event ---
document.addEventListener("DOMContentLoaded", () => {
  // Checkout button opens cart modal
  document.getElementById("checkoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showAlert("Your cart is empty.");
      return;
    }
    openModal();
  });

  // Proceed to payment (PayMongo)
  const paymongoBtn = document.getElementById("paymongoBtn");
  if (paymongoBtn) {
    paymongoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!window.isLoggedIn) {
        openLoginModal();
        return;
      }

      sendOrder("PayMongo");
    });
  } else {
    console.error("❌ paymongoBtn not found");
  }
});

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

       function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
    }

    function showAlert(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("alertModal").classList.remove("hidden");
}

    function closeAlert() {
  document.getElementById("alertModal").classList.add("hidden");
    }


  //Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "./RoomReser.html"; // go to another page
  });
});

  //Cottage Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("cottageReser");


  btn.addEventListener("click", () => {
    window.location.href = "#"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "./EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FoodOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FarmOrders.html"; // go to another page
  });
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

 function goBack() {
    window.history.back();
 }
 document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://greenlinklolasayong.site/api/foodProducts'); 
    const products = await response.json();
    const grid = document.getElementById('productGrid');

    
    products.forEach((product, index) => {
      productData[product.productName] = parseFloat(product.price); 
      const counterId = `counter_${product.id}`;
      window.counters[counterId] = 0;

      const card = document.createElement('div');
      card.className = "overflow-hidden transition bg-white shadow-md rounded-xl w-80 hover:shadow-xl";
      card.innerHTML = `
        <img src="${product.productPicture}" alt="${product.productName}" class="object-cover w-full h-48">
        <div class="p-4">
          <h3 class="text-lg font-semibold">${product.productName}</h3>
          <p class="text-gray-500">₱${product.price}</p>
          <div class="flex items-center mt-4 space-x-4">
            <div class="flex items-center space-x-4">
              <button type="button" class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-gray-200 rounded-full hover:bg-teal-600 hover:text-white" onclick="decrementCounter('${counterId}')">−</button>
              <span id="${counterId}" class="w-10 py-1 text-lg font-semibold text-center bg-gray-100 rounded-lg">0</span>
              <button type="button" class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-gray-200 rounded-full hover:bg-teal-600 hover:text-white" onclick="incrementCounter('${counterId}')">+</button>
            </div>
            <button type="button" class="px-4 py-2 text-white bg-teal-600 rounded-lg shadow hover:bg-teal-700" onclick="addItem('${product.productName}', '${counterId}', ${product.price})">Add Item</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load products:', error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const pickupDate = document.getElementById("pickupDate");
  const hourSelect = document.getElementById("hourSelect");
  const minuteSelect = document.getElementById("minuteSelect");
  const periodSelect = document.getElementById("periodSelect");

  const OPEN_HOUR = 7;   // 7 AM
  const CLOSE_HOUR = 20; // 8 PM

  // Get local today date
  function getLocalDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const todayStr = getLocalDateString();
  pickupDate.min = todayStr;

  // Parse date as local
  function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function populateMinutes() {
    minuteSelect.innerHTML = "";
    for (let m = 0; m < 60; m += 5) {
      const opt = document.createElement("option");
      opt.value = m.toString().padStart(2, "0");
      opt.textContent = m.toString().padStart(2, "0");
      minuteSelect.appendChild(opt);
    }
  }

  function convertTo24(hour, ampm) {
    hour = parseInt(hour);
    if (ampm === "PM" && hour !== 12) return hour + 12;
    if (ampm === "AM" && hour === 12) return 0;
    return hour;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    toastMessage.textContent = message;
    toast.style.display = "flex";
    toast.style.zIndex = 99999;
    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");
    setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0");
      setTimeout(() => { toast.style.display = "none"; }, 500);
    }, 3500);
  }

  function populateHours() {
    hourSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.textContent = "HH";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    hourSelect.appendChild(placeholder);

    const ampm = periodSelect.value;
    const hours = ampm === "AM" ? [7,8,9,10,11] : [12,1,2,3,4,5,6,7,8];

    hours.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      hourSelect.appendChild(opt);
    });

    disablePastHours();
    disablePastMinutes();
  }

  function disablePastHours() {
    if (!pickupDate.value) return;

    const now = new Date();
    const selectedDate = parseLocalDate(pickupDate.value);
    const isToday = selectedDate.toDateString() === now.toDateString();
    const ampm = periodSelect.value;

    Array.from(hourSelect.options).forEach(opt => {
      const hour24 = convertTo24(opt.value, ampm);
      if (
        hour24 < OPEN_HOUR ||
        hour24 > CLOSE_HOUR ||
        (isToday && hour24 < now.getHours())
      ) {
        opt.disabled = true;
        opt.classList.add("opacity-40");
      } else {
        opt.disabled = false;
        opt.classList.remove("opacity-40");
      }
    });

    // Check if current period has any available hours
    const hasAvailable = Array.from(hourSelect.options).some(o => !o.disabled && o.value !== "");

    if (!hasAvailable) {
      const altPeriod = ampm === "AM" ? "PM" : "AM";

      // Check if the other period has available hours
      periodSelect.value = altPeriod;
      const altHours = altPeriod === "AM" ? [7,8,9,10,11] : [12,1,2,3,4,5,6,7,8];
      hourSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.textContent = "HH";
      placeholder.value = "";
      placeholder.disabled = true;
      placeholder.selected = true;
      hourSelect.appendChild(placeholder);

      altHours.forEach(h => {
        const opt = document.createElement("option");
        opt.value = h;
        opt.textContent = h;
        hourSelect.appendChild(opt);
      });

      // Disable past hours in new period
      Array.from(hourSelect.options).forEach(opt => {
        const hour24 = convertTo24(opt.value, altPeriod);
        if (
          hour24 < OPEN_HOUR ||
          hour24 > CLOSE_HOUR ||
          (isToday && hour24 < now.getHours())
        ) {
          opt.disabled = true;
          opt.classList.add("opacity-40");
        } else {
          opt.disabled = false;
          opt.classList.remove("opacity-40");
        }
      });

      // Grey out the original period
      showToast(`⛔ No available times in ${ampm}, switched to ${altPeriod}`);
    }
  }

  function disablePastMinutes() {
    populateMinutes();
    if (!pickupDate.value || !hourSelect.value) return;

    const selectedDate = parseLocalDate(pickupDate.value);
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const selectedHour24 = convertTo24(hourSelect.value, periodSelect.value);

    Array.from(minuteSelect.options).forEach(opt => {
      const minuteVal = parseInt(opt.value);
      if (isToday && selectedHour24 === now.getHours() && minuteVal < now.getMinutes()) {
        opt.disabled = true;
        opt.classList.add("opacity-40");
      } else {
        opt.disabled = false;
        opt.classList.remove("opacity-40");
      }
    });

    const availableMinutes = Array.from(minuteSelect.options).some(o => !o.disabled);
    if (isToday && !availableMinutes) {
      let nextHour = now.getHours() + 1;

      if (nextHour > CLOSE_HOUR) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        pickupDate.value = tomorrow.toISOString().split("T")[0];
        periodSelect.value = "AM";
      } else {
        const nextPeriod = nextHour >= 12 ? "PM" : "AM";
        periodSelect.value = nextPeriod;
        populateHours();
        hourSelect.value = nextHour > 12 ? nextHour - 12 : nextHour;
      }

      disablePastMinutes();
      showToast("⛔ Current hour is almost over. Switched to next available hour.");
    }
  }

  // INITIAL LOAD
  populateMinutes();
  populateHours();

  // EVENTS
  pickupDate.addEventListener("change", populateHours);
  periodSelect.addEventListener("change", populateHours);
  hourSelect.addEventListener("change", disablePastMinutes);
});

const notes = document.getElementById("orderNotes").value;

