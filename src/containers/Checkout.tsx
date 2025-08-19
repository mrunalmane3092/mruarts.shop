import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.scss";
import { ArrowLeft } from "lucide-react";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, subtotal, discount, total, couponApplied } = location.state || {
        cartItems: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        couponApplied: false,
    };

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        igHandle: "",
        state: "",
        alternatePhone: ""
    });

    const [errors, setErrors] = useState({
        postalCode: "",
        phone: "",
        alternatePhone: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        let { name, value } = e.target;

        if (name === "igHandle") {
            // Always keep "@" at the start
            if (!value.startsWith("@")) {
                value = "@" + value.replace(/^@+/, "");
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateField(name, value);
    };

    // ✅ Auto-fill city/state based on postal code
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

    const isFormValid = Object.entries(formData)
        .filter(([key]) => key !== "alternatePhone") // exclude optional field
        .every(([_, value]) => value.trim() !== "");

    const handlePlaceOrder = () => {
        if (!isFormValid) return;
        alert(
            `🎉 Order placed!\nSubtotal: ₹${subtotal}\n` +
            (couponApplied ? `Discount: -₹${discount}\n` : "") +
            `Total Paid: ₹${total}`
        );
    };

    const navigateToShop = () => {
        navigate("/shop");
    };

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

    return (
        <div className="checkout-container">
            <button className="btn btn-outline" onClick={navigateToShop}>
                <ArrowLeft size={18} /> Shop More
            </button>

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

            {/* Address Form */}
            <div className="checkout-form">
                <h2>Shipping Details 📦</h2>
                <input type="text" name="name" placeholder="Full Name"
                    value={formData.name} onChange={handleChange} />
                <textarea name="address" placeholder="Address"
                    value={formData.address} onChange={handleChange} rows={3}
                    className="address-textarea" />
                <input type="text" name="postalCode" placeholder="Postal Code"
                    value={formData.postalCode} onChange={handleChange} />
                {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}
                <input type="text" name="city" placeholder="City"
                    value={formData.city} onChange={handleChange} readOnly />
                <input type="text" name="state" placeholder="State"
                    value={formData.state} onChange={handleChange} readOnly />
                <input type="text" name="phone" placeholder="Phone Number"
                    value={formData.phone} onChange={handleChange} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
                <input type="text" name="alternatePhone" placeholder="Alternate Phone Number"
                    value={formData.alternatePhone} onChange={handleChange} />
                {errors.alternatePhone && <p className="error-text">{errors.alternatePhone}</p>}
                <input type="text" name="igHandle" placeholder="IG Handle"
                    value={formData.igHandle} onChange={handleChange} />

                <button className="btn-pay"
                    onClick={handlePlaceOrder}
                    disabled={!isFormValid}>
                    Proceed to Pay ₹{total}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
