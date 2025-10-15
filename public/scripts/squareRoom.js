document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("id") || 1;

  if (!roomId) return;

  try {
    const response = await fetch(`https://greenlinklolasayong.site/api/rooms/${roomId}`);
    const room = await response.json();
    console.log("Loaded room:", room);

    // 🏠 Room Details
    document.getElementById("roomName").textContent = room.room_name;
    document.getElementById("roomPrice").textContent = `₱${room.price} / night`;
    document.getElementById("roomDesc").textContent = room.description;

       // ✅ Dynamically populate Pax dropdown
    const paxSelect = document.getElementById("pax");
    paxSelect.innerHTML = ""; // clear existing options

    const min = parseInt(room.min_capacity) || 1;
    const max = parseInt(room.max_capacity) || 1;

    for (let i = min; i <= max; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      paxSelect.appendChild(option);
    }

    // Add a default disabled "Select" placeholder at the top
    const placeholder = document.createElement("option");
    placeholder.textContent = "Select pax";
    placeholder.disabled = true;
    placeholder.selected = true;
    paxSelect.prepend(placeholder);

    // 🖼️ Handle Carousel Images
    let images = [];
    if (Array.isArray(room.carousel_images)) {
      images = room.carousel_images;
    } else {
      try {
        images = JSON.parse(room.carousel_images);
        if (!Array.isArray(images)) images = [room.image];
      } catch {
        images = [room.image];
      }
    }

    const carousel = document.getElementById("carousel");
    carousel.innerHTML = "";

    images.forEach((imgPath) => {
      const img = document.createElement("img");
      img.src = imgPath.replace(/\\\//g, "/");
      img.className =
        "w-full h-[400px] object-cover rounded-xl flex-shrink-0 bg-gray-100 shadow-md";
      carousel.appendChild(img);
    });

    initCarousel(images.length);

    // 🌿 Handle Amenities (moved inside async)
    const amenitiesList = document.getElementById("amenitiesList");
    if (amenitiesList) {
      let amenities = [];

      try {
        let rawAmenities = room.amenities;

        if (typeof rawAmenities === "string") {
          rawAmenities = rawAmenities.trim().replace(/\r?\n/g, "").replace(/\\r\\n/g, "");

          if (rawAmenities.startsWith("[") && rawAmenities.endsWith("]")) {
            amenities = JSON.parse(rawAmenities);
          } else {
            amenities = rawAmenities.split(",").map((item) => item.trim());
          }
        } else if (Array.isArray(rawAmenities)) {
          amenities = rawAmenities;
        }
      } catch (e) {
        console.error("Failed to parse amenities:", e, room.amenities);
      }

      if (amenities.length > 0) {
        amenitiesList.innerHTML = amenities
          .map(
            (item) => `
            <li class="flex items-center gap-3">
              <span class="text-lg text-teal-600">•</span>${item}
            </li>`
          )
          .join("");
      } else {
        amenitiesList.innerHTML = `<li class="text-gray-500 italic">No amenities listed for this room.</li>`;
      }
    }
  } catch (error) {
    console.error("Error loading room:", error);
  }
});

// ✅ Fixed carousel logic
function initCarousel(totalSlides) {
  const carousel = document.getElementById("carousel");
  const indicators = document.getElementById("indicators");
  indicators.innerHTML = "";

  let currentSlide = 0;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.style.width = dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.display = "inline-block";
    dot.style.background = i === 0 ? "teal" : "#ccc";
    dot.style.cursor = "pointer";
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      goToSlide(i);
    });
    indicators.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
  }

  function updateIndicators() {
    [...indicators.children].forEach((dot, i) => {
      dot.style.background = i === currentSlide ? "teal" : "#ccc";
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }

  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
}

// Open confirmation modal first
function openConfirmationModal() {
  const form = document.getElementById("roomBookingForm");
  const roomName = document.querySelector("#roomName").innerText;
  const price = parseFloat(document.querySelector("#roomPrice").innerText.replace(/[^\d.]/g, "")) || 0;

  const checkIn = new Date(form.querySelector("input[name='check_in_date']").value);
  const checkOut = new Date(form.querySelector("input[name='check_out_date']").value);
  const fullName = form.querySelector("input[name='full_name']").value;
  const pax = form.querySelector("select[name='pax']").value;
  const email = form.querySelector("input[name='email']").value;
  const phone = form.querySelector("input[name='phone_number']").value;

  const nights = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 1);
  const total = price * nights;

  const summaryHtml = `
    <p><strong>Room:</strong> ${roomName}</p>
    <p><strong>Price per Night:</strong> ₱${price.toLocaleString()}</p>
    <p><strong>Check-In:</strong> ${form.querySelector("input[name='check_in_date']").value}</p>
    <p><strong>Check-Out:</strong> ${form.querySelector("input[name='check_out_date']").value}</p>
    <p><strong>Nights:</strong> ${nights}</p>
    <p><strong>Total Bill:</strong> <span class="text-teal-600 font-semibold">₱${total.toLocaleString()}</span></p>
    <hr class="my-2">
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
  `;

  document.getElementById("confirmationSummary").innerHTML = summaryHtml;

  // Show confirmation modal
  document.getElementById("confirmationModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Save total for payment stage
  window.bookingDetails = { roomName, price, nights, total, fullName, pax, email, phone };
}

// Proceed to payment modal
function proceedToPayment(type) {
  const paymentModal = document.getElementById("paymentModal");
  const confirmationModal = document.getElementById("confirmationModal");
  const summary = document.getElementById("paymentSummary");

  const { roomName, price, nights, total, fullName, pax, email, phone } = window.bookingDetails;

  let finalTotal = type === "down" ? total * 0.5 : total;
  const paymentTypeLabel = type === "down" ? "50% Down Payment" : "Full Payment";

  summary.innerHTML = `
    <p><strong>Room:</strong> ${roomName}</p>
    <p><strong>Price per Night:</strong> ₱${price.toLocaleString()}</p>
    <p><strong>Nights:</strong> ${nights}</p>
    <p><strong>${paymentTypeLabel}:</strong> <span class="text-teal-600 font-semibold">₱${finalTotal.toLocaleString()}</span></p>
    <hr class="my-2">
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
  `;

  // Hide confirmation modal, show payment modal
  confirmationModal.classList.add("hidden");
  paymentModal.classList.remove("hidden");
}

// Close confirmation modal
function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  document.body.style.overflow = "auto";
}


