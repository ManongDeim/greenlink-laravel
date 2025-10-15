document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("id") || 1;

  try {
    const response = await fetch(`https://greenlinklolasayong.site/api/rooms/${roomId}`);
    const room = await response.json();
    console.log("Loaded room:", room);

    // 🏠 Room Details
    document.getElementById("roomName").textContent = room.room_name;
    document.getElementById("roomPrice").textContent = `₱${room.price} / night`;
    document.getElementById("roomDesc").textContent = room.description;

    // ✅ Pax Dropdown
    const paxSelect = document.getElementById("pax");
    paxSelect.innerHTML = "";
    const min = parseInt(room.min_capacity) || 1;
    const max = parseInt(room.max_capacity) || 1;
    for (let i = min; i <= max; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      paxSelect.appendChild(option);
    }
    const placeholder = document.createElement("option");
    placeholder.textContent = "Select pax";
    placeholder.disabled = true;
    placeholder.selected = true;
    paxSelect.prepend(placeholder);

    // 🖼️ Carousel
    const carousel = document.getElementById("carousel");
    if (carousel) {
      let images = [];
      try {
        images = Array.isArray(room.carousel_images)
          ? room.carousel_images
          : JSON.parse(room.carousel_images);
      } catch {
        images = [room.image];
      }
      carousel.innerHTML = "";
      images.forEach((imgPath) => {
        const img = document.createElement("img");
        img.src = imgPath.replace(/\\\//g, "/");
        img.className = "w-full h-[400px] object-cover rounded-xl flex-shrink-0 bg-gray-100 shadow-md";
        carousel.appendChild(img);
      });
      initCarousel(images.length);
    }

    // 🌿 Amenities
    const amenitiesList = document.getElementById("amenitiesList");
    if (amenitiesList) {
      let amenities = [];
      try {
        let raw = room.amenities;
        if (typeof raw === "string") {
          raw = raw.trim().replace(/\r?\n/g, "").replace(/\\r\\n/g, "");
          if (raw.startsWith("[") && raw.endsWith("]")) amenities = JSON.parse(raw);
          else amenities = raw.split(",").map((a) => a.trim());
        } else if (Array.isArray(raw)) amenities = raw;
      } catch (e) {
        console.error("Failed to parse amenities:", e);
      }

      amenitiesList.innerHTML = amenities.length
        ? amenities.map((a) => `<li class="flex items-center gap-3"><span class="text-lg text-teal-600">•</span>${a}</li>`).join("")
        : `<li class="text-gray-500 italic">No amenities listed for this room.</li>`;
    }
  } catch (err) {
    console.error("Error loading room:", err);
  }
});

// ✅ Carousel logic
function initCarousel(totalSlides) {
  const carousel = document.getElementById("carousel");
  const indicators = document.getElementById("indicators");
  if (!carousel || !indicators) return;
  indicators.innerHTML = "";
  let currentSlide = 0;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.className = "inline-block w-3 h-3 mx-1 rounded-full cursor-pointer";
    dot.style.background = i === 0 ? "teal" : "#ccc";
    dot.addEventListener("click", () => goToSlide(i));
    indicators.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
  }

  function updateDots() {
    [...indicators.children].forEach((dot, i) => {
      dot.style.background = i === currentSlide ? "teal" : "#ccc";
    });
  }

  window.nextSlide = () => goToSlide((currentSlide + 1) % totalSlides);
  window.prevSlide = () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

let selectedPaymentType = null;
let totalBill = 0;
let fullBill = 0;

// ✅ Confirmation Modal
function openConfirmationModal() {
  const form = document.getElementById("roomBookingForm");
  const room = document.querySelector("#roomName").innerText;
  const check_in = form.querySelector("input[name='check_in_date']").value;
  const check_out = form.querySelector("input[name='check_out_date']").value;
  const pax = form.querySelector("select[name='pax']").value;

  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  const days = Math.max((checkOutDate - checkInDate) / (1000 * 3600 * 24), 1);

  const price = parseFloat(document.getElementById("roomPrice").innerText.replace(/[₱,/night\s]/g, ""));
  fullBill = price * days;

  const summary = `
    <p><strong>Room:</strong> ${room}</p>
    <p><strong>Check-In:</strong> ${check_in}</p>
    <p><strong>Check-Out:</strong> ${check_out}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Days:</strong> ${days}</p>
    <p class="mt-2 font-semibold text-teal-700">Full Bill: ₱${fullBill.toLocaleString()}</p>
  `;
  document.getElementById("confirmationSummary").innerHTML = summary;
  document.getElementById("confirmationModal").classList.remove("hidden");
}

function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
}

// ✅ Payment Modal
function proceedToPayment(type) {
  selectedPaymentType = type;
  totalBill = type === "down" ? fullBill * 0.5 : fullBill;

  document.getElementById("confirmationModal").classList.add("hidden");
  const summary = `
    <p><strong>Payment Method:</strong> ${type === "down" ? "Down Payment (50%)" : "Full Payment"}</p>
    <p><strong>Total Bill:</strong> ₱${totalBill.toLocaleString()}</p>
  `;
  document.getElementById("paymentSummary").innerHTML = summary;
  document.getElementById("paymentModal").classList.remove("hidden");
}

function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
}

// ✅ PayMongo Redirect + Save Booking
document.getElementById("payNowBtn").addEventListener("click", async () => {
  const form = document.getElementById("roomBookingForm");

  const payload = {
    room: document.querySelector("#roomName").innerText,
    check_in_date: form.querySelector("input[name='check_in_date']").value,
    check_out_date: form.querySelector("input[name='check_out_date']").value,
    full_name: form.querySelector("input[name='full_name']").value,
    email: form.querySelector("input[name='email']").value,
    phone_number: form.querySelector("input[name='phone_number']").value,
    pax: form.querySelector("select[name='pax']").value,
    total_bill: totalBill,
    payment_method: selectedPaymentType === "down" ? "Down Payment" : "Full Payment",
  };

  try {
    const response = await fetch("https://greenlinklolasayong.site/api/create-room-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result);

    if (result.checkout_url) {
      window.location.href = result.checkout_url;
    } else {
      alert("Payment initialization failed.");
    }
  } catch (err) {
    console.error("Payment error:", err);
    alert("An error occurred while processing your payment.");
  }
});
