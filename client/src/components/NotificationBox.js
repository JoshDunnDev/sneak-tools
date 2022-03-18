import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/fontawesome-free-solid';
import ReactGa from 'react-ga';

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
        <div className="col-8 d-flex align-items-center mt-3">
          <img
            src={notification.image}
            alt=""
            style={{width: '35px'}} />
          <div className="col d-flex align-items-center ms-3">
            {notification.text}
          </div>
        </div>
        <div className="col d-flex align-items-center mt-3">
          {notification.time}
        </div>
        <div
          className="col-1 d-flex align-items-center mt-3"
          style={{width: 'initial'}}>
          <button
            className="btn btn-danger no-focus p-0"
            style={{width: '25px', height: '25px'}}
            onClick={handleDismissClick} >
            <FontAwesomeIcon
              icon={faTimes}
              size="1x" />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationBox;
