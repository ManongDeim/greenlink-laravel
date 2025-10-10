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
    document.body.classList.add("overflow-hidden"); // disable scroll
    
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cashPayment").addEventListener("click", () => {
    sendOrder("Cash");
  });

});

// Send to Laravel

function sendOrder(paymentMethod) {
  let orderData = cart.map(item => ({
    name: item.name,
    qty: item.qty,
    price: getPrice(item.name)
  }));

  fetch("http://greenlinklolasayong.site/api/foodOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cart: orderData,
      payment_method: paymentMethod
    })
  })
  .then(res => res.json())
  .then(data => {
    showAlert("✅ " + data.message + " (" + paymentMethod + ")");
    cart = [];
    updateCartBadge();
    closePaymentModal();
  })
  .catch(err => console.error("Error:", err));
}

// Price list
function getPrice(itemName) {
  switch(itemName) {
    case "Smoked Fish": return 190;
    case "Deviled Fish": return 190;
    case "SeaSig": return 190;
    case "Blue Craze": return 190;
    case "Chicken Sheet": return 190;
    case "Black Meal": return 190;
    default: return 0;
  }
}

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