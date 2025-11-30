import { useState } from "react";
import "./Coupon.scss";

interface CouponProps {
    subtotal: number;
    onApply: (discount: number, applied: boolean,) => void;
    cartData: any;
    subtotalWithoutDiscount: number
}

const Coupon = ({ subtotal, onApply, cartData, subtotalWithoutDiscount }: CouponProps) => {
    const [couponApplied, setCouponApplied] = useState(false);

    const handleToggleCoupon = () => {
        const newApplied = !couponApplied;
        setCouponApplied(newApplied);

        const discount = subtotalWithoutDiscount >= 1000 && newApplied ? subtotalWithoutDiscount * 0.05 : 0;
        onApply(discount, newApplied);
    };

    if (subtotalWithoutDiscount < 1000) return null; // Show only if eligible

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