function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
  document.body.style.overflow = "";
}

function goBack() {
  window.location.href = "../pages/RoomReser.html";
}

function openTermsModal() {
      document.getElementById('termsModal').classList.remove('hidden');
      document.getElementById('termsModal').classList.add('flex');
    }
    function closeTermsModal() {
      document.getElementById('termsModal').classList.add('hidden');
    }
    function handleReviewClick() {
      const checkbox = document.getElementById('termsCheckbox');
      if (!checkbox.checked) {
        document.getElementById('alertMessage').textContent = 'Please agree to the Terms and Conditions before proceeding.';
        document.getElementById('alertModal').classList.remove('hidden');
        return;
      }
      openPaymentModal();
    }
<<<<<<< HEAD

    // ✅ PayMongo Redirect
document.getElementById("payNowBtn").addEventListener("click", async () => {
  const form = document.getElementById("roomBookingForm");
  const data = {
    room: document.querySelector("#roomName").innerText,
    check_in_date: form.querySelector("input[name='check_in_date']").value,
    check_out_date: form.querySelector("input[name='check_out_date']").value,
    full_name: form.querySelector("input[name='full_name']").value,
    email: form.querySelector("input[name='email']").value,
    phone_number: form.querySelector("input[name='phone_number']").value,
    pax: form.querySelector("select[name='pax']").value,
    total_bill: finalTotal,
    payment_method: selectedPaymentType === "down" ? "Down Payment" : "Full Payment",
  };

  try {
    const response = await fetch("https://greenlinklolasayong.site/api/create-room-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.checkout_url) {
      window.location.href = result.checkout_url;
    } else {
      alert("Payment initialization failed.");
      console.error(result);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred while processing your payment.");
  }
});
=======
    document.addEventListener("DOMContentLoaded", () => {
  const checkInInput = document.querySelector("input[name='check_in_date']");
  const checkOutInput = document.querySelector("input[name='check_out_date']");

  if (!checkInInput || !checkOutInput) return;

  // 🔒 Disable past dates for both inputs
  const today = new Date().toISOString().split("T")[0];
  checkInInput.min = today;
  checkOutInput.min = today;

  // 🗓️ When check-in date changes
  checkInInput.addEventListener("change", () => {
    const checkInDate = new Date(checkInInput.value);

    if (isNaN(checkInDate)) return;

    // Update checkout minimum to be at least the next day
    const minCheckOut = new Date(checkInDate);
    minCheckOut.setDate(minCheckOut.getDate() + 1);

    const minCheckOutStr = minCheckOut.toISOString().split("T")[0];
    checkOutInput.min = minCheckOutStr;

    // If checkout date is invalid or same day → auto-adjust it
    if (!checkOutInput.value || new Date(checkOutInput.value) <= checkInDate) {
      checkOutInput.value = minCheckOutStr;
    }
  });

  // 🗓️ When checkout changes (just safety check)
  checkOutInput.addEventListener("change", () => {
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);

    // If checkout = checkin → push to next day
    if (checkOutDate <= checkInDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.value = nextDay.toISOString().split("T")[0];
    }
  });
});
>>>>>>> c1fec426765279b59f4d71042c34c5d0089ed9a9
