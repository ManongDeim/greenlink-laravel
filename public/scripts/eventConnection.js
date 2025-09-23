// Disable Past & Selected Dates

const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

const today = new Date();

// Format

function formatDate(date){
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Set Today's Date as min check-in

startInput.setAttribute('min', formatDate(today));

// Set tommorows date as min check-out

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
endInput.setAttribute('min', formatDate(tomorrow));


// When check-in changes, updates check-out

startInput.addEventListener('change', function() {
    const startInputDate = new Date(this.value);

    startInputDate.setDate(startInputDate.getDate() + 1);
    const minendInputDate = formatDate(startInputDateDate);
    endInput.setAttribute('min', minendInputDate);

    // If check-out is before new min, clear it

    if (startInput.value && endInput.value < minendInputDate){
        endInput.value ="";
    }
});


// For Event Reservation
async function sendReservation(){
  let formE1 = document.getElementById("eventBookingForm");

    let form = new FormData(formE1);

    try {
        let response = await fetch("http://127.0.0.1:8000/api/eventReservation", {
            method: "POST",
            body: form
        });

        if (!response.ok) {
            throw new Error("HTTP error! Status: " + response.status);
        }

        let result = await response.json();

        showAlert("✅ " + result.message + " ");

        console.log("Success:", result);

        //Clear form after success
        formE1.reset();

        //Close modal after success
        closeConfirmationModal();

    } catch (error) {
        console.error("Error:", error);
        showAlert("❌ An error occurred. Please try again." + error.message);
    }

}

   document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("confirmBtn").addEventListener("click", () => {
        console.log("Confirm clicked"); 
        sendReservation();
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

    function closeOrderModal() {
      document.getElementById('orderModal').classList.add('hidden');
    }

    function openConfirmationModal() {

    const form = document.getElementById("eventBookingForm");

    const start_date = form.querySelector("input[name='start_date']").value;
    const end_date = form.querySelector("input[name='end_date']").value;
    const fullName = form.querySelector("input[name='full_name']").value;
    const event_type = form.querySelector("select[name='event_type']").value;
    const pax = form.querySelector("input[name='pax']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone_number']").value;
    const to_bring = form.querySelector("textarea[name='to_bring']").value;

    // Build summary HTML 
    const summaryHtml = `
    <p><strong>Check-In:</strong> ${start_date}</p>
    <p><strong>Check-Out:</strong> ${end_date}</p>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Event Type:</strong> ${event_type}</p>
    <p><strong>Pax:</strong> ${pax}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Thing to be brought:</strong> ${to_bring}</p>
    `;

      // Insert into modal
      document.getElementById("confirmationSummary").innerHTML = summaryHtml;

      // Open modal
      document.getElementById('confirmationModal').classList.remove('hidden');
       document.body.style.overflow = 'hidden';
    }

     function closeConfirmationModal() {
      document.getElementById('confirmationModal').classList.add('hidden');
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
  
  const btn = document.getElementById("roomReser");


  btn.addEventListener("click", () => {
    window.location.href = "./RoomReser.html"; // go to another page
  });
});

  //Cottage Reservation Page
  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("cottageReser");


  btn.addEventListener("click", () => {
    window.location.href = "#"; // go to another page
  });
});

//Event Reservation Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("eventReser");


  btn.addEventListener("click", () => {
    window.location.href = "./EventReser.html"; // go to another page
  });
});


//Food Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("foodOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FarmOrders.html"; // go to another page
  });
});

//Farm Order Page

  document.addEventListener("DOMContentLoaded", () => {
  
  const btn = document.getElementById("farmOrder");


  btn.addEventListener("click", () => {
    window.location.href = "./FarmOrders.html"; // go to another page
  });
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
