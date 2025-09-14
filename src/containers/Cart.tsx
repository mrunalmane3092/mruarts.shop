import { useEffect, useState } from "react";
import "../../src/style.scss";
import "./Cart.scss";
import { X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Coupon from "./Coupon";
import Footer from "./Footer";

const Cart = (props: any) => {

    const navigate = useNavigate();
    const [cartData, setCartData] = useState({
        dataFetched: false,
        data: [] as any[],
    });

    const [couponApplied, setCouponApplied] = useState(false);

    useEffect(() => {
        if (props.cartProducts) {
            const cartArray = Object.values(props.cartProducts);
            setCartData({
                dataFetched: true,
                data: cartArray,
            });

            console.log(localStorage)
        }
    }, [props.cartProducts]);

    const dispatchCartClose = () => {
        props.dispatchCartClose();
    };


    // state
    const [discount, setDiscount] = useState(0);


    // subtotal
    const subtotal = cartData.data.reduce(
        (acc: number, item: any) => acc + item.totalPrice,
        0
    );


    // callback for coupon
    const total = subtotal - discount;


    // callback for coupon
    const handleCoupon = (discountValue: number, applied: boolean) => {
        setDiscount(discountValue);
        setCouponApplied(applied); // ✅ keep track of coupon status
    };

    const handleCheckout = () => {
        navigate("/checkout", {
            state: {
                cartItems: cartData.data,
                subtotal,
                discount,
                total,
                couponApplied // ✅ pass to checkout
            }
        });
    };


    return (
        <div className="cart-drawer">
            {/* Cart Header */}
            <div className="cart-header">
                <h2 className="cart-title">
                    <ShoppingCart size={20} style={{ marginRight: "8px" }} />
                    Your Cart
                </h2>
                <button className="close-btn" onClick={dispatchCartClose}>
                    <X size={20} />
                </button>
            </div>


            {/* Cart Body */}
            <div className="cart-body">
                {!cartData.dataFetched ? (
                    <div className="loader-container">
                        <img
                            src="https://res.cloudinary.com/dxerpx7nt/image/upload/v1755161171/NRI0_bexqnq.gif"
                            alt="Loading..."
                            className="cart-loader"
                        />
                        <p>Fetching your cart...</p>
                    </div>
                ) : cartData.data.length > 0 ? (
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th className="text-right">Price</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartData.data.map((item: any, i: number) => (
                                <tr key={i} className="cart-item">
                                    <td className="product-cell">
                                        {item.images && item.images[0] && (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="cart-thumb"
                                            />
                                        )}
                                        {item.name}
                                    </td>
                                    <td className="text-right">
                                        {localStorage.getItem('INTERNATIONAL') === 'true'
                                            ? `$${(
                                                item.price *
                                                parseFloat(localStorage.getItem('USD_RATE') ?? "0")
                                            ).toFixed(2)}`
                                            : `₹${item.price}`}
                                    </td>
                                    <td className="text-center">{item.quantity}</td>

                                    <td className="text-right">
                                        {localStorage.getItem('INTERNATIONAL') === 'true'
                                            ? `$${(
                                                item.totalPrice *
                                                parseFloat(localStorage.getItem('USD_RATE') ?? "0")
                                            ).toFixed(2)}`
                                            : `₹${item.totalPrice}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-cart">

                        <p>Your cart is empty 💜</p>
                        <button
                            className="btn-primary"
                            onClick={dispatchCartClose}>
                            Shop Now
                        </button>
                    </div>
                )}
            </div>


            {/* Cart Footer */}
            {cartData.data.length > 0 && (
                <div className="cart-footer">
                    {localStorage.getItem('INTERNATIONAL') !== 'true' ? (
                        <>
                            <div className="subtotal">
                                <span>Subtotal:</span>
                                <strong>₹{subtotal}</strong>
                            </div>
                            {/* Coupon Section */}
                            <Coupon subtotal={subtotal} onApply={handleCoupon} />


                            {/* Discount */}
                            {discount > 0 && (
                                <div className="discount">
                                    <span>Discount:</span>
                                    <strong>-₹{discount.toFixed(2)}</strong>
                                </div>
                            )}

                            {/* Final Total */}
                            <div className="final-total">
                                <span>Total:</span>
                                {total < 300 && <small> (including ₹50 shipping)</small>}
                                <strong>
                                    ₹{(total < 300 ? total + 50 : total).toFixed(2)}
                                </strong>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="subtotal">
                                <span>Subtotal:</span>
                                <span>{(total * parseFloat(localStorage.getItem("USD_RATE") ?? "0")).toFixed(2)} </span>
                            </div>

                            {/* PayPal Fee */}
                            {localStorage.getItem("INTERNATIONAL") === "true" && (
                                <div className="summary-item fee">
                                    <strong>PayPal Fee (4.4% + $0.30):</strong>
                                    <span>
                                        {(() => {
                                            const usdRate = parseFloat(localStorage.getItem("USD_RATE") ?? "0");
                                            const subtotalUSD = total * usdRate;
                                            const finalTotalUSD = (subtotalUSD + 0.30) / (1 - 0.044);
                                            const paypalFee = finalTotalUSD - subtotalUSD;
                                            return `$${paypalFee.toFixed(2)}`;
                                        })()}
                                    </span>
                                </div>
                            )}

                            <div className="final-total">
                                <strong>Final Total:</strong>
                                <span>
                                    {(() => {
                                        const usdRate = parseFloat(localStorage.getItem("USD_RATE") ?? "0");
                                        const subtotalUSD = total * usdRate;
                                        const finalTotalUSD = (subtotalUSD + 0.30) / (1 - 0.044);
                                        return `$${finalTotalUSD.toFixed(2)}`;
                                    })()}
                                </span>
                            </div>

                        </>

                    )}
                    <button className="btn-checkout" onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Cart;
