import "../../src/style.scss";
import "./Header.scss";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="height70 headerDiv">
            <button className="icon-btn" onClick={() => navigate("/")}>
                <Home size={24} />
            </button>
            <div className="shop-title">mruarts.shop</div>
            {/* <input type="text" id="search" placeholder="Search..." /> */}
        </div>
    );
};

export default Header;
