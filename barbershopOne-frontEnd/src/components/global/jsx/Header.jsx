import { Link } from 'react-router-dom'
import "../css/Header.css"
import logo from "../../../assets/barbershop1Logo.png"

export function Header() {
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
