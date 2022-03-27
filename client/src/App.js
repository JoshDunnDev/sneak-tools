import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ResaleCalculatorPage from './routes/ResaleCalculatorPage.js';
import FloorPriceNotifierPage from './routes/FloorPriceNotifierPage.js';
import ReactGa from 'react-ga';
import {useEffect, useState} from 'react';
import UserContext from './components/UserContext.js';
import {verifyToken, getSlugs} from './utils/http.js';
import {getCookie} from './utils/helpers.js';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    ReactGa.initialize('UA-222727926-1');
    ReactGa.pageview(window.location.pathname + window.location.search);
    const getUserData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      const token = getCookie('token');
      console.log('cookie', token);
      if(token && !user) {
        const promises = [
          verifyToken(token),
          getSlugs(token)
        ]
        const results = await Promise.all(promises);
        const userData = results[0];
        const slugs = results[1];
        console.log(slugs);
        setUser(userData);
      }
      setLoading(false);
    }
    getUserData();
  }, []);

  let renderLoader;
  if(loading) {
    renderLoader = <>
      <div
        className="bg-secondary d-flex justify-content-center align-items-center"
        style={{height: '100vh'}}>
        <div
          className="spinner-border text-primary"
          style={{width: '40px', height: '40px'}}
          role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  } else {
    renderLoader = <>
      <Router>
        <UserContext.Provider value={{user, setUser}}>
          <Header />
          <div style={{minHeight: 'calc(100vh - 152px)'}}>
            <Routes>
              <Route
                path="/"
                exact
                element={<ResaleCalculatorPage />} />
              <Route
                path="/notifier"
                exact
                element={<FloorPriceNotifierPage />} />
            </Routes>
          </div>
        </UserContext.Provider>
        <Footer />
      </Router>
    </>
  }

  return (
    <>
      {renderLoader}
    </>
  );
};

export default App;
