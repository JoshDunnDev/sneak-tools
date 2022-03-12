import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header.js';
import ResaleCalculatorPage from './routes/ResaleCalculatorPage.js';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" exact element={<ResaleCalculatorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
