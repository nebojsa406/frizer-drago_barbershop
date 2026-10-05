const API_URL = `${import.meta.env.VITE_API_URL}user`;
import { refreshAccessToken } from "./authFetch.js";

export async function login(body, setUser) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
    });
    const resData = await res.json();
    if (resData.accessToken) localStorage.setItem('accessToken', resData.accessToken);
    setUser(resData.user);
    console.log(resData.user)
    return {body: resData, status: res.status}
}

export async function logout(setUser) {
    setUser(null);
    localStorage.removeItem("accessToken");

    const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include"
    });

    const resData = await res.json();
    if (!res.ok) {
        throw new Error(resData.message || "Failed to log out");
    }
    return {body: resData.message, status: res.status}
}

//refresh
export async function refreshTokenLogin() {
    if (!localStorage.getItem("accessToken")) {
        return null;
    }

    return refreshAccessToken();
}