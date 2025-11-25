

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

        container.innerHTML = `
<section class="px-6 py-16 text-gray-800 bg-white">
    <div class="mx-auto max-w-7xl">
        
        <!-- Section Title -->
        <h2 class="mb-12 text-3xl font-bold text-center text-teal-700 md:text-4xl">
            Events
        </h2>

        <!-- 3 Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            ${events.map(event => `
                <div class="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">

                    <!-- Image -->
                    ${event.image_url ? `
                        <img src="${event.image_url}" 
                             alt="${event.title}" 
                             class="w-full h-56 object-contain">
                    ` : ''}

                    <!-- Content -->
                    <div class="p-6 space-y-3">
                        <h3 class="text-2xl font-semibold text-teal-700">
                            ${event.title}
                        </h3>

                        <p class="text-gray-700 leading-relaxed text-base">
                            ${event.description}
                        </p>

                        ${event.highlights ? `
                        <div>
                            <h4 class="text-teal-600 font-semibold mb-1">Event Highlights</h4>
                            <ul class="list-disc pl-5 space-y-1 text-gray-700">
                                ${event.highlights
                                    .split('\\n')
                                    .map(item => `<li>${item}</li>`)
                                    .join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>

                </div>
            `).join('')}
        </div>

    </div>
</section>
        `;
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}








// Call on page load
renderHomeEvents();
