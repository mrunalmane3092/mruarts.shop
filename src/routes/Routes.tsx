import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Home from '../containers/Home';
import About from '../containers/About';
import Shop from '../containers/Shop';
import ShopGuidlines from '../containers/ShopGuidelines';
import Checkout from '../containers/Checkout';
import Cart from '../containers/Cart';

const RoutePaths = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/guidelines" element={<ShopGuidlines />} />
            <Route
                path="/checkout"
                element={<Checkout />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default RoutePaths;