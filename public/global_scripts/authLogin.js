// global_scripts/authLogin.js
document.addEventListener("DOMContentLoaded", async function () {
  // Global login state
  window.isLoggedIn = false;

  // Fetch login status from Laravel
  try {
    const response = await fetch("/auth-status");
    const data = await response.json();
    window.isLoggedIn = data.logged_in;
  } catch (error) {
    console.error("Error fetching auth status:", error);
  }

  // Create login modal once (if not already in HTML)
  if (!document.getElementById("loginModal")) {
    const modalHTML = `
      <div id="loginModal"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm hidden">
  <div class="relative w-80 p-6 bg-white rounded-2xl shadow-xl text-center border border-gray-200">
    <h2 class="mb-3 text-xl font-semibold text-gray-800">Login Required</h2>
    <p class="mb-5 text-sm text-gray-600">You need to sign in before continuing.</p>
    <div class="flex justify-center gap-3 mt-6">
      <button id="loginProceedBtn"
        class="px-4 py-2 text-sm font-medium text-white transition bg-teal-600 rounded-lg hover:bg-teal-700">
        Log In
      </button>
      <button id="loginCloseBtn"
        class="px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
        Cancel
      </button>
    </div>
  </div>
</div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document.getElementById("loginCloseBtn").addEventListener("click", closeLoginModal);
    document.getElementById("loginProceedBtn").addEventListener("click", () => {
      window.location.href = "/auth/google"; // redirect to your login route
    });
  }

  // Attach check to any element requiring login
  document.querySelectorAll(".requires-login").forEach((el) => {
    el.addEventListener("click", (event) => {
      if (!window.isLoggedIn) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openLoginModal();
        return false;
      }
    });
  });
});

function openLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden");
}
function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}
