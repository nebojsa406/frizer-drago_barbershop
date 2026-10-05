const API_URL = `${import.meta.env.VITE_API_URL}gallery`;
import { toast } from "react-toastify";
import { authFetch } from "./authFetch.js";

//get
export const getPhotos = async () => {
    const res = await fetch(`${API_URL}/`);
    if (!res.ok) {
        toast("failed to fetch photos", { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(`err: failed to fetch photos, err: ${data.message}`);
    }

    return res.json();
}

//------------ADMIN----------\\

//upload
export const uploadPhotos = async (files, category) => {
    console.log("category: ", category);

    const formData = new FormData();
    files.forEach(file => {
        formData.append("images", file);
    });
    formData.append("category", category);

    const res = await authFetch(API_URL, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    if (!res.ok) {
        toast("failed to upload photos", { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(`failed to upload photos, err: ${data.message}`);
    }
    toast("SUCCESS, photos uploaded!", { className: "successToast", progressClassName: "successProgress" });

    return data;
}

//delete
export const deletePhoto = async (id) => {
    const res = await authFetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    if (!res.ok) {
        toast("failed to delete photo", { className: "errorToast", progressClassName: "errorProgress" });
        throw new Error(`failed to delete photo, err: ${data.message}`);
    }
    toast("SUCCESS, photo deleted!", { className: "successToast", progressClassName: "successProgress" });

    return data;
}
