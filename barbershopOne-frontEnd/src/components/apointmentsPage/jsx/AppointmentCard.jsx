export function AppointmentCard({
    appointment,
    dateComparison,
    dateToday,
    adminView = false,
    isSelected = false,
    onClick,
}) {
    const formattedPhone = appointment.phone.replace(/^(\d{3})(\d{3})(\d{2,4})$/, "$1 $2 $3");

    return (
        <div
            onClick={onClick}
            className={`appointment-results-card ${adminView ? "appointment-admin-card" : ""} ${isSelected ? "admin-selected-card" : ""} ${appointment.done === true || !dateComparison(appointment.date, dateToday) ? "appointment-done" : ""}`}
        >
            <div className="appointment-results-card-info-div">
                <p>{appointment.service}</p>
                <p>{appointment.fullname}</p>
                <p>{appointment.date.slice(0, 10)}</p>
                <p>{appointment.time}</p>
                <p className="appointment-card-phone">{formattedPhone}</p>
                <p>{appointment.email}</p>
            </div>

            <div className={`appointment-results-card-details ${adminView ? "appointment-admin-card-details" : ""}`}>
                <p>DETAILS:</p>
                <p className="appointment-card-details-content" tabIndex={0}>{appointment.details}</p>
            </div>
        </div>
    );
}
