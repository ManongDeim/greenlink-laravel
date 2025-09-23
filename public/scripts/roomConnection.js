// For Cottage Reservation
async function sendReservation(paymentMethod){
  let formE1 = document.getElementById("roomBookingForm");

   // get cottage name from paragraph
    let room = document.querySelector("#roomName").innerText;
    document.getElementById("roomInput").value = room;

    let form = new FormData(formE1);
    form.append("payment_method", paymentMethod);

    try {
        let response = await fetch("http://127.0.0.1:8000/api/cottageReservation", {
            method: "POST",
            body: form
        });

        if (!response.ok) {
            throw new Error("HTTP error! Status: " + response.status);
        }

        let result = await response.json();

        showAlert("✅ " + result.message + " (" + paymentMethod + ")");

        console.log("Success:", result);

        //Clear form after success
        formE1.reset();

        //Close modal after success
        closePaymentModal();

    } catch (error) {
        console.error("Error:", error);
        showAlert("❌ An error occurred. Please try again." + error.message);
    }


}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cashPayment").addEventListener("click", () => {
        console.log("Cash clicked"); 
        sendReservation("Cash");
    });

});



  
//Modals
  
  function openReserModal() {
      document.getElementById('reservationModal').classList.remove('hidden');
    }
    function closeReserModal() {
      document.getElementById('reservationModal').classList.add('hidden');
    }

    function openOrderModal() {
      document.getElementById('orderModal').classList.remove('hidden');
    }
    function closeOrderModal() {
      document.getElementById('orderModal').classList.add('hidden');
    }

      function openPaymentModal() {

    const form = document.getElementById("roomBookingForm");

    const room = document.querySelector("#roomName").innerText;
    const check_in_date = form.querySelector("input[name='check_in_date']").value;
    const check_out_date = form.querySelector("input[name='check_out_date']").value;
    const fullName = form.querySelector("input[name='full_name']").value;
    const pax = form.querySelector("input[name='pax']").value;
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



  //Pages  

  //Room Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("roomReserPage");
  

  btn.addEventListener("click", () => {
    window.location.href = "#"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "FarmOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FarmOrders.html"; // go to another page
  });
});
// Automatic Image Carousel
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  const slides = carousel.querySelectorAll("img");
  let index = 0;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  // Auto scroll every 3 seconds
  setInterval(nextSlide, 3000);

  // Expose functions globally so buttons work
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
});

//Square Room Page
  document.addEventListener("DOMContentLoaded", () => { 
  const btn = document.getElementById("squareRoom");


  btn.addEventListener("click", () => {
    window.location.href = "./SquareRoom.html"; // go to another page
  });
});


function openRoomModal(modalId) {
      document.getElementById(modalId).classList.remove('hidden');
    }
    function closeRoomModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    // Close modal when clicking outside
    document.querySelectorAll('[id$="Modal"]').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll('[id$="Modal"]').forEach(modal => modal.classList.add('hidden'));
      }
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