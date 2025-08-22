import "./Home.scss";
import "./OrderProcess.scss";

import logo from '../assets/images/LOGO.png';
import bgImage from '../assets/images/bgImage.jpg';
import { ShoppingBag, Info, QrCode, CheckCircle2, Instagram } from 'lucide-react';
import Header from "../components/Header";
import Footer from "./Footer";
import { Button, Carousel, Modal } from "react-bootstrap";
import { useState } from "react";
import Loader from "./Loader";

const OrderProcess = () => {
    const [showStepsModal, setShowStepsModal] = useState(false);
    const steps = [
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868661/9_zdnzc7.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868656/1_cdjpkc.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868657/2_jethim.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868658/3_t0i4gj.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868658/4_g5q49x.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868659/5_mzrxcl.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868659/6_zbial6.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868659/7_dqgbs7.jpg",
        "https://res.cloudinary.com/dxerpx7nt/image/upload/v1755868700/9_gvbjy9.jpg"
    ];



    // Track loading state for each image
    const [loadingStates, setLoadingStates] = useState(
        Array(steps.length).fill(true)
    );

    const handleImageLoad = (index: number) => {
        setLoadingStates((prev) => {
            const updated = [...prev];
            updated[index] = false;
            return updated;
        });
    };

    return (
        <>
            <section
                className="home-section guideline-home-section marginTop-40"
            >
                <Header />
                <div className="info-section guideline-info-section container text-center py-5">

                    {/* Title */}
                    <h1 className="guideline-title mb-3">🤔 How to Order??</h1>


                    {/* Steps to Order */}
                    <div className="guideline-card p-2  mb-2">
                        <h2 className="mb-4">🛍️ Steps to Place Your Order</h2>
                        <ul className="guideline-steps list-unstyled text-start mx-auto" style={{ maxWidth: "600px" }}>
                            <li className="d-flex align-items-start gap-3 mb-3">
                                <ShoppingBag size={30} strokeWidth={2.5} color="#ec4899" />
                                <span><strong>Step 1:</strong> Browse products in the <em>Shop</em> and add them to your cart.</span>
                            </li>
                            <li className="d-flex align-items-start gap-3 mb-3">
                                <Info size={30} strokeWidth={2.5} color="#3b82f6" />
                                <span><strong>Step 2:</strong> Proceed to cart and click the button to send your order details to me.</span>
                            </li>
                            <li className="d-flex align-items-start gap-3 mb-3">
                                <QrCode size={30} strokeWidth={2.5} color="#8b5cf6" />
                                <span><strong>Step 3:</strong> Scan the UPI QR at checkout and click the button Payment Done.</span>
                            </li>
                            <li className="d-flex align-items-start gap-3 mb-3">
                                <Instagram size={30} strokeWidth={2.5} color="#ec4899" />
                                <span><strong>Step 4:</strong> Send your payment screenshot to <strong>@mruarts.shop</strong> on Instagram.</span>
                            </li>
                            <li className="d-flex align-items-start gap-3">
                                <CheckCircle2 size={30} strokeWidth={2.5} color="#10b981" />
                                <span><strong>Step 5:</strong> Once confirmed, I’ll share your shipping details 📦</span>
                            </li>
                        </ul>

                        <div className="text-center mt-4">
                            <Button
                                variant="primary"
                                style={{
                                    background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                }}
                                onClick={() => setShowStepsModal(true)}
                            >
                                View Steps Guide 📖
                            </Button>
                        </div>
                    </div>


                    {/* Why No Payment Gateway */}
                    <div className="guideline-card p-2 ">
                        <h2 className="d-flex align-items-center gap-2 mb-3">
                            Why no online payment gateway?
                        </h2>
                        <p>
                            Online payment gateways charge <strong>extra fees (around 2% + 18% GST ≈ 20%)</strong>.
                            That would increase product prices, and I don’t want that for you.
                        </p>

                        <p>
                            To keep things <strong>simple and affordable</strong>, payments are done directly
                            via <strong>UPI QR</strong>. Just send the payment screenshot to
                            <strong>@mruarts.shop</strong> on Instagram, and once confirmed,
                            your order will be placed ✅
                        </p>
                    </div>

                    {/* Closing Note */}
                    <p className="mt-5 fw-bold" style={{ color: "#8b5cf6" }}>
                        ✨ No extra fees, no hidden charges—just smooth, affordable shopping with love 💜
                    </p>
                </div>
            </section>
            <Modal show={showStepsModal} onHide={() => setShowStepsModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        💜 How to Place Your Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: "linear-gradient(135deg,#d9c1f2,#fdf2f8)" }}>
                    <Carousel indicators interval={null}>
                        {steps.map((img, idx) => (
                            <Carousel.Item key={idx}>
                                <div className="text-center">
                                    <span className="fontSize-13px">Step {idx + 1}</span>
                                </div>
                                <div>
                                    {loadingStates[idx] && (
                                        <Loader />
                                    )}
                                    <img
                                        className="d-block w-100"
                                        src={`${img}`}
                                        alt={`step${idx + 1}`}
                                        style={{
                                            maxHeight: "500px",
                                            objectFit: "contain",
                                            display: loadingStates[idx] ? "none" : "block"
                                        }}
                                        onLoad={() => handleImageLoad(idx)}

                                    />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>

            </Modal>

            <Footer />
        </>
    );
};

export default OrderProcess;

