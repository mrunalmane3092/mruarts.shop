import { useState } from "react";
import "../../src/style.scss";
import "./Header.scss";
import { Home, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Cart from "../containers/Cart";


type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type HeaderProps = {
    cartProducts?: Record<string, CartItem>;
};



const Header = ({ cartProducts }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const itemCount = cartProducts ? Object.keys(cartProducts).length : 0;
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => {
        setIsCartOpen(!isCartOpen);
    }

    return (
        <div className="height70 headerDiv">
            <button className="icon-btn" onClick={() => navigate("/")}>
                <Home size={24} />
            </button>
            <div className="shop-title">mruarts.shop</div>
            {location.pathname.includes('/shop') && (
                <>
                    <button className={`icon-btn ${itemCount > 0 ? " cartBtn highlight" : ""}`} onClick={openCart}>
                        <ShoppingCart size={24} />
                        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                    </button>
                    {isCartOpen &&
                        <div className="cart-dropdown">
                            <Cart cartProducts={cartProducts} dispatchCartClose={openCart} />
                        </div>
                    }
                </>
            )}
        </div>
    );
};

export default Header;
