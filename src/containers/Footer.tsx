import "./Home.scss";
import { Instagram } from "lucide-react"
const Footer = () => {
    return (


        <footer className="text-center py-4 mt-1  shadow-sm bgFooter">
            <p className="mb-2">
                © {new Date().getFullYear()} mruarts.shop — made with 💜 by Mru
            </p>
            <a
                href="https://www.instagram.com/mruarts.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-purple fw-bold"
            >
                <Instagram size={18} color="#ffffff" /> Follow on Instagram
            </a>
        </footer>
    );
};

export default Footer;
