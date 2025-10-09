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
    }, 500); 
  }, 3000);
    }

 

    let cart = [];

// Add item to cart
function addItem(itemName, counterId, price) {
  event.preventDefault();
  let qty = parseInt(document.getElementById(counterId).textContent);

  if (qty > 0) {
    let existing = cart.find(c => c.name === itemName);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name: itemName, qty: qty, price: getPrice(itemName) });
    }

    // reset counter
    document.getElementById(counterId).textContent = 0;
    counters[counterId] = 0;

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

// Open modal
function openModal() {
  updateModal();
  document.getElementById("checkoutModal").classList.remove("hidden");
}

// Close modal
function closeModal() {
  document.getElementById("checkoutModal").classList.add("hidden");
}



// Update modal live
function updateModal() {
  let cartSummary = document.getElementById("cartSummary");
  let cartTotal = document.getElementById("cartTotal");
  cartSummary.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let price = parseFloat(item.price || getPrice(item.name));
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

  showToast("Item removed from cart.");
}

// Confirm order
function confirmOrder() {
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
    
}


// --- Send to Laravel + login guard ---
async function sendOrder(paymentMethod) {
  console.log("sendOrder triggered with:", paymentMethod);

 if (!window.userId) {
    try {
      const userRes = await fetch("https://greenlinklolasayong.site/api/user", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!userRes.ok) {
        console.error("Failed to fetch user:", await userRes.text());
        openLoginModal();
        return;
      }

      const user = await userRes.json();
      window.userId = user.id || user.user_id;
      console.log("✅ Retrieved user_id:", window.userId);
    } catch (err) {
      console.error("Error fetching user info:", err);
      openLoginModal();
      return;
    }
  }

  if (!window.isLoggedIn) {
    openLoginModal();
    return;
  }

  const orderData = cart.map((item) => ({
    name: item.name,
    qty: item.qty,
    price: getPrice(item.name),
  }));

  console.log("Sending order with user_id:", window.userId);

  console.log("Sending order with user_id:", userId);

  fetch("http://greenlinklolasayong.site/api/farmOrder/create-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      cart: orderData,
      payment_method: paymentMethod,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("PayMongo response:", data);
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        showAlert("No payment URL returned.");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      showAlert("Failed to place order.");
    });
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


 

// Price list
function getPrice(itemName) {
  return parseFloat(productData[itemName]) || 0;
}


  //Modals
  
  function openReserModal() {
      document.getElementById('reservationModal').classList.remove('hidden');
    }
    function closeReserModal() {
      document.getElementById('reservationModal').classList.add('hidden');
    }

    function openOrderModal() {
      document.getElementById('orderModal').classList.remove('hidden');
    }
    function closeOrderModal() {
      document.getElementById('orderModal').classList.add('hidden');
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

  document.addEventListener("DOMContentLoaded", () => {
  const navButtons = {
    roomReser: "./roomReser.html",
    eventReser: "./eventReser.html",
    roomReser: "./RoomReser.html",
    eventReser: "./EventReser.html",
    foodOrder: "./FoodOrders.html",
    farmOrder: "./FarmOrders.html",
  };

  Object.entries(navButtons).forEach(([id, target]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); // stop accidental form submits
        if (window.location.pathname.endsWith(target)) {
          // already on that page, do nothing
          return;
        }
        window.location.href = target;
      });
    }
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
    const response = await fetch('https://greenlinklolasayong.site/api/farmProducts'); 
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
