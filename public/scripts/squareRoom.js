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

let selectedPaymentType = "full"; 
let computedBill = 0; 
let originalTotal = 0;

// 🟢 Open Confirmation Modal
function openConfirmationModal() {
  const form = document.getElementById("roomBookingForm");
  const formData = new FormData(form);

  const checkIn = formData.get("check_in_date");
  const checkOut = formData.get("check_out_date");
  const pax = formData.get("pax");
  const name = formData.get("full_name");
  const email = formData.get("email");
  const phone = formData.get("phone_number");

  if (!checkIn || !checkOut || !pax || !name || !email || !phone) {
    alert("Please complete all booking details before proceeding.");
    return;
  }

  const priceText = document.getElementById("roomPrice").textContent.replace(/[₱,/ ]/g, "");
  const nightlyRate = parseFloat(priceText) || 0;

  const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  originalTotal = nightlyRate * days;

  const summaryHTML = `
    <p><strong>Room:</strong> ${document.getElementById("roomName").textContent}</p>
    <p><strong>Check-in:</strong> ${checkIn}</p>
    <p><strong>Check-out:</strong> ${checkOut}</p>
    <p><strong>Nights:</strong> ${days}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Total Bill:</strong> ₱${originalTotal.toLocaleString()}</p>
  `;

  document.getElementById("confirmationSummary").innerHTML = summaryHTML;

  document.getElementById("confirmationModal").classList.remove("hidden");
}

// 🟢 Close Confirmation Modal
function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
}

// 🟢 Proceed to Payment Modal (handles 50% or 100%)
function proceedToPayment(type) {
  selectedPaymentType = type;
  closeConfirmationModal();

  const finalBill = type === "down" ? originalTotal * 0.5 : originalTotal;
  computedBill = finalBill;

  const updatedSummary =
    document.getElementById("confirmationSummary").innerHTML +
    `<p class="mt-3 font-semibold text-center text-teal-700">
      ${type === "down" ? "Down Payment (50%)" : "Full Payment (100%)"}: ₱${finalBill.toLocaleString()}
    </p>`;

  document.getElementById("paymentSummary").innerHTML = updatedSummary;

  document.getElementById("paymentModal").classList.remove("hidden");
}

// 🟢 Close Payment Modal
function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
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

    // Handle Room Payment

  document.querySelector("#paymentModal button").addEventListener("click", async () => {
  const form = document.getElementById("roomBookingForm");
  const formData = new FormData(form);
  const userId = localStorage.getItem("user_id") || null;
  const roomId = new URLSearchParams(window.location.search).get("id");

  const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
  const roomReserId = `ROOM-${Date.now()}${randomSuffix}`;
  const referenceNo = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const data = {
    user_id: userId,
    room_reser_id: roomReserId,
    room_id: roomId,
    check_in_date: formData.get("check_in_date"),
    check_out_date: formData.get("check_out_date"),
    pax: formData.get("pax"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number"),
    total_bill: computedBill,
    payment_method: selectedPaymentType === "down" ? "Down Payment" : "Full Payment",
    payment_status: "Pending",
    reference_no: referenceNo,
  };

  try {
    const response = await fetch("/create-room-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status === "success" && result.redirect_url) {
      window.location.href = result.redirect_url; // redirect to PayMongo
    } else {
      alert("Payment creation failed. Please try again.");
      console.error(result);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
});