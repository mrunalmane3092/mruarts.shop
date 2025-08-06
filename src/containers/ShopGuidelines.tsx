import "./Home.scss";
import "./ShopGuidelines.scss";

import logo from '../assets/images/LOGO.png';
import bgImage from '../assets/images/bgImage.jpg';
import { ShoppingBag, Info } from 'lucide-react';
import Header from "../components/Header";



const ShopGuidlines = () => {
    return (
        <section className="home-section guideline-home-section">
            <Header />
            <div className="info-section guideline-info-section">
                <div className="row">
                    <div className="col-lg-6 text-center">

                        <div>
                            <p className="shop-subTitle">Kindly read this before placing your order!!</p>
                        </div>
                        <div className="marginTop-50 text-left">
                            <ul>
                                <li>No refunds once product is shipped.</li>
                                <li>Processing time: 5–7 business days.</li>
                                <li>Custom orders may take longer.</li>
                                <li>Please check stock before placing an order.</li>
                            </ul>

                        </div>
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

export default ShopGuidlines;
