import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/fontawesome-free-solid';
import ReactGa from 'react-ga';

const MessageBox = ({warning, setWarning}) => {
  const handleDismissClick = () => {
    ReactGa.event({
      category: 'Button',
      action: 'Dismiss Warning Clicked'
    });
    setWarning('');
  }

  return (
    <div className="mt-4">
      <div className="mx-auto pb-3 warningBox">
        <div className="row justify-content-between mx-3">
          <div className="col d-flex align-items-center mt-3 text-dark">
            {warning}
          </div>
          <div className="col-2 col-sm-1 d-flex align-items-center mt-3">
            <button
              className="btn btn-warning no-focus px-2"
              style={{width: '38px'}}
              onClick={handleDismissClick} >
              <FontAwesomeIcon
                icon={faTimes}
                size="1x" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessageBox;
