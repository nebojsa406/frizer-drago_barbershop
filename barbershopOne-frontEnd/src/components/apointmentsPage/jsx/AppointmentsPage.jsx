import "../css/AppointmentsPage.css"
import { useState, useEffect } from "react";
import { getTimes, postAppointment, getByPhone } from "../../../api/appointments";
import { toast } from "react-toastify";
import { getServices } from "../../../api/services.js"
import { AdminAppointmentPanel } from "./AdminAppointmentPanel.jsx";
import { AppointmentSearch } from "./AppointmentSearch.jsx";
import { AppointmentResultsTemplate } from "./AppointmentResultsTemplate.jsx";

const TIME_SLOTS = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30"
];

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getTimeInMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

export function AppointmentsPage({ admin = false }) {
    const dateToday = getLocalDateString();
    const currentTimeInMinutes = getTimeInMinutes(
        `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`
    );

    //taken times data
    const [takenTimes, setTakenTimes] = useState([]);
    const [services, setServices] = useState([]);

    //search by phone apointment data
    const [searchPhone, setSearchPhone] = useState("");
    const [appointmentsByPhone, setAppointmentsByPhone] = useState([]);
    const [showAppointmentSearch, setShowAppointmentSearch] = useState(true);
    const [showAppointments, setShowAppointments] = useState(false);

    //appointment data
    const [selectedService, setSelectedService] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [details, setDetails] = useState("");

    //admin panel data
    const [showAdminPanel, setShowAdminPanel] = useState(false);



    //---------------------------------------------------------\\
    useEffect(() => {
        (async () => {
            try {
                const data = await getTimes();
                setTakenTimes(data?.takenTimes ?? []);
                const serviceData = await getServices();
                setServices(serviceData.services);

            } catch (err) {
                console.log(err);
                toast("Failed to load booking information, try again later", { className: "errorToast", progressClassName: "errorProgress" });
            }
        })();
    }, []);

    const timeSlots = TIME_SLOTS.map((time) => {
        const timeSlot = getTimeInMinutes(time);

        for (const takenTime of takenTimes) {

            if (selectedDate && selectedDate !== "" && selectedDate === takenTime.date.slice(0, 10)) {

                if (time === takenTime.time) return { time: time, available: false }

            }
        }

        if (selectedDate === dateToday && currentTimeInMinutes > timeSlot) return { time: time, available: false }

        return { time: time, available: true }
    });


    async function handleConfirmAppointment(event) {
        event.preventDefault();

        const appointmentFields = [
            selectedService,
            selectedDate,
            selectedTime,
            fullname,
            phone,
        ];

        if (appointmentFields.some((field) => !field || field.trim() === "")) {
            toast("ERROR: one or more required fields is empty", { className: "errorToast", progressClassName: "errorProgress" });
            return;
        }

        const appointmentBody = {
            fullname: fullname,
            phone: phone,
            email: email,
            service: selectedService,
            time: selectedTime,
            date: selectedDate,
            details: details
        }

        postAppointment(appointmentBody);
    }

    //phone search functions
    async function handleSearchByPhone() {
        setShowAppointments(true)
        try {
            const foundAppointments = await getByPhone(searchPhone);
            console.log("found appointments search: ", foundAppointments.appointments);
            setAppointmentsByPhone([...foundAppointments.appointments]);

        } catch (err) {
            throw new Error("failed to load appointments array")
        }
    }

    function handleCloseAppointments() {
        setShowAppointments(false);
        setSearchPhone("");
    }

    function handleToggleAdminPanel() {
        const nextOpenState = !showAdminPanel;
        setShowAdminPanel(nextOpenState);

        if (nextOpenState) {
            setShowAppointmentSearch(false);
        }
    }



    function dateComparison(dateA, dateB) {//is date A bigger then date B
        if (dateA >= dateB) {
            return true;
        }
        return false;
    }

    return (
        <div className="appointments-page">
            {admin === true ? // admin open/close button
                <button
                    type="button"
                    className={`admin-panel-toggle-btn ${showAppointmentSearch ? "admin-toggle-search-open" : ""}`}
                    onClick={handleToggleAdminPanel}
                >
                    {showAdminPanel ? "close admin panel" : "open admin panel"}
                </button>
                : <></>
            }

            {showAdminPanel && admin === true ? //admin panel
                <AdminAppointmentPanel dateComparison={dateComparison} dateToday={dateToday} />
                : <></>
            }

            {showAppointmentSearch && ( //search appointment
                <AppointmentSearch
                    searchPhone={searchPhone}
                    setSearchPhone={setSearchPhone}
                    onClose={() => setShowAppointmentSearch(false)}
                    onSearch={handleSearchByPhone}
                />
            )}
            {!showAppointmentSearch && ( //expand search appointment
                <button
                    type="button"
                    aria-label="Open appointment search"
                    className="open-appointment-search-btn"
                    onClick={() => {
                        setShowAppointmentSearch(true);
                        setShowAdminPanel(false);
                    }}
                >
                    <span className="appointment-search-icon">+</span>
                </button>
            )}
            {showAppointments && ( //FOUND appointments template
                <AppointmentResultsTemplate
                    appointments={appointmentsByPhone}
                    onClose={handleCloseAppointments}
                    dateComparison={dateComparison}
                    dateToday={dateToday}
                />
            )}

            {!showAppointments && showAppointmentSearch && //OPEN/CLOSE appointments template
                <div className="appointment-search-reopen">
                    <button
                        type="button"
                        className="open-appointments-list"
                        onClick={() => setShowAppointments(true)}
                    >
                        open
                    </button>
                </div>
            }
            <section className="appointments-page-booking-section">
                <div className="appoint-page-title-wrapper">
                    <p className="appoint-page-eyebrow">BOOK APPOINTMENTS</p>
                    <h2>Claim your chair.</h2>
                </div>

                <form onSubmit={handleConfirmAppointment}>
                    <div className="appoint-page-select-service-div">
                        <p className="appoint-page-eyebrow">CHOOSE A SERVICE</p>
                        <div className="service-buttons-grid">
                            {services.length > 0 ? services.map((service, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={selectedService === service.serviceName ? "service-btn-selected" : "service-btn"}
                                    onClick={() => setSelectedService(service.serviceName)}
                                >
                                    {service.serviceName} <span className="service-price">{service.price}</span>
                                </button>
                            )) : <>failed to load services</>}
                        </div>
                    </div>

                    <div className="appoint-page-date-input-div">
                        <p className="appoint-page-eyebrow">CHOOSE A DATE</p>
                        <input
                            type="date"
                            min={dateToday}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime("");
                            }}
                            className="appoint-page-date-input"
                            required
                        />
                    </div>

                    <div className="appoint-page-time-input-div">
                        <p className="appoint-page-eyebrow">CHOOSE A TIME</p>
                        <div className="time-buttons-grid">
                            {timeSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`time-btn ${!slot.available ? "time-btn-unavailable" : ""} ${selectedTime === slot.time ? "time-btn-selected" : ""}`}
                                    onClick={() => slot.available && setSelectedTime(slot.time)}
                                    disabled={!slot.available}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="appoint-page-details-input-div">
                        <p className="appoint-page-eyebrow">YOUR DETAILS</p>

                        <div className="appoint-page-details-input-div-inner">
                            <div className="appoint-page-name-phone-wrapper">
                                <input type="text" onChange={(e) => { setFullname(e.target.value) }} placeholder="Full Name" required />
                                <input type="tel" onChange={(e) => { setPhone(e.target.value) }} placeholder="Phone Number" required />
                            </div>
                            <input className="appoint-page-email-input" onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Email Address (Optional)" />
                            <textarea className="appoint-page-message-input" maxlength="400" onChange={(e) => { setDetails(e.target.value) }} placeholder="Anything we should know? (Optional)"></textarea>
                        </div>
                    </div>

                    <button type="submit" className="appoint-page-submit-btn">
                        CONFIRM APPOINTMENT
                    </button>
                </form>
            </section>
        </div>
    );
}