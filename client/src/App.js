import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ResaleCalculatorPage from './routes/ResaleCalculatorPage.js';
import ReactGa from 'react-ga';
import {useEffect} from 'react';

const App = () => {
  useEffect(() => {
    ReactGa.initialize('G-3D6Q3B4FJQ')
    ReactGa.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <Router>
      <Header />
      <div style={{minHeight: 'calc(100vh - 112px)'}}>
        <Routes>
          <Route
            path="/"
            exact
            element={<ResaleCalculatorPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
