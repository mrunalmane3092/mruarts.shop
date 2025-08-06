import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // ✅ Add this
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter> 
      <App />
    </HashRouter>
  </React.StrictMode>
);

// Optional: If using reportWebVitals
reportWebVitals();


