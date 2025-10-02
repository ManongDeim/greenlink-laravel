const sidebarButtons = document.querySelectorAll(".sidebar-btn");
const content = document.getElementById("content");

// Attach sidebar button listeners
sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Reset buttons
    sidebarButtons.forEach(b => {
      b.classList.remove("bg-teal-600", "text-white", "hover:bg-teal-700", "hover:border-teal-700");
      if (!b.classList.contains("text-red-700")) {
        b.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200", "hover:border-gray-400");
      }
    });

    // Set active
    btn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200", "hover:border-gray-400");
    btn.classList.add("bg-teal-600", "text-white", "hover:bg-teal-700", "hover:border-teal-700");

    // Change content
    const section = sections[btn.dataset.section];
    if (section.custom) {
      content.innerHTML = section.custom;
      attachOrderEvents(); // 👈 Reattach events if foodOrders loaded
    } else {
      content.innerHTML = `
        <h2 class="mb-4 text-xl font-bold text-teal-700">${section.title}</h2>
        <p class="text-gray-700">${section.text}</p>
      `;
    }
  });
});

// Function to re-attach events for order items
function attachOrderEvents() {
  const orderItems = document.querySelectorAll(".order-item");
  orderItems.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("bg-teal-100");
      item.classList.toggle("selected");
    });
  });

  const completeBtn = document.getElementById("completeOrderBtn");
  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      document.querySelectorAll(".order-item.selected").forEach(selectedItem => {
        selectedItem.remove();
      });
    });
  }
}