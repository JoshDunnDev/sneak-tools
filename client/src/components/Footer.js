import {
  Navbar
} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faDiscord, faTwitter, faYoutube
} from '@fortawesome/fontawesome-free-brands';

const Header = () => {
  return (
    <Navbar className="nav justify-content-center p-3" variant="dark">
      <div className='row  justify-content-center'>
        <div
          className="col-12 d-flex justify-content-md-end justify-content-start"
          style={{width: '150px'}}>
          <a
            className="nav-link ps-0 pe-2 py-0"
            href="https://discord.gg/uAn4FccrBr"
            target="_blank"
            rel="noopener noreferrer">
            <FontAwesomeIcon
              icon={faDiscord}
              className="icon" />
          </a>
          <a
            className="nav-link px-2 py-0"
            href="https://twitter.com/SneakerrzNFT"
            target="_blank"
            rel="noopener noreferrer">
            <FontAwesomeIcon
              icon={faTwitter}
              className="icon" />
          </a>
          <a
            className="nav-link px-2 py-0"
            href="https://www.youtube.com/channel/UCxfA8Xe2aV0DGkr5kiW25rg"
            target="_blank"
            rel="noopener noreferrer">
            <FontAwesomeIcon
              icon={faYoutube}
              className="icon" />
          </a>
        </div>
        <div className="col-12 text-center mt-2">© 2022 Sneak.tools</div>
      </div>
    </Navbar>
  );
};

export default Header;
