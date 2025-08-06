import "./Home.scss";
import logo from '../assets/images/LOGO.png';
import bgImage from '../assets/images/bgImage.jpg';
import { ShoppingBag, Info, HeartHandshake } from 'lucide-react';




import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="home-section">
            <div className="info-section">
                <div className="row">
                    <div className="col-lg-6 text-center">
                        <div>
                            <img
                                src={logo}
                                alt="Shop Logo"
                                className="img-fluid"
                                style={{ width: '15rem' }}
                            />
                        </div>
                        <div className="shop-title">mruarts.shop</div>
                        <div>
                            <p className="shop-subTitle">Annyeong ARMY!!</p>
                            <p className="shop-subTitle">I make cute and affordable BTS merches :)</p>
                        </div>
                        <div className="marginTop-50">
                            <ul className="nav-links list-unstyled">
                                <li className="navigation-links"><Link to="/shop">Shop <ShoppingBag size={24} color="#4b0082" /></Link></li>
                                {/* <li className="navigation-links"><Link to="/about">About Us <Info size={24} color="#4b0082" /></Link></li> */}
                                <li className="navigation-links"><Link to="/shop-guidelines">Guidelines <HeartHandshake size={24} color="#4b0082" /></Link></li>

                            </ul>

                        </div>
                    </div>

                    <div className="catalogue-note">
                        💜 Note: This site is currently a <b>catalogue</b> — you can browse prices and check in‑stock items.
                        Soon, Mru will make it a full shop where you can place your orders directly! 🌸
                    </div>

                    <div className="col-lg-6 text-center">
                        <div>
                            <img
                                src={bgImage}
                                alt="Shop Logo"
                                className="img-fluid"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
