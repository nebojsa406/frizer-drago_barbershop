const API_URL = `${import.meta.env.VITE_API_URL}appointments`;
import { toast } from "react-toastify";
import { authFetch } from "./authFetch.js";


//------------CLIENT----------\\

//get times
export const getTakenTimes = async () => {
    const res = await fetch(`${API_URL}/times`);
    if (!res.ok) throw new Error('failed to fetch appointments times');
    const data = await res.json();
    return data.times;
}

//post
export const postAppointment = async (appointmentBody) => {

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentBody)
    });
    const data = await res.json();

    if (!res.ok) {
        toast(data.message, { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(data.message || "Failed to load appointments");
    }

    toast("SUCCESS, appointment made!", { className: "successToast", progressClassName: "successProgress" });
    return data;
}

//find by phone
export const getByPhone = async (phone) => {
    const res = await fetch(`${API_URL}/byPhone?phone=${phone}`);
    const data = await res.json();
    if (!res.ok) {
        toast(data.message, { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(data.message || "Failed to load appointments");
    }
    console.log(data);
    return data;
}


//------------ADMIN----------\\

//get by date
export const getByDate = async (date, toggleFrom) => {
    const res = await authFetch(`${API_URL}/byDate?date=${date}&toggleFrom=${toggleFrom}`, {
        method: 'GET'
    });
    const data = await res.json();
    if (!res.ok) {
        toast(data.message, { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(data.message || "Failed to load appointments");
    }
    return data;
}

//get all appointments
export const getAll = async () => {
    const res = await authFetch(`${API_URL}/`, {
        method: 'GET'
    });
    const data = await res.json();
    if (!res.ok) {
        toast(data.message, { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(data.message || "Failed to load appointments");
    }

    return data;
}

// delete one
export const deleteOne = async (id) => {
    const res = await authFetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) {
        toast(data.message, { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(data.message || "Failed to load appointments");
    }

    toast("SUCCESS, appointment deleted", { className: "successToast", progressClassName: "successProgress" });
    return data;
}

//disable time slot
export const disableTimeSlot = async (date, time) => {
    const accessToken = localStorage.getItem('accessToken');

    const res = await authFetch(`${API_URL}/disableTimeSlot`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ date: date, time: time })
    })
    const data = await res.json();

    if (!res.ok) {
        toast(data.message, { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(data.message || "Failed to load appointments");
    }

    toast("SUCCESS, time slot disabled", { className: "successToast", progressClassName: "successProgress" });
    return data;
}