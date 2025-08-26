import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.scss";
import { ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import API from "../apis/api";
import { Button, Modal } from "react-bootstrap";
import { CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useCart } from "../context/CartContext";
import Footer from "./Footer";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { cartItems, subtotal, discount, total, couponApplied } =
        location.state || {
            cartItems: [],
            subtotal: 0,
            discount: 0,
            total: 0,
            couponApplied: false,
        };

    // Add shipping logic
    const shipping = total < 300 ? 50 : 0;
    const finalTotal = total + shipping;

    // 👇 step state: form → whatsapp → payment
    const [step, setStep] = useState<"form" | "orderMail" | "payment">("form");

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
        city: "",
        postalCode: "",
        phone: "",
        igHandle: "",
        state: "",
        alternatePhone: "",
        country: ""
    });

    const [errors, setErrors] = useState({
        postalCode: "",
        phone: "",
        alternatePhone: "",
    });

    const [showModal, setShowModal] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        let { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (localStorage.getItem('INTERNATIONAL') !== 'true') {
            validateField(name, value);
        }
    };

    // Auto-fill city/state by postal code
    useEffect(() => {
        const fetchLocation = async () => {
            if (formData.postalCode.length === 6) {
                try {
                    const res = await fetch(
                        `https://api.postalpincode.in/pincode/${formData.postalCode}`
                    );
                    const data = await res.json();
                    if (data[0].Status === "Success") {
                        const postOffice = data[0].PostOffice[0];
                        setFormData((prev) => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State,
                            country: postOffice.Country,
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching pincode data:", error);
                }
            }
        };

        fetchLocation();
    }, [formData.postalCode]);

    const isFormValid =
        Object.entries(formData)
            .filter(([key]) => key !== "alternatePhone")
            .every(([_, value]) => value.trim() !== "") &&
        !errors.postalCode &&
        !errors.phone &&
        !errors.alternatePhone;


    const validateField = (name: string, value: string) => {
        let error = "";

        if (name === "postalCode") {
            if (!/^\d{6}$/.test(value)) {
                error = "Postal code must be 6 digits";
            }
        }

        if (name === "phone") {
            if (!/^\d{10}$/.test(value)) {
                error = "Phone number must be 10 digits";
            }
        }

        if (name === "alternatePhone" && value.trim() !== "") {
            if (!/^\d{10}$/.test(value)) {
                error = "Alternate phone must be 10 digits";
            }
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    // ✅ UPI link
    const gpayLink = `tez://upi/pay?pa=mrunal3092@okaxis&pn=MRU%20Arts&am=${finalTotal}&cu=INR`;
    const phonepeLink = `phonepe://pay?pa=mrunal3092@okaxis&pn=MRU%20Arts&am=${finalTotal}&cu=INR`;
    const paytmLink = `paytm://upi/pay?pa=mrunal3092@okaxis&pn=MRU%20Arts&am=${finalTotal}&cu=INR`;
    const upiLink = `upi://pay?pa=mrunal3092@okaxis&pn=MRU%20Arts&am=${finalTotal}&cu=INR`;


    const updateStock = async () => {
        try {
            const items = cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const res = await API.put("/orders", { items });
            console.log("✅ Stock updated:", res.data);
            sendOrderEmails();

        } catch (error) {
            toast.success("Error updating stock ❌");
            console.error("❌ Error updating stock:", error);
        }
    };

    const sendOrderEmails = async () => {
        try {
            const orderSummary = cartItems
                .map((i: any, index: number) => `${index + 1}. ${i.name} x${i.quantity} = ₹${i.totalPrice}`)
                .join("\n");

            const shipping = total < 300 ? 50 : 0;
            const finalTotal = total + shipping;

            const payload = {
                customerEmail: formData.email,
                customerName: formData.name,
                orderSummary: `Subtotal: ₹${subtotal}
                ${couponApplied ? `Discount: ₹${discount}\n` : ""}${shipping > 0 ? `Shipping: ₹${shipping}\n` : ""}Total: ₹${finalTotal}

                Items:
                ${orderSummary}

                Shipping Address:
                ${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}

                Phone: ${formData.phone}
                Alternate Phone: ${formData.alternatePhone}
                IG Handle: ${formData.igHandle}`,
            };

            const res = await API.post("/email/send-order-emails", payload);
            toast.success("Order details sent successfully ✅");
            console.log("✅ Emails sent:", res.data);
        } catch (error) {
            console.error("❌ Error sending emails:", error);
            toast.error("Failed to send order details ❌");
        }
    };

    const clearCartValue = () => {
        clearCart();
        toast.success("Thanks for shopping 💜");

        setTimeout(() => {
            navigate("/");
        }, 3010)
    };


    return (
        <>

            <div className="checkout-container">
                <button className="btn btn-outline" onClick={() => navigate("/shop")}>
                    <ArrowLeft size={18} /> Shop More
                </button>

                {/* ✅ Step Progress */}
                <div className="steps">
                    <div
                        className={`step ${step === "form"
                            ? "active"
                            : step === "orderMail" || step === "payment"
                                ? "done"
                                : ""
                            }`}
                    >
                        <div className="circle">1</div>
                        <span>Fill Details</span>
                    </div>
                    <div
                        className={`step ${step === "orderMail"
                            ? "active"
                            : step === "payment"
                                ? "done"
                                : ""
                            }`}
                    >
                        <div className="circle">2</div>
                        <span>Send Details</span>
                    </div>

                    <div className={`step ${step === "payment" ? "active" : ""}`}>
                        <div className="circle">3</div>
                        <span>Payment</span>
                    </div>
                </div>

                {/* ✅ Order Summary */}
                <div className="order-summary">
                    <h2>Order Summary 🛒</h2>

                    <div className="cart-items-checkout">
                        {cartItems.length === 0 ? (
                            <p>No items in cart</p>
                        ) : (
                            <table className="cart-table-checkout">
                                <tbody>
                                    {cartItems.map((item: any, index: number) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}. </td>
                                            <td>{item.name} ({item.quantity})</td>
                                            <td> {localStorage.getItem('INTERNATIONAL') === 'true'
                                                ? `$${(
                                                    item.totalPrice *
                                                    parseFloat(localStorage.getItem('USD_RATE') ?? "0")
                                                ).toFixed(2)}`
                                                : `₹${item.totalPrice}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {localStorage.getItem('INTERNATIONAL') !== 'true' && (

                        <>
                            <div className="summary-item">
                                <span>Subtotal:</span>
                                <span>₹{subtotal}</span>
                            </div>

                            {total < 300 && (
                                <div className="summary-item">
                                    <span>Shipping:</span>
                                    <span>₹50</span>
                                </div>
                            )}

                            {couponApplied && discount > 0 && (
                                <div className="summary-item discount">
                                    <span>Discount:</span>
                                    <span>- ₹{discount}</span>
                                </div>
                            )}
                        </>
                    )}


                    {localStorage.getItem('INTERNATIONAL') === 'true' && (
                        <div className="summary-item total">
                            <span>PayPal Fees:</span>
                            <span>
                                {(() => {
                                    const usdRate = parseFloat(localStorage.getItem("USD_RATE") ?? "0");
                                    const subtotalUSD = finalTotal * usdRate;
                                    const finalTotalUSD = (subtotalUSD + 0.30) / (1 - 0.044);
                                    const paypalFee = finalTotalUSD - subtotalUSD;
                                    return `$${paypalFee.toFixed(2)}`;
                                })()}
                            </span>
                        </div>

                    )}


                    <div className="summary-item total">
                        <strong>Total:</strong>
                        <strong>
                            {localStorage.getItem("INTERNATIONAL") === "true"
                                ? (() => {
                                    const usdRate = parseFloat(localStorage.getItem("USD_RATE") ?? "0");
                                    const subtotalUSD = finalTotal * usdRate;
                                    // Gross-up formula for PayPal (4.4% + $0.30)
                                    const finalTotalUSD = (subtotalUSD + 0.30) / (1 - 0.044);
                                    return `$${finalTotalUSD.toFixed(2)}`;
                                })()
                                : `₹${finalTotal}`}
                        </strong>
                    </div>
                </div>



                {/* Step 1: Form */}
                {step === "form" && (
                    <div className="checkout-form">
                        <h2>Shipping Details 📦</h2>
                        <input type="text" name="name" placeholder="Full Name"
                            value={formData.name} onChange={handleChange} />
                        <textarea name="address" placeholder="Address"
                            value={formData.address} onChange={handleChange} rows={3} />
                        <input type="email" name="email" placeholder="Email"
                            value={formData.email} onChange={handleChange} />

                        <input type="text" name="postalCode" placeholder="Postal Code"
                            value={formData.postalCode} onChange={handleChange} />
                        {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}


                        {localStorage.getItem('INTERNATIONAL') === 'true' ? (
                            <input type="text" name="city" placeholder="City"
                                onChange={handleChange} value={formData.city} />
                        ) : (
                            <input type="text" name="city" placeholder="City"
                                value={formData.city} readOnly />
                        )}

                        {localStorage.getItem('INTERNATIONAL') === 'true' ? (
                            <input type="text" name="state" placeholder="State"
                                onChange={handleChange} value={formData.state} />
                        ) : (
                            <input type="text" name="state" placeholder="State"
                                value={formData.state} readOnly />
                        )}


                        {localStorage.getItem('INTERNATIONAL') === 'true' ? (
                            <input type="text" name="country" placeholder="Country"
                                onChange={handleChange} value={formData.country} />
                        ) : (
                            <input type="text" name="country" placeholder="Country"
                                value={formData.country} readOnly />
                        )}

                        <input type="text" name="phone" placeholder="Phone Number"
                            value={formData.phone} onChange={handleChange} />
                        {errors.phone && <p className="error-text">{errors.phone}</p>}

                        <input type="text" name="alternatePhone" placeholder="Alternate Phone Number (Optional)"
                            value={formData.alternatePhone} onChange={handleChange} />
                        {errors.alternatePhone && <p className="error-text">{errors.alternatePhone}</p>}

                        <input type="text" name="igHandle" placeholder="IG Handle (e.g. @yourhandle)"
                            value={formData.igHandle} onChange={handleChange} />

                        <button
                            className="btn-pay"
                            onClick={() => {
                                setStep("orderMail");
                                setShowModal(true);
                            }}
                            disabled={!isFormValid}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: orderMail */}
                {step === "orderMail" && (
                    <div className="whatsapp-step">
                        <h3>Confirm Your Order 💬</h3>
                        <p className="wa-instruction">To confirm your order, send order details to Mru:</p>

                        <p style={{
                            color: "red",
                            fontWeight: "bold",
                            marginBottom: "10px"
                        }}>
                            ⚠️ Click "Send Order Details" only if you are ready to buy now!
                        </p>
                        <button
                            className="btn-whatsapp"
                            rel="noopener noreferrer"
                            onClick={() => {
                                // updateStock();
                                setStep("payment");
                            }}
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                                alt="orderMail"
                                className="wa-icon"
                            />
                            Send Order Details
                        </button>
                    </div>
                )}


                {/* Step 3: Payment */}
                {step === "payment" && (
                    <>
                        {localStorage.getItem("INTERNATIONAL") === "true" ? (
                            (() => {
                                const usdRate = parseFloat(localStorage.getItem("USD_RATE") ?? "0");
                                const subtotalUSD = finalTotal * usdRate;
                                const finalTotalUSD = (subtotalUSD + 0.30) / (1 - 0.044);

                                // PayPal.Me link with amount
                                const paypalLink = `https://www.paypal.me/mruarts/${finalTotalUSD.toFixed(2)}`;

                                return (
                                    <div className="payment-section mt-4">
                                        <h2 className="payment-title">🌎 Pay with PayPal</h2>


                                        <div className="upi-buttons">
                                            <a
                                                href={paypalLink}
                                                className="upi-btn paypal-btn"
                                                title="Pay with PayPal"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {/* PayPal logo (inline SVG) */}
                                                <svg
                                                    role="img"
                                                    aria-label="PayPal"
                                                    viewBox="0 0 24 24"
                                                    width="28"
                                                    height="28"
                                                >
                                                    <path
                                                        d="M7.08 21.75l.93-5.9h3.7c3.12 0 5.8-2.27 6.3-5.35.56-3.36-1.97-5.6-5.23-5.6H6.02c-.36 0-.66.26-.72.6L2.25 21.15c-.06.35.2.67.55.67H6.4c.31 0 .58-.23.62-.52z"
                                                        fill="#003087"
                                                    />
                                                    <path
                                                        d="M18.01 4.9c.73 1 .98 2.34.76 3.75-.5 3.08-3.18 5.35-6.3 5.35H8.47l-.7 4.45c-.04.29-.31.52-.62.52H4.24c-.35 0-.6-.32-.55-.67l3.05-18.9c.06-.34.36-.6.72-.6h6.75c2.12 0 3.76.73 4.8 2.1z"
                                                        fill="#009cde"
                                                    />
                                                </svg>
                                            </a>
                                        </div>



                                        <div className="backToShop">
                                            <button
                                                className="btn btn-light mt-4 d-flex align-items-center justify-content-center gap-2 shadow px-3 py-2 rounded-pill"
                                                onClick={() => {
                                                    clearCartValue();
                                                }}
                                            >
                                                <CheckCircle size={20} color="#16a34a" />
                                                Payment Done
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            // ---- UPI Block (Indian Customers) ----
                            <div
                                className="upi-payment"
                                style={{
                                    maxWidth: "400px",
                                    margin: "20px auto",
                                    padding: "20px",
                                    borderRadius: "16px",
                                    background: "#fff",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    textAlign: "center",
                                    fontFamily: "'Fugaz One', sans-serif",
                                }}
                            >
                                {/* Title */}
                                <h3 style={{ fontSize: "20px", marginBottom: "8px", color: "#333" }}>
                                    Scan & Pay with UPI 📲
                                </h3>
                                <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                                    <strong>Mrunal Mane</strong> (mruarts.shop)
                                </p>

                                {/* QR Code */}
                                <QRCodeSVG id="upi-qr" value={upiLink} size={220} />

                                <div className="payment-section">
                                    <h2 className="payment-title">💳 Choose Payment Method</h2>
                                    <p className="payment-subtext">Pay securely using your preferred UPI app:</p>

                                    <div className="upi-buttons">
                                        <a href={gpayLink} className="upi-btn" title="Google Pay">
                                            <img
                                                src="https://res.cloudinary.com/dxerpx7nt/image/upload/v1755887422/icons8-google-pay-500_efuikn.png"
                                                alt="gPay"
                                            />
                                        </a>

                                        <a href={phonepeLink} className="upi-btn" title="PhonePe">
                                            <img
                                                src="https://res.cloudinary.com/dxerpx7nt/image/upload/v1755887453/icons8-phone-pe-480_bpiulq.png"
                                                alt="phonePe"
                                            />
                                        </a>

                                        <a href={paytmLink} className="upi-btn" title="Paytm">
                                            <img
                                                src="https://res.cloudinary.com/dxerpx7nt/image/upload/v1755887415/icons8-paytm-500_thptvm.png"
                                                alt="paytm"
                                            />
                                        </a>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => {
                                        const el = document.getElementById("upi-qr");
                                        if (!el || !(el instanceof SVGSVGElement)) return;

                                        const serializer = new XMLSerializer();
                                        const source = serializer.serializeToString(el);

                                        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
                                        const url = URL.createObjectURL(svgBlob);

                                        const link = document.createElement("a");
                                        link.href = url;
                                        link.download = "mruarts-shop-qr.svg";
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);

                                        URL.revokeObjectURL(url);
                                    }}
                                    style={{
                                        marginTop: "20px",
                                        padding: "10px 18px",
                                        borderRadius: "12px",
                                        border: "none",
                                        background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                                        color: "white",
                                        fontSize: "15px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                        transition: "transform 0.2s",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                    ⬇️ Download QR
                                </button>

                                <div className="backToShop">
                                    <button
                                        className="btn btn-light mt-4 d-flex align-items-center justify-content-center gap-2 shadow px-3 py-2 rounded-pill"
                                        onClick={() => {
                                            clearCartValue();
                                        }}
                                    >
                                        <CheckCircle size={20} color="#16a34a" />
                                        Payment Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}



                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header>
                        <Modal.Title className="font16">
                            <p>💜 To Confirm Your Order</p>
                            <p className="">Just 3 quick steps to complete your order:</p>
                        </Modal.Title>

                    </Modal.Header>

                    <Modal.Body>
                        <ul className="list-group mt-3 font14">
                            <li className="list-group-item">👉 <strong>Step 1:</strong> Click on button to send your order details to Mru</li>
                            <li className="list-group-item">👉 <strong>Step 2:</strong> Pay via UPI (QR/Link).</li>
                            <li className="list-group-item">👉 <strong>Step 3:</strong> DM payment screenshot to <strong>@mruarts.shop</strong> on Instagram.</li>
                        </ul>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" className="font14" onClick={() => setShowModal(false)}>
                            Got it!
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ToastContainer position="top-center" autoClose={3000} />

            </div>
            <Footer />
        </>

    );
};

export default Checkout;
