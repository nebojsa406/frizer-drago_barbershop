import "../css/Footer.css"
import logo from "../../../assets/barbershop1Logo.png"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import { getLocation } from "../../../api/location";

export function Footer() {
        const [address, setAddress] = useState("not loaded");
        const [contactNum, setContactNum] = useState("not loaded");
        const [contactEmail, setContactEmail] = useState("not loaded");
        const [workingDays, setWorkingDays] = useState(["day", "day"]);
        const [notWorkingDays, setNotWorkingDays] = useState(["day", "day"]);
        const [workingTime, setWorkingTime] = useState(["time", "time"]);
    
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
                    
                } catch (error) {
                    console.error("Failed to load location data:", error);
                }
            };
    
            loadLocation();
        }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Left Section */}
                <div className="footer-logo-section">
                    <div className="footer-logo-section-inner">
                        <div className="footer-logo">
                            <img src={logo} alt="Frizer Drago" className="footer-logo-image" />
                        </div>
                        <div className="footer-logo-text">
                            <h2 className="footer-title">Frizer Drago</h2>
                            <p className="footer-subtitle">BARBERSHOP · EST. 2018</p>
                        </div>
                    </div>
                    
                    <p className="footer-description">
                        A neighborhood barbershop for people who'd rather sit still for thirty minutes than rush through ten.
                        Our Email: {contactEmail}
                    </p>
                </div>

                {/* Middle Sections */}
                <div className="footer-section">
                    <h3 className="footer-heading">VISIT</h3>
                    <p className="footer-text">{address}</p>
                    <p className="footer-text">First floor, Midtown</p>
                    <Link to="/location" className="footer-link">Get directions →</Link>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">HOURS</h3>
                    <p className="footer-text">{workingDays[0]} - {workingDays[1]}: {workingTime[0]} - {workingTime[1]}</p>
                    <p className="footer-text">{notWorkingDays[0]} - {notWorkingDays[1]}: Closed</p>
                    <p className="footer-text">call us: {contactNum}</p>
                </div>

                {/* Right Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">SHOP</h3>
                    <Link to="/gallery" className="footer-link">Gallery →</Link>
                    <Link to="/prices" className="footer-link">Prices →</Link>
                    <Link to="/book" className="footer-link">Book appointment →</Link>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="footer-bottom">
                <p className="footer-copyright">© 2026 FRIZER DRAGO</p>
                <p className="footer-tagline">DESIGNED FOR THE COMFORTABLE SEATING, NOT THE QUEUE</p>
            </div>
        </footer>
    );
}
