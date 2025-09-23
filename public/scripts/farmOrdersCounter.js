// Store counters for all 6 items
    const counters = { counter1: 0, counter2: 0, counter3: 0, counter4: 0, counter5: 0, counter6: 0 };

    function incrementCounter(id) {
      counters[id]++;
      document.getElementById(id).textContent = counters[id];
    }

    function decrementCounter(id) {
      if (counters[id] > 0) {
        counters[id]--;
        document.getElementById(id).textContent = counters[id];
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



// Send to Laravel

function sendOrder(paymentMethod) {

  console.log("sendOrder triggered with:", paymentMethod);

  let orderData = cart.map(item => ({
    name: item.name,
    qty: item.qty,
    price: getPrice(item.name)
  }));

  console.log("Sending to backend:", {
  cart: orderData,
  payment_method: paymentMethod
});

  fetch("http://127.0.0.1:8000/api/farmOrder/create-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      cart: orderData,
      payment_method: paymentMethod
    })
  })
  .then(res => res.json())
.then(data => {
  console.log("PayMongo response:", data); // 👀 debug in console
  if (data.payment_url) {
    window.location.href = data.payment_url; // ✅ redirect to PayMongo checkout
  } else {
    showAlert("No payment URL returned.");
  }
})
.catch(err => {
  console.error("Error:", err);
  showAlert("Failed to place order.");
});
  
}

document.addEventListener("DOMContentLoaded", () => {
document.getElementById("checkoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
     if (cart.length === 0) {
    showAlert("Your cart is empty.");
    return;
  }
    openModal(); // this shows the modal with Cash & GCash options
  });

   const gcashBtn = document.getElementById("gcashPayment");
  if (gcashBtn) {
    gcashBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("✅ GCash button clicked");
      sendOrder("GCash");
    });
  } else {
    console.error("❌ GCash button not found in DOM");
  }
});

 

// Price list
function getPrice(itemName) {
  switch(itemName) {
    case "Bangus": return 200;
    case "Egg": return 8.5;
    case "Mud Crab": return 240;
    case "Native Chicken": return 350;
    case "Native Pork": return 350;
    case "Squash": return 100;
    default: return 0;
  }
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



