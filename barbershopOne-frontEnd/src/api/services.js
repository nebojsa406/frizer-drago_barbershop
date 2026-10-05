const API_URL = `${import.meta.env.VITE_API_URL}services`;
import { toast } from "react-toastify";
import { authFetch } from "./authFetch.js";

//get
export const getServices = async () => {
    const res = await fetch(`${API_URL}/`);
    const data = await res.json();

    if (!res.ok) throw new Error('failed to fetch prices');
    
    return data;
}


//------------ADMIN----------\\

export const updateService = async (id, serviceBody) => {
    const accessToken = localStorage.getItem('accessToken');

    const res = await authFetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(serviceBody)
    });
    const data = await res.json();

    if(!res.ok) return toast("Failed to update service card", { className: "errorToast", progressClassName: "errorProgress" });
    if(!res.ok) throw new Error(`failed to update,with error: ${data.message}`);

    toast("SUCCESS, refresh page to see changes", { className: "successToast", progressClassName: "successProgress" });
    return data;
}

export const deleteService = async(id) => {
    const accessToken = localStorage.getItem('accessToken');

    const res = await authFetch(`${API_URL}/${id}`,{
        method: "DELETE",
        headers: {"Authorization": `Bearer ${accessToken}`}
    })
    const data = await res.json();

    if(!res.ok) return toast("Failed to delete service card", { className: "errorToast", progressClassName: "errorProgress" });
    if(!res.ok) throw new Error(`failed to delete,with error: ${data.message}`);

    toast("SUCCESS, refresh page to see changes", { className: "successToast", progressClassName: "successProgress" });
    return data;
}


export const createService = async(serviceBody) => {
    const accessToken = localStorage.getItem('accessToken');

    const res = await authFetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(serviceBody)
    })
    const data = await res.json();

    if(!res.ok) return toast("Failed to create service card", { className: "errorToast", progressClassName: "errorProgress" });
    if(!res.ok) throw new Error(`failed to create,with error: ${data.message}`);

    toast("SUCCESS, refresh page to see changes", { className: "successToast", progressClassName: "successProgress" });
    return data;
}