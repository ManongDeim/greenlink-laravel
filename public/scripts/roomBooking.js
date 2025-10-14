// === Dynamic Room Data Loader ===

// Get room ID from URL (e.g. roomBooking.html?id=2)
const params = new URLSearchParams(window.location.search);
const roomId = params.get("id") || 1; // fallback if no id

async function loadRoomData() {
  try {
    const response = await fetch(`https://greenlinklolasayong.site/api/rooms/${roomId}`);
    if (!response.ok) throw new Error("Failed to fetch room data");

    const room = await response.json();
    console.log("Loaded room:", room);

    // --- Update Room Info ---
    document.getElementById("roomName").textContent = room.name;
    document.getElementById("roomDescription").textContent = room.description || "No description available.";
    const priceElement = document.querySelector(".text-teal-800");
    if (priceElement) {
      priceElement.innerHTML = `Only ₱${Number(room.price).toLocaleString()} <span class="font-medium text-gray-600">/ night</span>`;
    }

    // --- Build Carousel ---
    const carousel = document.getElementById("carousel");
    const indicators = document.getElementById("indicators");
    carousel.innerHTML = "";
    indicators.innerHTML = "";

    const images = Array.isArray(room.carousel_images)
      ? room.carousel_images
      : JSON.parse(room.carousel_images || "[]");

    images.forEach((imgUrl, index) => {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = `${room.name} image ${index + 1}`;
      img.className =
        "w-full h-[400px] object-cover rounded-xl flex-shrink-0 bg-gray-100";
      carousel.appendChild(img);

      const dot = document.createElement("span");
      dot.style.width = dot.style.height = "10px";
      dot.style.borderRadius = "50%";
      dot.style.display = "inline-block";
      dot.style.cursor = "pointer";
      dot.style.background = index === 0 ? "teal" : "#ccc";
      dot.addEventListener("click", () => goToSlide(index));
      indicators.appendChild(dot);
    });

    // Reinitialize carousel
    initializeCarousel();

    // --- Book Now button logic ---
    const bookButton = document.getElementById("bookNow");
    if (bookButton) {
      bookButton.addEventListener("click", () => {
        window.location.href = `../pages/form.html?id=${room.id}`;
      });
    }

  } catch (error) {
    console.error("Error loading room data:", error);
    alert("Unable to load room details. Please try again later.");
  }
}

// === Carousel Logic ===
let currentSlide = 0;

function initializeCarousel() {
  const carousel = document.getElementById("carousel");
  const slides = carousel.querySelectorAll("img");
  const indicators = document.getElementById("indicators");

  if (slides.length === 0) return;

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

  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.goToSlide = goToSlide;

  setInterval(nextSlide, 4000);
}

document.addEventListener("DOMContentLoaded", loadRoomData);
