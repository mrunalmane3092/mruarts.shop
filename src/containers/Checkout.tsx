import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.scss";
import { ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import API from "../apis/api";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, subtotal, discount, total, couponApplied } =
        location.state || {
            cartItems: [],
            subtotal: 0,
            discount: 0,
            total: 0,
            couponApplied: false,
        };

    // 👇 step state: form → whatsapp → payment
    const [step, setStep] = useState<"form" | "whatsapp" | "payment">("form");

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

    // // ✅ WhatsApp order message
    // const whatsappMessage = encodeURIComponent(
    //     `🛍️ New Order!\n\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}\nIG: ${formData.igHandle}\n\nSubtotal: ₹${subtotal}\n${couponApplied ? `Discount: -₹${discount}\n` : ""}Total: ₹${total}\n\nItems:\n${cartItems
    //         .map((i: any) => `${i.name} x${i.quantity} = ₹${i.totalPrice}`)
    //         .join("\n")}`
    // );

    // const whatsappLink = `https://wa.me/919594176932?text=${whatsappMessage}`;

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

            const res = await API.post("/email/send-order-emails", {
                customerEmail: formData.email,
                customerName: formData.name,
                customerPhone: formData.phone,
                address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}`,
                orderSummary: `Subtotal: ₹${subtotal}\nDiscount: ₹${discount}\nTotal: ₹${total}\n\nItems:\n${orderSummary}`,
            });

            console.log("✅ Emails sent:", res.data);
        } catch (error) {
            console.error("❌ Error sending emails:", error);
        }
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
                        : step === "whatsapp" || step === "payment"
                            ? "done"
                            : ""
                        }`}
                >
                    <div className="circle">1</div>
                    <span>Details</span>
                </div>
                <div
                    className={`step ${step === "whatsapp"
                        ? "active"
                        : step === "payment"
                            ? "done"
                            : ""
                        }`}
                >
                    <div className="circle">2</div>
                    <span>GMail</span>
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
                        onClick={() => setStep("whatsapp")}
                        disabled={!isFormValid}>
                        Continue
                    </button>
                </div>
            )}

            {/* Step 2: WhatsApp */}
            {/* Step 2: WhatsApp */}
            {step === "whatsapp" && (
                <div className="whatsapp-step">
                    <h3>Confirm Your Order 💬</h3>
                    <p className="wa-instruction">To confirm your order, send order details to Mru:</p>
                    <button
                        className="btn-whatsapp"
                        rel="noopener noreferrer"
                        onClick={() => {
                            sendOrderEmails()
                            // updateStock();
                            // setStep("payment");
                        }}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                            alt="WhatsApp"
                            className="wa-icon"
                        />
                        Send Order Details
                    </button>
                </div>
            )}


            {/* Step 3: Payment */}
            {step === "payment" && (
                <div className="upi-payment">
                    <h3>Scan & Pay with UPI 📲</h3>
                    <QRCodeSVG value={upiLink} size={200} />
                    <p>or <a href={upiLink}>Click here</a> to pay in your UPI app</p>
                </div>
            )}
        </div>
    );
};

export default Checkout;
