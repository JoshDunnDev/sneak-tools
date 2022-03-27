import {
  Container,
  Navbar,
  Nav,
  NavDropdown
} from 'react-bootstrap';
import {useLocation, NavLink} from 'react-router-dom';
import {formatWalletAddress} from '../utils/helpers';
import {ethers} from 'ethers';
import ReactGa from 'react-ga';
import {useContext} from 'react';
import {getNonce, verifyWallet} from '../utils/http.js';
import {addCookie, deleteCookie} from '../utils/helpers.js';
import UserContext from './UserContext.js';

const Header = () => {
  const location = useLocation();
  const {user, setUser} = useContext(UserContext);

  const login = async () => {
    ReactGa.event({
      category: 'Button',
      action: 'Login Clicked'
    });
    if(!window.ethereum) {
      window.open('https://metamask.io/', '_blank');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    const nonceMessage = await getNonce({walletAddress});
    const signature = await signer.signMessage(nonceMessage);
    const {user, token} = await verifyWallet({
      walletAddress, nonceMessage, signature
    });
    addCookie('token', token);
    setUser(user);
  }

  const logout = () => {
    console.log('logout clicked');
    ReactGa.event({
      category: 'Button',
      action: 'Logout Clicked'
    });
    deleteCookie('token');
    localStorage.clear();
    setUser(null);
  }

  let renderUser;
  if(user) {
    renderUser = <>
      <NavDropdown
        title={formatWalletAddress(user.walletAddress)}
        menuVariant="dark"
        className="dropDown">
        <NavDropdown.Item onClick={logout}>
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    </>
  } else {
    renderUser = <>
      <button
        className="btn btn-primary no-focus"
        onClick={login}
        style={{fontWeight: 'bold'}}>
          <div>Connect Wallet</div>
      </button>
    </>
  }

  return (
    <Navbar className="nav" expand="md" variant="dark">
      <Container fluid>
        <Navbar.Brand
          className="text-white mx-0"
          href="/"
          style={{width: '150px'}}>
          Sneak.tools
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav
            className="mx-auto my-lg-0"
            activeKey={location.pathname}
            style={{maxHeight: '100px'}}>
            <NavLink
              className="nav-link link"
              to="/">
              Resale Calculator
            </NavLink>
            <div className="vl my-auto mx-2 d-none d-md-block"></div>
            <NavLink
              className="nav-link link"
              to="/notifier">
              Floor Price Notifier
            </NavLink>
          </Nav>
          <div
            className="d-flex justify-content-md-end justify-content-start"
            style={{width: '150px'}}>
            {renderUser}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
