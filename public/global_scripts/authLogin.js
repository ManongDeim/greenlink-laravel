document.addEventListener("DOMContentLoaded", async function () {
    let isLoggedIn = false;

    //Fetch login from laravel

    try {
        const response = await fetch('/auth-status');
        const data = await response.json();
        isLoggedIn = data.logged_in;
    } catch (error) {
        console.error('Error fetching auth status:', error);
    }

    // Modal 
if (!document.getElementById("loginModal")) {
  const modalHTML = `
    <div id="loginModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm hidden">
      <div class="relative w-80 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl text-center border border-white/30">
        <h2 class="mb-3 text-xl font-semibold text-gray-800">Login Required</h2>
        <p class="mb-5 text-sm text-gray-600">You need to sign in before continuing.</p>
        
        <div class="flex justify-center gap-3">
          <button id="loginProceedBtn" class="px-4 py-2 text-sm font-medium text-white transition bg-teal-600 rounded-lg hover:bg-teal-700">
            Log In
          </button>
          <button id="loginCloseBtn" class="px-4 py-2 text-sm font-medium text-gray-700 transition bg-white border rounded-lg hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const loginCloseBtn = document.getElementById("loginCloseBtn").addEventListener("click", closeLoginModal);
    }

     // Attach to all elements with "requires-login"
    document.querySelectorAll(".requires-login").forEach(el => {
        el.addEventListener("click", function (event) {
            if (!isLoggedIn) {
                event.preventDefault();
                openLoginModal();
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