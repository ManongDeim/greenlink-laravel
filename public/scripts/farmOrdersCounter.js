// ==========================================
// 1. GLOBAL VARIABLES & STATE
// ==========================================
let productData = {};
let userId = null;
window.counters = {};
let cart = [];
let hasDiscount = false;
window.currentScheduledTime = null;

// ==========================================
// 2. GLOBAL HELPER FUNCTIONS
// (Must be outside DOMContentLoaded to work with HTML onclick="")
// ==========================================

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
    toast.style.display = "flex";
    toast.style.zIndex = 99999;

    setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
        setTimeout(() => {
            toast.classList.add("hidden");
            toast.style.display = "none";
        }, 500);
    }, 3000);
}

// Add item to cart
function addItem(itemName, counterId, price) {
    event.preventDefault();
    let qty = parseInt(document.getElementById(counterId).textContent);

    if (qty > 0) {
        let existing = cart.find(c => c.name === itemName);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                name: itemName,
                qty: qty,
                price: getPrice(itemName)
            });
        }

        // reset counter
        document.getElementById(counterId).textContent = 0;
        window.counters[counterId] = 0;

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

// Modal Helpers
function openModal() {
    updateModal();
    document.getElementById("checkoutModal").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
}

function closeModal() {
    document.getElementById("checkoutModal").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
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

// Confirm order (Setup logic before payment)
function confirmOrder() {
    if (cart.length === 0) {
        showAlert("Your cart is empty!");
        return;
    }

    // 1. Get Date and Time values
    const date = document.getElementById("pickupDate").value;
    const hour = document.getElementById("hourSelect").value;
    const minute = document.getElementById("minuteSelect").value;
    const period = document.getElementById("periodSelect").value; // AM or PM

    if (!date || !hour || !minute) {
        alert("Please select both date and time before confirming.");
        return;
    }

    // 2. Convert to 24-hour format for the Database
    let hour24 = parseInt(hour);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    // Format: YYYY-MM-DD HH:mm:ss
    const scheduledDateTime = `${date} ${String(hour24).padStart(2, '0')}:${minute}:00`;

    // 3. Store this in a global variable
    window.currentScheduledTime = scheduledDateTime;

    // Show Summary
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
    </div>
    <div class="mt-2 text-sm text-gray-600 text-center border-t pt-2">
      Pickup: ${date} @ ${hour}:${minute} ${period}
    </div>`;

    document.getElementById("paymentSummary").innerHTML = summary;

    closeModal(); // Close Cart Modal
    document.getElementById("paymentModal").classList.remove("hidden"); // Open Payment Modal
}

// Send to Laravel + login guard
async function sendOrder(paymentMethod) {
    console.group("🚀 Debug: sendOrder Initiated");
    console.log("1. Payment Method Selected:", paymentMethod);

    // 1. Login Check
    if (!window.userId) {
        console.log("2. User ID missing, fetching info...");
        try {
            const userRes = await fetch("/api/user-info", {
                credentials: "include",
                headers: {
                    Accept: "application/json"
                },
            });

            if (!userRes.ok) {
                console.error("❌ Failed to fetch user:", await userRes.text());
                openLoginModal();
                console.groupEnd();
                return;
            }

            const data = await userRes.json();
            window.userId = data.user.id;
            window.hasDiscount = (data.user.id_status === "Validated");
            console.log("✅ User ID Retrieved:", window.userId);
        } catch (err) {
            console.error("❌ Error fetching user info:", err);
            openLoginModal();
            console.groupEnd();
            return;
        }
    } else {
        console.log("2. User ID already present:", window.userId);
    }

    // 2. Prepare Payload
    const orderData = cart.map(item => {
        let price = getPrice(item.name);
        if (window.hasDiscount) price *= 0.8;
        return {
            name: item.name,
            qty: item.qty,
            price
        };
    });

    const payload = {
        user_id: window.userId,
        cart: orderData,
        payment_method: paymentMethod,
        scheduled_datetime: window.currentScheduledTime
    };

    console.log("3. Payload prepared:", payload);

    // 3. Send Fetch Request
    try {
        console.log("4. Sending POST request to /api/farmOrder/create-link...");
        
        const res = await fetch("/api/farmOrder/create-link", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("5. HTTP Response Status:", res.status);
        
        const data = await res.json();
        console.log("6. API Response Body:", data);

        // 4. Handle Response
        if (paymentMethod === 'Cash' && data.success) {
            console.log("✅ Cash Success Condition Met. Redirecting...");
            window.location.href = "../pages/paymentSuccess.html";
        } else if (data.payment_url) {
            console.log("✅ PayMongo Success Condition Met. Redirecting...");
            window.location.href = data.payment_url;
        } else {
            console.warn("⚠️ Response success was false or missing URL:", data);
            showAlert(data.message || "No payment URL returned.");
        }

    } catch (err) {
        console.error("❌ Fetch/Network Error:", err);
        showAlert("Failed to place order.");
    }
    console.groupEnd();
}

// Price list helper
function getPrice(itemName) {
    return parseFloat(productData[itemName]) || 0;
}

// Modal Toggle Helpers
function openReserModal() {
    document.getElementById('reservationModal').classList.remove('hidden');
    document.body.classList.add("overflow-hidden");
}

function closeReserModal() {
    document.getElementById('reservationModal').classList.add('hidden');
    document.body.classList.remove("overflow-hidden");
}

function openOrderModal() {
    document.getElementById('orderModal').classList.remove('hidden');
    document.body.classList.add("overflow-hidden");
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.add('hidden');
    document.body.classList.remove("overflow-hidden");
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

function goBack() {
    window.history.back();
}


// ==========================================
// 3. MAIN INITIALIZATION (Single DOMContentLoaded)
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {

    // --- A. Navigation Buttons ---
    const navButtons = {
        roomReser: "./RoomReser.html",
        eventReser: "./EventReser.html",
        foodOrder: "./FoodOrders.html",
        farmOrder: "./FarmOrders.html",
    };

    Object.entries(navButtons).forEach(([id, target]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!window.location.pathname.endsWith(target)) {
                    window.location.href = target;
                }
            });
        }
    });

    // --- B. Checkout Buttons ---
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                showAlert("Your cart is empty.");
                return;
            }
            openModal();
        });
    }

    // PayMongo Button
    // DEBUGGING: Check if buttons exist
    const paymongoBtn = document.getElementById("paymongoBtn");
    const cashBtn = document.getElementById("cashBtn");

    console.log("Buttons Check:", { 
        paymongoBtn: paymongoBtn ? "Found" : "Missing", 
        cashBtn: cashBtn ? "Found" : "Missing" 
    });

    // PayMongo Button Listener
    if (paymongoBtn) {
        paymongoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🖱️ PayMongo Button Clicked");
            sendOrder("PayMongo");
        });
    }

    // Cash Button Listener
    if (cashBtn) {
        cashBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🖱️ Cash Button Clicked");
            if (!confirm("Proceed with Cash Payment? You will pay at the farm.")) {
                console.log("❌ Cash Confirmation Cancelled");
                return;
            }
            sendOrder("Cash");
        });
    }

    // --- C. Close Modals (Outside Click / ESC) ---
    document.addEventListener("click", function(event) {
        const reservationModal = document.getElementById("reservationModal");
        const orderModal = document.getElementById("orderModal");

        if (reservationModal && !reservationModal.classList.contains("hidden") && event.target === reservationModal) {
            closeReserModal();
        }
        if (orderModal && !orderModal.classList.contains("hidden") && event.target === orderModal) {
            closeOrderModal();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeReserModal();
            closeOrderModal();
        }
    });

    // --- D. Fetch Products ---
    try {
        const response = await fetch('/api/farmProducts');
        const products = await response.json();
        const grid = document.getElementById('productGrid');

        if (grid) {
            products.forEach((product) => {
                const isUnavailable = product.inventory_status === "Restock Needed";
                productData[product.productName] = parseFloat(product.price);
                const counterId = `counter_${product.id}`;
                window.counters[counterId] = 0;

                const card = document.createElement('div');
                card.className = `
          overflow-hidden transition shadow-md rounded-xl w-80 hover:shadow-xl 
          ${isUnavailable ? "bg-gray-200 opacity-50 pointer-events-none grayscale" : "bg-white"}
        `;

                card.innerHTML = `
          <div class="relative">
            <img src="${product.productPicture}" alt="${product.productName}" class="object-cover w-full h-48">
            ${isUnavailable ? `<span class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">Unavailable</span>` : ""}
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold">${product.productName}</h3>
            <p class="text-gray-500">
             ₱${product.price} 
             ${product.measurement ? `<span class="text-sm text-gray-400 ml-1">(${product.measurement})</span>` : ""}
            </p>
            <div class="flex items-center mt-4 space-x-4">
              <div class="flex items-center space-x-4">
                <button type="button" class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-gray-200 rounded-full ${isUnavailable ? "cursor-not-allowed" : "hover:bg-teal-600 hover:text-white"}" ${isUnavailable ? "disabled" : ""} onclick="decrementCounter('${counterId}')">−</button>
                <span id="${counterId}" class="w-10 py-1 text-lg font-semibold text-center bg-gray-100 rounded-lg">0</span>
                <button type="button" class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-gray-200 rounded-full ${isUnavailable ? "cursor-not-allowed" : "hover:bg-teal-600 hover:text-white"}" ${isUnavailable ? "disabled" : ""} onclick="incrementCounter('${counterId}')">+</button>
              </div>
              <button type="button" class="px-4 py-2 text-white rounded-lg shadow ${isUnavailable ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}" ${isUnavailable ? "disabled" : ""} onclick="addItem('${product.productName}', '${counterId}', ${product.price})">
                ${isUnavailable ? "Unavailable" : "Add Item"}
              </button>
            </div>
          </div>
        `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Failed to load products:', error);
    }

    // --- E. Date & Time Logic ---
    const pickupDate = document.getElementById("pickupDate");
    const hourSelect = document.getElementById("hourSelect");
    const minuteSelect = document.getElementById("minuteSelect");
    const periodSelect = document.getElementById("periodSelect");

    if (pickupDate && hourSelect && minuteSelect && periodSelect) {
        const OPEN_HOUR = 7;
        const CLOSE_HOUR = 20;

        function getLocalDateString() {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, "0");
            const d = String(now.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }

        const todayStr = getLocalDateString();
        pickupDate.min = todayStr;

        function parseLocalDate(dateStr) {
            const [y, m, d] = dateStr.split("-").map(Number);
            return new Date(y, m - 1, d);
        }

        function populateMinutes() {
            minuteSelect.innerHTML = "";
            for (let m = 0; m < 60; m += 5) {
                const opt = document.createElement("option");
                const val = m.toString().padStart(2, "0");
                opt.value = val;
                opt.textContent = val;
                minuteSelect.appendChild(opt);
            }
        }

        function convertTo24(hour, ampm) {
            hour = parseInt(hour);
            if (ampm === "PM" && hour !== 12) return hour + 12;
            if (ampm === "AM" && hour === 12) return 0;
            return hour;
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
            const hours = ampm === "AM" ? [7, 8, 9, 10, 11] : [12, 1, 2, 3, 4, 5, 6, 7, 8];

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
                if (hour24 < OPEN_HOUR || hour24 > CLOSE_HOUR || (isToday && hour24 < now.getHours())) {
                    opt.disabled = true;
                    opt.classList.add("opacity-40");
                } else {
                    opt.disabled = false;
                    opt.classList.remove("opacity-40");
                }
            });

            const hasAvailable = Array.from(hourSelect.options).some(o => !o.disabled && o.value !== "");
            if (!hasAvailable) {
                const altPeriod = ampm === "AM" ? "PM" : "AM";
                periodSelect.value = altPeriod;
                populateHours(); // Recursive but safe
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
        }

        // Init
        populateMinutes();
        populateHours();

        // Listeners
        pickupDate.addEventListener("change", populateHours);
        periodSelect.addEventListener("change", populateHours);
        hourSelect.addEventListener("change", disablePastMinutes);
    }
});