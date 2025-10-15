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

let selectedPaymentType = null;
let totalBill = 0;
let fullBill = 0;

// ✅ Show confirmation modal
function openConfirmationModal() {
  const form = document.getElementById("roomBookingForm");
  const room = document.querySelector("#roomName").innerText;
  const check_in = form.querySelector("input[name='check_in_date']").value;
  const check_out = form.querySelector("input[name='check_out_date']").value;
  const pax = form.querySelector("select[name='pax']").value;

  // Calculate total days
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  const timeDiff = checkOutDate - checkInDate;
  const days = Math.max(timeDiff / (1000 * 3600 * 24), 1);

  const roomPrice = parseFloat(document.getElementById("roomPrice").innerText.replace(/[₱,/night\s]/g, ""));
  fullBill = roomPrice * days;

  const summaryHtml = `
    <p><strong>Room:</strong> ${room}</p>
    <p><strong>Check-In:</strong> ${check_in}</p>
    <p><strong>Check-Out:</strong> ${check_out}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Days:</strong> ${days}</p>
    <p class="mt-2 font-semibold text-teal-700">Full Bill: ₱${fullBill.toLocaleString()}</p>
  `;
  document.getElementById("confirmationSummary").innerHTML = summaryHtml;
  document.getElementById("confirmationModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  document.body.style.overflow = "";
}

// ✅ Proceed to payment modal
function proceedToPayment(type) {
  selectedPaymentType = type;
  totalBill = type === "down" ? fullBill * 0.5 : fullBill;

  document.getElementById("confirmationModal").classList.add("hidden");
  const paymentSummaryHtml = `
    <p><strong>Payment Method:</strong> ${type === "down" ? "Down Payment (50%)" : "Full Payment"}</p>
    <p><strong>Total Bill:</strong> ₱${totalBill.toLocaleString()}</p>
  `;
  document.getElementById("paymentSummary").innerHTML = paymentSummaryHtml;
  document.getElementById("paymentModal").classList.remove("hidden");
}

function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
  document.body.style.overflow = "";
}

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
    total_bill: totalBill,
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


