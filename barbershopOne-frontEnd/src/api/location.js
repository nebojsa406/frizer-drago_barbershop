const API_URL = `${import.meta.env.VITE_API_URL}location`;

//get
export const getLocation = async () => {
    const res = await fetch(`${API_URL}/`);
    if (!res.ok) throw new Error('failed to fetch location');
    return res.json();
}


//------------ADMIN----------\\