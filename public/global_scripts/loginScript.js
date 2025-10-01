// Google login redirect
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/auth/google";
    });
  }

  // Load user profile
async function loadUserProfile() {
    try {
        console.log("🔍 Checking logged-in user...");
        const response = await fetch("/api/user", {
            credentials: "include" // ✅ important for session cookies
        });

        console.log("📡 /api/user status:", response.status);

        if (!response.ok) {
            throw new Error("Not logged in");
        }

        const user = await response.json();
        console.log("✅ User data from API:", user);

        // If user is logged in, replace login button
        if (user && user.name) {
            console.log("🎉 Logged in as:", user.name);

            const authSection = document.getElementById("auth-section");
            authSection.innerHTML = `
                <div class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full shadow-sm">
                    <img src="${user.avatar ?? "https://via.placeholder.com/40"}" 
                         class="w-8 h-8 rounded-full" />
                    <span class="text-sm font-medium">${user.name}</span>
                    <button onclick="logout()" 
                            class="ml-2 text-xs text-red-500 hover:underline">Logout</button>
                </div>
            `;
        } else {
            console.log("⚠️ No user.name found in response");
        }
    } catch (err) {
        console.error("❌ User not logged in:", err.message);
    }
}

// Logout request
async function logout() {
    console.log("🚪 Logging out...");
    await fetch("/logout", { credentials: "include" });
    location.reload(); // reload page to reset UI
}

// Run on page load
// document.addEventListener("DOMContentLoaded", loadUserProfile);