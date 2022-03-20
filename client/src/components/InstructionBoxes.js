import NotificationAlert from '../images/NotificationAlert.png';
import InputBoxes from '../images/InputBoxes.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

const InstructionBoxes = () => {

  let renderAllow;
  let stepTwoClasses;
  if('Notification' in window) {
    stepTwoClasses = 'col-12 col-sm mx-0 me-sm-2 mx-md-2 mt-3 mt-md-0 ' +
      'instructionBox d-flex align-items-center justify-content-center'
    renderAllow = <>
      <div
        className="col-12 col-sm ms-0 ms-sm-2 mt-3 mt-md-0
          instructionBox d-flex align-items-center justify-content-center"
        style={{minHeight: '290px'}}>
        <div>
          <div
            className="d-flex align-items-center"
            style={{minHeight: '140px'}}>
            <img
              src={NotificationAlert}
              alt=""
              style={{width: '100%', maxWidth: '260px'}} />
          </div>
          <div className="text-center mt-3">
            Click "Allow" in your browser
          </div>
        </div>
      </div>
    </>
  } else {
    stepTwoClasses = 'col-12 col-sm mx-0 ms-md-2 mt-3 mt-md-0 ' +
      'instructionBox d-flex align-items-center justify-content-center'
  }

  return (
    <div
      className="row mx-auto"
      style={{maxWidth: '900px'}}>
      <div
        className="col-12 col-md me-0 me-sm-2
          instructionBox d-flex align-items-center"
        style={{minHeight: '290px'}}>
        <div style={{width: '100%'}}>
          <div
            className="d-flex align-items-center"
            style={{minHeight: '140px'}}>
            <div
              className="d-flex align-items-center justify-content-center
              circleIcon mx-auto p-3"
              style={{width: '108px'}}>
              <FontAwesomeIcon
                icon={faPlus}
                size="4x" />
            </div>
          </div>
          <div className="text-center mt-3">
            Add an OpenSea Collection
          </div>
        </div>
      </div>
      <div
        className={stepTwoClasses}
        style={{minHeight: '290px'}}>
        <div>
          <div
            className="d-flex align-items-center"
            style={{minHeight: '140px'}}>
            <img
              src={InputBoxes}
              alt=""
              style={{width: '100%', maxWidth: '260px'}} />
          </div>
          <div className="text-center mt-3">
            Enter your notification preferences
          </div>
        </div>
      </div>
      {renderAllow}
    </div>
  );
};

export default InstructionBoxes;
