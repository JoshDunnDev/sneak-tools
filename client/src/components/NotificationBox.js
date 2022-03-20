import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/fontawesome-free-solid';
import ReactGa from 'react-ga';
import {round} from '../utils/helpers.js';

const NotificationBox = ({notification, removeNotification}) => {
  const handleDismissClick = () => {
    ReactGa.event({
      category: 'Button',
      action: 'Dismiss Notification Clicked'
    });
    removeNotification(notification.id);
  }


  return (
    <>
      <div
        className="row justify-content-between mx-3 pb-3 notification">
        <div className="col row">
          <div className="col-12 col-sm-7 d-flex align-items-center mt-3">
            <img
              src={notification.image}
              alt=""
              className="d-none d-sm-block"
              style={{width: '35px'}} />
            <div className="col d-flex align-items-center ms-0 ms-sm-3">
              {notification.text}
            </div>
          </div>
          <div className="col-12 col-sm d-flex align-items-center mt-1 mt-sm-3">
            {round(notification.floorPrice, 1e4)} ETH
          </div>
          <div className="col d-flex align-items-center mt-1 mt-sm-3">
            {notification.time}
          </div>
        </div>
        <div
          className="col-1 d-flex align-items-start align-items-sm-center mt-3"
          style={{width: 'initial'}}>
          <button
            className="btn btn-danger no-focus p-0"
            style={{width: '25px', height: '25px'}}
            onClick={handleDismissClick} >
            <FontAwesomeIcon
              icon={faTimes}
              size="1x"
              style={{width: '12px'}} />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationBox;
