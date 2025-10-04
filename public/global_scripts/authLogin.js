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
    if(!document.getElementById("loginModal")){
         const modalHTML = `
        <div id="loginModal" class="hidden fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 class="text-xl font-bold mb-4">Login Required</h2>
            <p class="mb-4">You must be logged in to continue.</p>
            <button id="loginCloseBtn" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
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