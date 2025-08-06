import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './containers/Home';
import "../src/style.scss";
import About from './containers/About';
import RoutePaths from './routes/Routes';

function App() {
  return (
    <>
      <RoutePaths />
    </>

  );
}

export default App;
