import "../css/locationPage.css"
import { TicketBtn } from "../../global/jsx/TicketBtn";
import { useState, useEffect } from "react";
import { getLocation } from "../../../api/location";

function LocationInfoCard({ label, title, description }) {
    return (
        <article className="location-info-card">
            <div className="location-info-label">{label}</div>
            <h3>{title}</h3>
            <p className="location-info-copy">{description}</p>
        </article>
    );
}

export function LocationPage() {
    const [address, setAddress] = useState("not loaded");
    const [contactNum, setContactNum] = useState("not loaded");
    const [contactEmail, setContactEmail] = useState("not loaded");
    const [workingDays, setWorkingDays] = useState(["day", "day"]);
    const [notWorkingDays, setNotWorkingDays] = useState(["day", "day"]);
    const [workingTime, setWorkingTime] = useState(["time", "time"]);
    const [googleMapsLink, setGoogleMapsLink] = useState(null);
    const [googleMapsEmbedLink, setGoogleMapsEmbedLink] = useState(null);

    useEffect(() => {
        const loadLocation = async () => {
            try {
                const data = await getLocation();
                const dataUnwraped = data.services[0];

                setAddress(dataUnwraped.address);
                setContactNum(dataUnwraped.contactNum);
                setContactEmail(dataUnwraped.contactEmail);
                setWorkingDays(dataUnwraped.workingDays);
                setNotWorkingDays(dataUnwraped.notWorkingDays);
                setWorkingTime(dataUnwraped.workingTime);
                setGoogleMapsLink(dataUnwraped.googleMapsLink);
                setGoogleMapsEmbedLink(dataUnwraped.googleMapsEmbedLink);
                
            } catch (error) {
                console.error("Failed to load location data:", error);
            }
        };

        loadLocation();
    }, []);
    

    return (
        <main className="location-page">
            <div className="location-container">
                <section className="location-panel">
                    <div className="location-content">
                        <div className="location-section">
                            <div className="location-label">ADDRESS</div>
                            <div className="location-address">
                                <h2>{address}</h2>
                            </div>
                            <p className="location-note">Buzzer marked Frizer Drago, come on up.</p>
                        </div>

                        <div className="location-divider" />

                        <div className="location-section">
                            <div className="location-label">HOURS</div>
                            <p className="location-text" >{workingDays[0]} - {workingDays[1]}: {workingTime[0]} - {workingTime[1]}</p>
                            <p className="location-text" >{notWorkingDays[0]} - {notWorkingDays[1]}: Closed</p>
                        </div>

                        <div className="location-divider" />

                        <div className="location-section">
                            <div className="location-label">CONTACT</div>
                            <p className="location-text">{contactNum}</p>
                            <p className="location-text">{contactEmail}</p>
                        </div>

                        <TicketBtn
                            text="Get Directions →"
                            href={googleMapsLink}
                            openInNewTab
                        />
                    </div>
                </section>

                <section className="location-map">
                    <div className="map-frame">
                        <iframe
                            title="Barbershop location"
                            src={googleMapsEmbedLink}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </section>
            </div>

            <section className="location-info-section">
                <div className="location-info-intro">
                    <p className="location-info-eyebrow">Getting Here</p>
                    <h2>Worth knowing before you come</h2>
                </div>
                <div className="location-info-grid">
                    <LocationInfoCard
                        label="PARKING"
                        title="Street & Garage"
                        description="Metered street parking west side of building"
                    />
                    <LocationInfoCard
                        label="ACCESS"
                        title="First Floor"
                        description="Front building entrance with our bussines name above easy to locate"
                    />
                </div>
            </section>
        </main>
    )
}