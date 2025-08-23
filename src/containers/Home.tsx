import "./Home.scss";
import logo from '../assets/images/LOGO.png';
import bgImage from '../assets/images/bgImage.jpg';
import { ShoppingBag, Info, HeartHandshake, ListChecks } from 'lucide-react';




import { Link } from 'react-router-dom';
import Footer from "./Footer";

const Home = () => {
    return (
        <>
            <section className="home-section">
                <div className="info-section">
                    <div className="row justifyCenter">
                        <div className="col-lg-6 text-center">
                            <div>
                                <img
                                    src={logo}
                                    alt="Shop Logo"
                                    className="img-fluid"
                                    style={{ width: '10rem' }}
                                />
                            </div>
                            <div className="shop-title">mruarts.shop</div>
                            <div>
                                <p className="shop-subTitle">Annyeong ARMY!!</p>
                                <p className="shop-subTitle">I make cute and affordable BTS merches :)</p>
                            </div>


                            <div className="infoDiv">
                                <div className="infoData">
                                    <p className=""><b>900+</b></p>
                                    <p className="">📦 Orders Shipped</p>
                                </div>
                                <div className="infoData">
                                    <p className=""><b>100+</b></p>
                                    <p className="">🛍️ Cute Products</p>
                                </div>
                            </div>

                            <div className="marginTop-50">
                                <ul className="nav-links list-unstyled">
                                    <li className="navigation-links"><Link to="/shop">🛒 Shop</Link></li>
                                    <li className="navigation-links"><Link to="/howToOrder"><ListChecks size={16} style={{ marginRight: "6px" }} /> How To Order (Tutorial)</Link></li>
                                    <li className="navigation-links"><Link to="/guidelines">📜 Order Info</Link></li>
                                    <li className="navigation-links"><Link to="/about">👩‍🎨 Meet the Artist</Link></li>

                                </ul>

                            </div>
                        </div>

                        {/* <div className="catalogue-note">
                            💜 Note: This site is currently a <b>catalogue</b> — you can browse prices and check in‑stock items.
                            Soon, Mru will make it a full shop where you can place your orders directly! 🌸
                        </div> */}

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
            <Footer />
        </>
    );
};

export default Home;
