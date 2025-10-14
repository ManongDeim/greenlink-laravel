// === Dynamic Room Data Loader ===

// Get room ID from URL (e.g. roomBooking.html?id=2)
const params = new URLSearchParams(window.location.search);
const roomId = params.get("id") || 1; // default fallback room ID

async function loadRoomData() {
  try {
    const response = await fetch(`https://greenlinklolasayong.site/api/rooms/${roomId}`);
    if (!response.ok) throw new Error("Failed to fetch room data");

    const room = await response.json();

    // --- Update room name ---
    document.getElementById("roomName").textContent = room.room_name;
    document.getElementById("roomInput").value = room.room_name;

    // --- Update price ---
    const priceElement = document.querySelector(".text-teal-800");
    if (priceElement) {
      priceElement.innerHTML = `Only ₱${room.price.toLocaleString()} <span class="font-medium text-gray-600">/ night</span>`;
    }

    // --- Update description / amenities (if needed) ---
    // You can add dynamic updates here if you have room-specific amenities

    // --- Build Carousel ---
    const carousel = document.getElementById("carousel");
    const indicators = document.getElementById("indicators");

    carousel.innerHTML = ""; // clear existing images
    indicators.innerHTML = "";

    room.carousel_images.forEach((imgUrl, index) => {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = `${room.name} image ${index + 1}`;
      img.className = "w-full h-[400px] object-cover rounded-xl flex-shrink-0 bg-gray-100 shadow-md";
      carousel.appendChild(img);

      // Add indicator dot
      const dot = document.createElement("span");
      dot.style.width = dot.style.height = "10px";
      dot.style.borderRadius = "50%";
      dot.style.display = "inline-block";
      dot.style.background = index === 0 ? "teal" : "#ccc";
      dot.addEventListener("click", () => goToSlide(index));
      indicators.appendChild(dot);
    });

    // Reinitialize carousel logic
    initializeCarousel();

  } catch (error) {
    console.error("Error loading room data:", error);
    showAlert("Unable to load room details. Please try again later.");
  }
}

// --- Carousel setup logic (wrapped in a function so it can be re-initialized) ---
function initializeCarousel() {
  const carousel = document.getElementById("carousel");
  const slides = carousel.querySelectorAll("img");
  const indicators = document.getElementById("indicators");
  let currentSlide = 0;

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
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
  }

  // Auto slide
  setInterval(nextSlide, 3000);

  // Expose these globally (so your buttons still work)
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.goToSlide = goToSlide;
}

document.addEventListener("DOMContentLoaded", loadRoomData);


//Carousel Script
const carousel = document.getElementById("carousel");
  const slides = carousel.querySelectorAll("img");
  const indicators = document.getElementById("indicators");

  let currentSlide = 0;

  // Create indicators
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.style.width = dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.display = "inline-block";
    dot.style.background = i === 0 ? "teal" : "#ccc";
    dot.addEventListener("click", () => goToSlide(i));
    indicators.appendChild(dot);
  });

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
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  setInterval(nextSlide, 3000); // Auto slide every 3s
  function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(currentSlide);
}

function openPaymentModal() {

    const form = document.getElementById("roomBookingForm");

    const room = document.querySelector("#roomName").innerText;
    const check_in_date = form.querySelector("input[name='check_in_date']").value;
    const check_out_date = form.querySelector("input[name='check_out_date']").value;
    const fullName = form.querySelector("input[name='full_name']").value;
    const pax = form.querySelector("select[name='pax']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone_number']").value;

    // Build summary HTML 
    const summaryHtml = `
    <p><strong>Cottage:</strong> ${room}</p>
    <p><strong>Check-In:</strong> ${check_in_date}</p>
    <p><strong>Check-Out:</strong> ${check_out_date}</p>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    `;

      // Insert into modal
      document.getElementById("paymentSummary").innerHTML = summaryHtml;

      // Open modal
      document.getElementById('paymentModal').classList.remove('hidden');
       document.body.style.overflow = 'hidden';
    }
    function closePaymentModal() {
      document.getElementById('paymentModal').classList.add('hidden');
       document.body.style.overflow = '';
    }

    
    function showAlert(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("alertModal").classList.remove("hidden");
}

    function closeAlert() {
  document.getElementById("alertModal").classList.add("hidden");
    }

    // --- Modal Functions ---
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

      //Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/RoomReser.html"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/FarmOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "../pages/FarmOrders.html"; // go to another page
  });
});

function goBack() {
    window.location.href = "../pages/RoomReser.html";
 }