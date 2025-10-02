document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ loginScript.js is running!");
    console.log("✅ Checking login...");

    loadUserProfile();

    // Attach Google login redirect to existing loginBtn
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/auth/google"; // your Laravel Socialite route
        });
    }
});

async function loadUserProfile() {
    try {
        const response = await fetch("/api/user", { credentials: "include" });

        if (!response.ok) throw new Error("Not logged in");

        const user = await response.json();
        console.log("👤 Logged in:", user);

        const authSection = document.getElementById("auth-section");
        if (authSection) {
            authSection.innerHTML = `
              <div class="relative inline-block text-left">
  <!-- Profile Button -->
  <button id="userMenuBtn" 
          class="flex items-center gap-2 px-4 py-2 bg-white shadow-sm hover:bg-gray-50 focus:outline-none transition-all duration-200">
      <img src="${user.avatar ?? "https://via.placeholder.com/40"}" 
           alt="Avatar"
           class="w-8 h-8 rounded-full" />
      <span class="text-sm font-medium">${user.name}</span>
      <svg id="chevronIcon" class="w-4 h-4 ml-1 text-gray-500 transition-transform duration-200" 
           fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
  </button>

  <!-- Dropdown Menu -->
  <div id="userDropdown" 
       class="hidden absolute right-0 w-48 bg-white shadow-lg overflow-hidden origin-top scale-95 opacity-0 transition-all duration-200">
      <a href="/pages/CustomerDashboard.html" 
         class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
         <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m-4 0h8" />
         </svg>
         Dashboard
      </a>
      <button onclick="logout()" 
              class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V7" />
          </svg>
          Logout
      </button>
  </div>
</div>
            `;

             // Toggle dropdown open/close
            const menuBtn = document.getElementById("userMenuBtn");
            const dropdown = document.getElementById("userDropdown");
            const chevron = document.getElementById("chevronIcon");

            menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = dropdown.classList.contains("hidden");

    if (isHidden) {
        // Show dropdown
        dropdown.classList.remove("hidden");
        setTimeout(() => {
            dropdown.classList.remove("scale-95", "opacity-0");
            dropdown.classList.add("scale-100", "opacity-100");
        }, 10);

        // Change button shape (only top rounded, no bottom border)
        menuBtn.classList.remove("rounded-full");
        menuBtn.classList.add("rounded-t-xl", "border-b-0");

        chevron.classList.add("rotate-180");
    } else {
        // Hide dropdown
        dropdown.classList.remove("scale-100", "opacity-100");
        dropdown.classList.add("scale-95", "opacity-0");
        chevron.classList.remove("rotate-180");

        // Reset button shape back to pill
        setTimeout(() => {
            dropdown.classList.add("hidden");
            menuBtn.classList.remove("rounded-t-xl", "border-b-0");
            menuBtn.classList.add("rounded-full");
        }, 200);
    }
});

// Close if clicking outside
document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("scale-100", "opacity-100");
        dropdown.classList.add("scale-95", "opacity-0");
        chevron.classList.remove("rotate-180");

        setTimeout(() => {
            dropdown.classList.add("hidden");
            menuBtn.classList.remove("rounded-t-xl", "border-b-0");
            menuBtn.classList.add("rounded-full");
        }, 200);
    }
});
        }
    } catch (err) {
        console.log("⚠️ No active session");
    }
}

async function logout() {
    await fetch("/logout", { credentials: "include" });
    location.reload();
}
