import {
  Container,
  Navbar,
  Nav
} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faDiscord, faTwitter, faYoutube
} from '@fortawesome/fontawesome-free-brands';
import {useLocation} from 'react-router-dom';

const Header = () => {
  const location = useLocation();

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
            className="mx-auto mt-2 my-lg-0"
            activeKey={location.pathname}
            style={{maxHeight: '100px'}}>
            <Nav.Link className="link" href="/">
              Resale Calculator
            </Nav.Link>
            <div className="vl my-auto mx-2 d-none d-md-block"></div>
            <Nav.Link className="link" href="/notifier" disabled>
              Floor Price Notifier
            </Nav.Link>
          </Nav>
          <div
            className="d-flex justify-content-md-end justify-content-start"
            style={{width: '150px'}}>
            <Nav.Link
              className="ps-0 pe-2"
              href="https://discord.gg/uAn4FccrBr"
              target="_blank">
              <FontAwesomeIcon
                icon={faDiscord}
                className="icon" />
            </Nav.Link>
            <Nav.Link
              className="px-2"
              href="https://twitter.com/SneakerrzNFT"
              target="_blank">
              <FontAwesomeIcon
                icon={faTwitter}
                className="icon" />
            </Nav.Link>
            <Nav.Link
              className="px-2"
              href="https://www.youtube.com/channel/UCxfA8Xe2aV0DGkr5kiW25rg"
              target="_blank">
              <FontAwesomeIcon
                icon={faYoutube}
                className="icon" />
            </Nav.Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
