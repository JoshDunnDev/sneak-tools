import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/fontawesome-free-solid';
import ReactGa from 'react-ga';

const ErrorBox = ({error, setInputError}) => {
  const handleDismissClick = () => {
    ReactGa.event({
      category: 'Button',
      action: 'Dismiss Error Clicked'
    });
    setInputError('');
  }

  return (
    <div className="mt-4">
      <div className="mx-auto pb-3 errorBox">
        <div className="row justify-content-between mx-3">
          <div className="col d-flex align-items-center mt-3">
            {error}
          </div>
          <div className="col-2 col-sm-1 d-flex align-items-center mt-3">
            <button
              className="btn btn-danger no-focus px-2"
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

export default ErrorBox;
