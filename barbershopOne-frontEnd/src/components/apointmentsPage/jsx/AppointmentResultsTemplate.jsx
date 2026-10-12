import { AppointmentCard } from "./AppointmentCard.jsx";

export function AppointmentResultsTemplate({ appointments, onClose, dateComparison, dateToday }) {
    return (
        <div className="appointment-results-template">
            <button
                type="button"
                className="close-appointments-btn"
                onClick={onClose}
            >
                Close
            </button>
            <div className={`appointment-results-template-inner ${appointments.length > 3 ? "has-scroll" : ""}`}>
                {appointments.length !== 0 && appointments.map((item) => (
                    <AppointmentCard
                        appointment={item}
                        dateComparison={dateComparison}
                        dateToday={dateToday}
                        key={item._id}
                    />
                ))}
            </div>
        </div>
    );
}
