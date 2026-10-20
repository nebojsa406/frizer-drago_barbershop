import '../css/InsideShopHome.css';
import interiorImageOne from '../../../../assets/barbershop-interior-1.jpeg';
import interiorImageTwo from '../../../../assets/barbershop-interior-2.webp';
import exteriorImageOne from '../../../../assets/barbershop-exterior-1.png';
import { Link } from 'react-router-dom'

const galleryImages = [
    {
        id: 1,
        objectPosition: 'center center',
        alt: 'Barbershop interior view 1',
        assetImage: interiorImageOne
    },
    {
        id: 2,
        objectPosition: 'center top',
        alt: 'Barbershop exterior view 1',
        assetImage: interiorImageTwo
    },
    {
        id: 3,
        objectPosition: 'center bottom',
        alt: 'Barbershop interior view 2',
        assetImage: exteriorImageOne
    },
];

export function InsideShopHome() {
    return (
        <section className="insideShopHome">
            <div className="insideShopHome-inner">
                <div className="insideShopHome-header">
                    <div>
                        <p className="insideShopHome-eyebrow">INSIDE THE SHOP</p>
                        <h2 className="insideShopHome-title">A look around</h2>
                    </div>
                    <p className="insideShopHome-copy">
                        Wood, brass and low light — built to sit in for longer than you planned.
                    </p>
                </div>

                <div className="insideShopHome-grid">
                    {galleryImages.map((card) => (
                        <article key={card.id} className="insideShopHome-card">
                            <img
                                loading='lazy'
                                className="insideShopHome-thumb"
                                src={card.assetImage}
                                style={{ objectPosition: card.objectPosition }}
                                alt={card.alt}
                            />
                        </article>
                    ))}
                </div>

                <Link className="insideShopHome-link" to="/gallery"> View full gallery </Link>
            </div>
        </section>
    );
}

