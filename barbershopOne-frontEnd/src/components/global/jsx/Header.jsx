import { Link } from 'react-router-dom';
import "../css/Header.css";
import logo from "../../../assets/barbershop1Logo.png";
import { useState } from "react" ;
import { logout } from "../../../api/admin";

export function Header({ admin, setUser }) {
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogout(event) {
        event.preventDefault();
        setErrorMessage("");

        try {
            const logoutData = await logout(setUser);
            if (logoutData.status >= 300) {
                throw new Error(logoutData?.message || "oops something went wrong! try again later.");
            }
            console.log(logoutData.body);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link to="/" className="brand">
                    <div className="logo-wrap">
                        <img src={logo} alt="Frizer Drago" className="logo-img" />
                    </div>
                    <div className="brand-text">
                        <div className="brand-title">Frizer Drago</div>
                        <div className="brand-sub">BARBERSHOP · EST. 2018</div>
                    </div>
                </Link>

                {admin ?
                    <Link to="/" className="logout-wrap-link"><button onClick={(e) => handleLogout(e)} className="log-out">LOG OUT</button></Link>
                    : <></>
                }

                <nav className="site-nav" aria-label="Primary navigation">
                    <Link to="/location" className="nav-link">LOCATION</Link>
                    <Link to="/gallery" className="nav-link">GALLERY</Link>
                    <Link to="/prices" className="nav-link">PRICES</Link>
                    <Link to="/book" className="btn-book-wrap-link"><button className="btn-book">BOOK APPOINTMENT</button></Link>
                </nav>
            </div>
        </header>
    );
}
