// Event Reservation Fetch Script

document.addEventListener("DOMContentLoaded", () => {

 fetch("http://127.0.0.1:8000/api/reservations/latest")
    .then(res => res.json())
    .then(data => {
      console.log("Latest reservation:", data);
      fillReservation(data);

      setupApprovalButtons(data.id);
    })
    .catch(err => console.error("Error (latest):", err));

});

function fillReservation(data) {
  if (!data) return;

  document.getElementById("reservationID").textContent = data.id || "";
  document.getElementById("eventStart").textContent = data.start_date || "";
  document.getElementById("eventEnd").textContent = data.end_date || "";
  document.getElementById("fullName").textContent = data.full_name || "";
  document.getElementById("email").textContent = data.email || "";
  document.getElementById("phoneNumber").textContent = data.phone_number || "";
  document.getElementById("pax").textContent = data.pax || "";
  document.getElementById("toBring").textContent = data.to_bring || "";
  document.getElementById("approvalStat").textContent = data.approval_status || "";
}

function setupApprovalButtons(reservationId) {
  document.querySelector(".approve-btn").addEventListener("click", () => {
    updateApprovalStatus(reservationId, "Approved");
  });

  document.querySelector(".disapprove-btn").addEventListener("click", () => {
    updateApprovalStatus(reservationId, "Disapproved");
  });
}

// ✅ Send PATCH request to Laravel API
function updateApprovalStatus(reservationId, status) {
  fetch(`http://127.0.0.1:8000/api/reservations/${reservationId}/approval`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ status })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`Failed to update: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("Updated:", data);
    document.getElementById("approvalStat").textContent = data.reservation.approval_status;
  })
  .catch(err => console.error("Error updating:", err));
}