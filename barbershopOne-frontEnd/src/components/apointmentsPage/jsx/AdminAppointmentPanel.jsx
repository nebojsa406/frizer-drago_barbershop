import { useState } from "react";
import { toast } from "react-toastify";
import { deleteOne, getByDate, getAll } from "../../../api/appointments";
import { AppointmentCard } from "./AppointmentCard.jsx";


export function AdminAppointmentPanel( { dateComparison, dateToday } ) {
    const [startFromDate, setStartFromDate] = useState(false);
    const [appointmentsAdmin, setAppointmentsAdmin] = useState([]);
    const [apcDate, setApcDate] = useState("");
    const [adminSelectedCard, setAdminSelectedCard] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleAdminSearch() {
        if (startFromDate && !apcDate) {
            toast("Choose a date to search appointments from", { className: "errorToast", progressClassName: "errorProgress" });
            return;
        }

        setIsSearching(true);
        try {
            const data = apcDate ? await getByDate(apcDate, startFromDate) : await getAll();
            const appointments = Array.isArray(data) ? data : data?.appointments;

            if (!Array.isArray(appointments)) {
                throw new Error("Unexpected appointment search response");
            }

            setAppointmentsAdmin(appointments);
            setAdminSelectedCard("");
        } catch (error) {
            toast(error instanceof Error ? error.message : "Failed to search appointments", { className: "errorToast", progressClassName: "errorProgress" });
        } finally {
            setIsSearching(false);
        }
    }

    async function handleDelete() {
        if (!adminSelectedCard) return toast("no appointment card selected!", { className: "errorToast", progressClassName: "errorProgress" });

        setIsDeleting(true);
        try {
            await deleteOne(adminSelectedCard);
            setAppointmentsAdmin((appointments) => appointments.filter((item) => item._id !== adminSelectedCard));
            setAdminSelectedCard("");
        } catch (error) {
            toast(error instanceof Error ? error.message : "Failed to delete appointment", { className: "errorToast", progressClassName: "errorProgress" });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <aside className="admin-panel" aria-label="Admin panel">
            <h2>admin panel</h2>
            <p>manage appointments</p>
            <div className="admin-panel-content">
                <div className="apc-buttons-div">
                    <button onClick={handleAdminSearch} className="search-appointment-btn" disabled={isSearching || isDeleting}>{isSearching ? "Searching..." : "Search"}</button>
                    <button onClick={() => setStartFromDate(!startFromDate)} className={`search-appointment-btn break-btn-words ${startFromDate ? "search-appointment-btn-on" : ""}`} disabled={isSearching || isDeleting}>all appointments from date:</button>
                    <input
                        type="date"
                        className="appoint-page-date-input"
                        value={apcDate}
                        onChange={(event) => setApcDate(event.target.value)}
                        disabled={isSearching || isDeleting}
                    />
                    <button onClick={handleDelete} className="search-appointment-btn" disabled={isSearching || isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</button>
                </div>
                <div className={`apc-appointments ${appointmentsAdmin.length > 6 ? "has-scroll" : ""} ${appointmentsAdmin.length > 3 ? "has-mobile-scroll" : ""}`}>

                    {appointmentsAdmin.length !== 0 ?
                        appointmentsAdmin.map((item) => {
                            return (
                                <AppointmentCard
                                    appointment={item}
                                    dateComparison={dateComparison}
                                    dateToday={dateToday}
                                    adminView
                                    isSelected={adminSelectedCard === item._id}
                                    onClick={() => setAdminSelectedCard(item._id)}
                                    key={item._id}
                                />
                            )
                        })
                        : <>no appointments found</>
                    }
                </div>
            </div>
        </aside>
    )
}