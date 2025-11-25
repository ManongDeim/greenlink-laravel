

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


document.addEventListener("DOMContentLoaded", () => {
    
    console.log("✅ DOM loaded, attaching button listeners...");
    

  // Booking modal
  document.getElementById("bookingBtn")?.addEventListener("click", openReserModal);
  document.getElementById("resCloseBtn")?.addEventListener("click", closeReserModal);

  // Order modal
  document.getElementById("orderBtn")?.addEventListener("click", openOrderModal);
  document.getElementById("orderCloseBtn")?.addEventListener("click", closeOrderModal);

  // Check login status
  loadUserProfile();
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


  //Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/RoomReser.html"; // go to another page
  });
});

 //Room Reservation Page for button in carousel
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReserv");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/RoomReser.html"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/FoodOrders.html"; // go to another page
  });
});

//Food Order Page for button in carousel

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrders");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/FoodOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./pages/FarmOrders.html"; // go to another page
  });
});

async function renderHomeEvents() {
    const container = document.getElementById('homeSections');
    try {
        const res = await fetch('/api/home-events');
        const events = await res.json();

        container.innerHTML = events.map(event => `
            <section class="px-6 py-16 text-gray-800 bg-white">
                <div class="mx-auto max-w-7xl">
                    <h2 class="mb-12 text-3xl font-bold text-center text-teal-700 md:text-4xl">
                        ${event.title}
                    </h2>
                    ${event.image_url ? `
                    <div class="flex flex-col gap-10 lg:flex-row lg:items-start">
                        <div class="w-full lg:w-1/3">
                            <img class="w-full transition-transform duration-300 rounded-lg shadow-lg hover:scale-105"
                                 src="${event.image_url}" alt="${event.title}">
                        </div>
                        <div class="w-full space-y-4 text-base font-light leading-relaxed text-justify lg:w-2/3 md:text-lg">
                            ${event.content}
                        </div>
                    </div>` : `
                    <div class="text-base font-light leading-relaxed text-justify md:text-lg">
                        ${event.content}
                    </div>`}
                </div>
            </section>
        `).join('');

    } catch (err) {
        console.error('Failed to load home events:', err);
        container.innerHTML = `<p class="text-red-500">Failed to load content</p>`;
    }
}

// Call on page load
renderHomeEvents();
