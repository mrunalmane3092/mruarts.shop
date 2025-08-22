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

        validateField(name, value);
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
        errors.postalCode === "" &&
        errors.phone === "" &&
        errors.alternatePhone === "";

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
    const upiLink = `upi://pay?pa=mrunal3092@okaxis&pn=MRU%20Arts&am=${total}&cu=INR`;


    const updateStock = async () => {
        try {
            const items = cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const res = await API.put("/orders", { items });
            console.log("✅ Stock updated:", res.data);
        } catch (error) {
            console.error("❌ Error updating stock:", error);
        }
    };

    const sendOrderEmails = async () => {
        try {
            const orderSummary = cartItems
                .map((i: any) => `${i.name} x${i.quantity} = ₹${i.totalPrice}`)
                .join("\n");

            const payload = {
                customerEmail: formData.email, // 👈 add email field in your form
                customerName: formData.name,
                orderSummary: `Subtotal: ₹${subtotal}\n${couponApplied ? `Discount: ₹${discount}\n` : ""}Total: ₹${total}\n\nItems:\n${orderSummary}\n\nShipping Address:\n${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}\n\nPhone: ${formData.phone}\nAlternate Phone: ${formData.alternatePhone}\nIG Handle: ${formData.igHandle}`,
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
    };
    return (
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
                <div className="summary-item">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                </div>
                {couponApplied && discount > 0 && (
                    <div className="summary-item discount">
                        <span>Discount:</span>
                        <span>- ₹{discount}</span>
                    </div>
                )}
                <div className="summary-item total">
                    <strong>Total:</strong>
                    <strong>₹{total}</strong>
                </div>
            </div>

            {/* ✅ Cart Items */}
            <div className="cart-items-checkout">
                <h2>Your Cart 🛍️</h2>
                {cartItems.length === 0 ? (
                    <p>No items in cart</p>
                ) : (
                    <table className="cart-table-checkout">
                        <tbody>
                            {cartItems.map((item: any) => (
                                <tr key={item.id}>
                                    <td>{item.name} ({item.quantity})</td>
                                    <td>₹{item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
                    <input type="text" name="city" placeholder="City"
                        value={formData.city} readOnly />
                    <input type="text" name="state" placeholder="State"
                        value={formData.state} readOnly />
                    <input type="text" name="phone" placeholder="Phone Number"
                        value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                    <input type="text" name="alternatePhone" placeholder="Alternate Phone Number (Optional)"
                        value={formData.alternatePhone} onChange={handleChange} />
                    {errors.alternatePhone && <p className="error-text">{errors.alternatePhone}</p>}
                    <input type="text" name="igHandle" placeholder="IG Handle (e.g. @yourhandle)"
                        value={formData.igHandle} onChange={handleChange} />

                    <button className="btn-pay"
                        onClick={() => {
                            setStep("orderMail");
                            setShowModal(true);
                        }}
                        disabled={!isFormValid}>
                        Continue
                    </button>
                </div>
            )}

            {/* Step 2: orderMail */}
            {step === "orderMail" && (
                <div className="whatsapp-step">
                    <h3>Confirm Your Order 💬</h3>
                    <p className="wa-instruction">To confirm your order, send order details to Mru:</p>
                    <button
                        className="btn-whatsapp"
                        rel="noopener noreferrer"
                        onClick={() => {
                            sendOrderEmails();
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
                    <h3
                        style={{
                            fontSize: "20px",
                            marginBottom: "8px",
                            color: "#333",
                        }}
                    >
                        Scan & Pay with UPI 📲
                    </h3>
                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                        <strong>Mrunal Mane</strong> (mruarts.shop)
                    </p>

                    {/* QR Code */}
                    <QRCodeSVG id="upi-qr" value={upiLink} size={220} />
                    <p style={{ marginTop: "12px", fontSize: "14px", color: "#444" }}>
                        or{" "}
                        <a href={upiLink} style={{ color: "#8b5cf6", fontWeight: "bold" }}>
                            Click here
                        </a>{" "}
                        to pay in your UPI app
                    </p>

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
                                navigate("/shop");
                            }}
                        >
                            <CheckCircle size={20} color="#16a34a" />
                            Payment Done
                        </button>
                    </div>

                </div>
            )}


            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header>
                    <Modal.Title>
                        <p>💜 To Confirm Your Order</p>
                        <p className="">Just 3 quick steps to complete your order:</p>
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>
                    <ul className="list-group mt-3">
                        <li className="list-group-item">👉 <strong>Step 1:</strong> Click on button to send your order details to Mru</li>
                        <li className="list-group-item">👉 <strong>Step 2:</strong> Pay via UPI (QR/Link).</li>
                        <li className="list-group-item">👉 <strong>Step 3:</strong> DM payment screenshot to <strong>@mruarts.shop</strong> on Instagram.</li>
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Got it!
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-center" autoClose={3000} />
        </div>


    );
};

export default Checkout;
