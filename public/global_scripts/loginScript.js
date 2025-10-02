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
             
                <! -- Dropdown Trigger -->
                <button id="userMenuBtn" class="flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm bg-white hover:bg-gray-50">
                    <img src="${user.avatar ?? "https://via.placeholder.com/40"}" alt="Avatar"
                    class="w-8 h-8 rounded-full" />
                    <span class="text-sm font-medium">${user.name}</span>
                    <svg class="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                </button>

                <! -- Dropdown Menu -->

                 <div id="userDropdown" class="hidden absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                        <a href="/pages/CustomerDashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                        <button onclick="logout()" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100">Logout</button>
                    </div>
            </div>
            `;

             // Toggle dropdown open/close
            const menuBtn = document.getElementById("userMenuBtn");
            const dropdown = document.getElementById("userDropdown");

            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("hidden");
            });

            // Close dropdown if clicking outside
            document.addEventListener("click", (e) => {
                if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add("hidden");
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
