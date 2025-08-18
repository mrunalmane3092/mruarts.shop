import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './containers/Home';
import "../src/style.scss";
import About from './containers/About';
import RoutePaths from './routes/Routes';
import ScrollToTop from './containers/ScrollToTop';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <ScrollToTop>
            <CartProvider>
                <RoutePaths />
            </CartProvider>
        </ScrollToTop>
    );
}

export default App;
