//Modals
  
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