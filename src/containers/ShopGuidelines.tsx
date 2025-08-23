import "./Home.scss";
import "./ShopGuidelines.scss";

import logo from '../assets/images/LOGO.png';
import bgImage from '../assets/images/bgImage.jpg';
import { ShoppingBag, Info, Instagram } from 'lucide-react';
import Header from "../components/Header";
import Footer from "./Footer";



const ShopGuidlines = () => {
    return (
        <>
            <section className="home-section guideline-home-section">
                <Header />

                <div>
                    <div className="info-section guideline-info-section">
                        <div className="row">
                            <div className="col-lg-12 text-center">

                                <div>
                                    <p className="shop-subTitle">Kindly read this before placing your order!!</p>
                                </div>
                                <div className="marginTop-50 text-left">
                                    <ul>
                                        <li>❌ No refunds once the product is shipped.</li>
                                        <li>⏱ Processing time: 5–7 business days.</li>
                                        <li>🧵 Custom orders may take longer.</li>
                                        <li>💌 Shipping Charges:
                                            <ul>
                                                <li>₹50 shipping applies to non-photocard orders if the total bill is less than ₹300.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section guideline-info-section marginTop-40">
                        <div className="row">


                            <div className="col-lg-12 text-center">
                                <div>
                                    <p className="shop-subTitle">Custom photocard orders are available!!</p>
                                </div>
                                <div className="marginTop-50 text-left">
                                    <ul>
                                        <li>Maximum size: A4</li>
                                        <li>Available print finishes:
                                            <ul>
                                                <li>Matt finish</li>
                                                <li>Glossy finish (laminated single side)</li>
                                                <li>Glossy finish (laminated both sides)</li>
                                            </ul>
                                        </li>
                                        <li>₹50 shipping applies to photocard-only orders.</li>
                                        <li>For photocards, the minimum order quantity is 9 photos.</li>
                                        <li>To place a custom photocard order, DM on <strong><a
                                            href="https://www.instagram.com/mruarts.shop"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none shopDM fw-bold"
                                        >
                                            <Instagram size={18} /> @mruarts.shop
                                        </a></strong></li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <Footer />
        </>

    );
};

export default ShopGuidlines;
