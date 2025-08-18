import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.scss";
import { X } from "lucide-react";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { subtotal, discount, total } = location.state || {
        subtotal: 0,
        discount: 0,
        total: 0,
    };

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const isFormValid = Object.values(formData).every((field) => field.trim() !== "");

    const handlePlaceOrder = () => {
        if (!isFormValid) return;
        alert(`Order placed!\nTotal Paid: ₹${total}`);
    };

    const navigateToShop = () => {

    };

    return (
        <div className="checkout-container">
            <button className="close-btn">
                <X size={20} onClick={navigateToShop} />
            </button>
            {/* Order Summary */}
            <div className="order-summary">
                <h2>Order Summary 🛒

                </h2>
                <div className="summary-item">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
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

            {/* Address Form */}
            <div className="checkout-form">
                <h2>Shipping Details 📦</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <button
                    className="btn-pay"
                    onClick={handlePlaceOrder}
                    disabled={!isFormValid}
                >
                    Proceed to Pay ₹{total}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
