import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRotateLeft} from '@fortawesome/free-solid-svg-icons';

const SubmitBox = ({props}) => {
  const onKeyDown = (e) => {
    if(e.code === 'Enter') {
      props.onClick();
    }
  };

  let inputClasses;
  if(props.inputError) {
    inputClasses = 'form-control input errorInput';
  } else {
    inputClasses = 'form-control input';
  }

  let submitText
  if(props.loading) {
    submitText = <>
      <span className="spinner-border spinner-border-sm" />
    </>
  } else {
    submitText = <>
      <span>{props.buttonText}</span>
    </>
  }

  let renderButtons
  let inputClass = 'col-12 px-0 pe-sm-2 mt-3';
  if(props.resetButton) {
    inputClass += ' col-sm-9';
    renderButtons = <>
      <button
        className="btn btn-primary no-focus me-2"
        style={{width: 'calc(100% - 46px)', fontWeight: 'bold'}}
        onClick={props.onClick}
        disabled={props.loading} >
          {submitText}
      </button>
      <button
        className="btn btn-secondary resetButton no-focus px-2"
        onClick={props.reset} >
        <FontAwesomeIcon
          icon={faRotateLeft}
          size="1x" />
      </button>
    </>
  } else {
    inputClass += ' col-sm-10';
    renderButtons = <>
      <button
        className="btn btn-primary no-focus me-2"
        style={{width: '100%', fontWeight: 'bold'}}
        onClick={props.onClick}
        disabled={props.loading || props.isSubmitDisabled} >
          {submitText}
      </button>
    </>
  }


  return (
    <div className="mx-auto p-4 pt-0 fullBox">
      <h2 className="text-center pt-3 mb-0">{props.title}</h2>
      <div
        className="row mx-auto" style={{maxWidth: '600px'}}>
        <div className={inputClass}>
          <input
            type="text"
            placeholder={props.placeholder}
            className={inputClasses}
            value={props.input}
            onKeyDown={onKeyDown}
            disabled={props.isSubmitDisabled}
            onChange={(e) => {
              props.setInput(e.target.value)
            }} />
        </div>
        <div
          className="col px-0 mt-3">
          {renderButtons}
        </div>
      </div>
    </div>
  );
};

export default SubmitBox;
