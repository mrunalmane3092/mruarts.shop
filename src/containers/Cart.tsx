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
    const [hipperData, setHipperData] = useState({
        count: 0
    })


    const [subtotal, setSubtotal] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [subtotalWithoutDiscount, subTotalWithoutDiscount] = useState(0);
    const [otherThanPhotocardPrice, setOtherThanPhotocardPrice] = useState(0);




    useEffect(() => {
        if (props.cartProducts) {
            const cartArray = Object.values(props.cartProducts);
            setCartData({
                dataFetched: true,
                data: cartArray,
            });
        }
    }, [props.cartProducts]);

    const dispatchCartClose = () => {
        props.dispatchCartClose();
    };


    // state
    const [discount, setDiscount] = useState(0);


    // callback for coupon
    const total = subtotal - discount + (otherThanPhotocardPrice < 300 ? 50 : 0);


    useEffect(() => {
        if (!cartData?.data) return;

        // 1. count photocards with quantity
        const hipperCount = cartData.data.reduce((count, item) => {
            return item.productType === "hipper"
                ? count + item.quantity
                : count;
        }, 0);

        // 2. normal subtotal
        const subtotalWithoutDiscount = cartData.data.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        // 3. discount logic for hippers
        const totalDiscount =
            hipperCount >= 2 ? 35 * (hipperCount - 1) : 0;

        // 4. final subtotal
        const subtotal = subtotalWithoutDiscount - totalDiscount;

        // 5. save state safely
        setHipperData((prev) => ({
            ...prev,
            count: hipperCount,
            discount: totalDiscount,
        }));

        setSubtotal(subtotal);
        setTotalDiscount(totalDiscount);


        let cnt = 0;
        cartData.data.map(item => {
            if (item.productType !== 'hipper') {
                cnt = cnt + item.totalPrice
            }
        })

        subTotalWithoutDiscount(cnt)

        let t_price = 0
        cartData.data.map((item: any) => {
            if (item.productType !== 'photocard') {
                t_price = t_price + item.totalPrice
            }
        })

        setOtherThanPhotocardPrice(t_price)

    }, [cartData]); // <-- RUN ONLY WHEN cartData CHANGES

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
                couponApplied,
                otherThanPhotocardPrice
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
                            src="/products/NRI0_bexqnq.gif"
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
                <>
                    {hipperData.count > 1 ? <p className="hippersDiscount-text">Yippee! You just unlocked the Hippers discount of ₹{totalDiscount}! 🎉💜✨</p> : <></>}

                    <div className="cart-footer">
                        {localStorage.getItem('INTERNATIONAL') !== 'true' ? (
                            <>
                                <div className="subtotal">
                                    <span>Subtotal:</span>
                                    <strong>₹{subtotal}</strong>
                                </div>
                                {/* Coupon Section */}
                                <Coupon subtotal={subtotal} onApply={handleCoupon} cartData={cartData.data} subtotalWithoutDiscount={subtotalWithoutDiscount} />


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

                                    {otherThanPhotocardPrice < 300 && <small> (including ₹50 shipping)</small>}
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
                </>
            )}

            <Footer />
        </div>
    );
};

export default Cart;
