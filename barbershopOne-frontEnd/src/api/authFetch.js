const REFRESH_URL = `${import.meta.env.VITE_API_URL}user/refresh`;
let refreshInFlight;

export async function refreshAccessToken() {
    if (!refreshInFlight) {
        refreshInFlight = (async () => {
            const res = await fetch(REFRESH_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const data = await res.json();

            if (res.status === 401) {
                localStorage.removeItem("accessToken");
                return null;
            }
            if (!res.ok) {
                throw new Error(data.message || "Failed to refresh session");
            }
            if (!data.accessToken) {
                throw new Error("Refresh response did not include an access token");
            }

            localStorage.setItem("accessToken", data.accessToken);
            return data;
        })().finally(() => {
            refreshInFlight = null;
        });
    }

    return refreshInFlight;
}

export async function authFetch(url, options = {}) {
    const sendRequest = () => {
        const headers = new Headers(options.headers);
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        return fetch(url, { ...options, headers });
    };

    const tokenUsed = localStorage.getItem("accessToken");
    const response = await sendRequest();
    if (response.status !== 401) return response;

    const latestToken = localStorage.getItem("accessToken");
    if (!latestToken || latestToken === tokenUsed) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) return response;
    }

    return sendRequest();
}
