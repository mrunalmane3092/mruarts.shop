import { useState } from "react";
import "./Coupon.scss";

interface CouponProps {
    subtotal: number;
    onApply: (discount: number, applied: boolean) => void;
}

const Coupon = ({ subtotal, onApply }: CouponProps) => {
    const [couponApplied, setCouponApplied] = useState(false);

    const handleToggleCoupon = () => {
        const newApplied = !couponApplied;
        setCouponApplied(newApplied);

        const discount = subtotal >= 1000 && newApplied ? subtotal * 0.05 : 0;
        onApply(discount, newApplied);
    };

    if (subtotal < 1000) return null; // Show only if eligible

    return (
        <div className="coupon-section">
            <button
                className={`btn-coupon ${couponApplied ? "remove" : ""}`}
                onClick={handleToggleCoupon}
            >
                {couponApplied ? "Remove Coupon ❌" : "Apply 5% Off 🎁"}
            </button>
            {couponApplied && <p className="coupon-applied">🎉 Coupon Applied -5%</p>}
        </div>
    );
};

export default Coupon;
