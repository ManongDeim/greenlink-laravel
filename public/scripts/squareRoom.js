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

async function openConfirmationModal() {
  const form = document.getElementById("roomBookingForm");
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("id") || 1;

  try {
    const response = await fetch(`https://greenlinklolasayong.site/api/rooms/${roomId}`);
    const room = await response.json();

    const check_in_date = form.querySelector("input[name='check_in_date']").value;
    const check_out_date = form.querySelector("input[name='check_out_date']").value;
    const fullName = form.querySelector("input[name='full_name']").value;
    const pax = form.querySelector("select[name='pax']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone_number']").value;

    if (!check_in_date || !check_out_date) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const diffTime = Math.abs(checkOut - checkIn);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const totalBill = room.price * nights;

    const summaryHtml = `
      <p><strong>Room:</strong> ${room.room_name}</p>
      <p><strong>Price per Night:</strong> ₱${room.price.toLocaleString()}</p>
      <p><strong>Check-In:</strong> ${check_in_date}</p>
      <p><strong>Check-Out:</strong> ${check_out_date}</p>
      <p><strong>Nights:</strong> ${nights}</p>
      <p><strong>Total Bill:</strong> <span class="text-teal-700 font-semibold">₱${totalBill.toLocaleString()}</span></p>
      <hr class="my-2">
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Pax:</strong> ${pax}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `;

    // Show summary in confirmation modal
    document.getElementById("confirmationSummary").innerHTML = summaryHtml;
    document.getElementById("confirmationModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Also store summary for reuse in payment modal
    window.latestSummaryHtml = summaryHtml;

  } catch (error) {
    console.error("Error loading room details:", error);
    alert("Failed to load room details. Please try again.");
  }
}

function proceedToPayment() {
  // Reuse same summary content
  document.getElementById("paymentSummary").innerHTML = window.latestSummaryHtml || "";
  
  // Switch modals
  document.getElementById("confirmationModal").classList.add("hidden");
  document.getElementById("paymentModal").classList.remove("hidden");
}

function closeConfirmationModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  document.body.style.overflow = "";
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
