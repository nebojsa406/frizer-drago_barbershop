
import bgImage from '../../../../assets/barbershop-interior-1.jpeg';
import '../css/HeroHome.css';
import { TicketBtn } from '../../global/jsx/TicketBtn';
import { Link } from 'react-router-dom'

export function HeroHome() {
    return (
        <section
            className="heroHome"
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(9, 8, 7, 0.25) 0%, rgba(9, 8, 7, 0.95) 90%), url(${bgImage})`,
            }}
        >
            <div className="heroHome-overlay" />
            <div className="heroHome-content">
                <div className="heroHome-title-group heroHome-piece">
                    <p className="heroHome-eyebrow">MIDTOWN · WALK-INS WELCOME AFTER 4PM</p>
                    <h1 className="heroHome-title">
                        Sit down.
                        <br /> Look <span>sharp.</span>
                    </h1>
                </div>
                <p className="heroHome-description heroHome-piece heroHome-piece--second">
                    A chair, a straight razor, and no reason to rush. Cuts, beard work and hot towel shaves done properly, in a room that respects the craft.
                </p>
                <div className="heroHome-actions heroHome-piece heroHome-piece--third">
                    <TicketBtn text="Book your chair →" href="/book" />
                    <Link to="/gallery" className="heroHome-gallery-link" href="#shop">See the shop →</Link>
                </div>
            </div>
        </section>
    );
}
