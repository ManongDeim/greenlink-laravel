document.addEventListener("DOMContentLoaded", () => {
    // Build header
    const header = document.createElement("header");
    header.innerHTML = `
        <div class="flex justify-between items-center p-4 bg-gray-100">
            <h1 class="text-xl font-bold">Lola Sayong GreenLink</h1>
            <div id="auth-section">
                <button id="loginBtn" class="px-4 py-2 bg-blue-500 text-white rounded">
                    Login with Google
                </button>
            </div>
        </div>
    `;
    document.body.prepend(header);

    // Attach login logic
    loadUserProfile();
    document.getElementById("loginBtn")?.addEventListener("click", () => {
        window.location.href = "/auth/google";
    });
});

async function loadUserProfile() {
    try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) throw new Error();

        const user = await res.json();
        document.getElementById("auth-section").innerHTML = `
            <div class="flex items-center gap-2 px-4 py-2 border rounded-full">
                <img src="${user.avatar ?? "https://via.placeholder.com/40"}"
                     class="w-8 h-8 rounded-full" />
                <span>${user.name}</span>
                <button onclick="logout()" class="ml-2 text-red-500 text-xs">Logout</button>
            </div>
        `;
    } catch {
        console.log("Not logged in");
    }
}

async function logout() {
    await fetch("/logout", { credentials: "include" });
    location.reload();
}
