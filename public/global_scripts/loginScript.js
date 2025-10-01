document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM loaded, checking login...");

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
                <div class="flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm">
                    <img src="${user.avatar ?? "https://via.placeholder.com/40"}" 
                         alt="Avatar"
                         class="w-8 h-8 rounded-full" />
                    <span class="text-sm font-medium">${user.name}</span>
                    <button onclick="logout()" 
                            class="ml-2 text-xs text-red-500 hover:underline">Logout</button>
                </div>
            `;
        }
    } catch (err) {
        console.log("⚠️ No active session");
    }
}

async function logout() {
    await fetch("/logout", { credentials: "include" });
    location.reload();
}
