export function AppointmentCard({
    appointment,
    dateComparison,
    dateToday,
    adminView = false,
    popOutView = false,
    isSelected = false,
    onClick,
}) {
    const formattedPhone = appointment.phone?.replace(/^(\d{3})(\d{3})(\d{2,4})$/, "$1 $2 $3") || "no phone";

    return (
        <div
            onClick={onClick}
            className={`appointment-results-card ${adminView ? "appointment-admin-card" : ""} ${popOutView ? "appointment-popout-card" : ""} ${isSelected ? "admin-selected-card" : ""} ${appointment.done === true || !dateComparison(appointment.date, dateToday) ? "appointment-done" : ""}`}
        >
            <div className="appointment-results-card-info-div">
                <p>{appointment.service}</p>
                <p>{appointment.fullname}</p>
                <p>{appointment.date?.slice(0, 10) || "no date"}</p>
                <p>{appointment.time}</p>
                <p className="appointment-card-phone">{formattedPhone}</p>
                <p>{appointment.email ? appointment.email : "no email"}</p>
            </div>

            <div className={`appointment-results-card-details ${adminView ? "appointment-admin-card-details" : ""}`}>
                <p>DETAILS:</p>
                <p className="appointment-card-details-content" tabIndex={0}>
                    {appointment.details || (popOutView ? "No additional details" : "")}
                </p>
            </div>
        </div>
    );
}
