const ViewBox = ({transactionDetails, views}) => {
  let singleColor;
  let combinedColor;
  if(views.view === 'single') {
    singleColor = 'btn-primary';
    combinedColor = 'btn-light-blue';
  }
  if(views.view === 'combined') {
    singleColor = 'btn-light-blue'
    combinedColor = 'btn-primary';
  }

  return (
    <div className="mt-4">
      <div className="mx-auto pb-3 fullBox">
        <div className="row justify-content-between mx-3">
          <div className="col-12 col-sm-7 d-flex align-items-center mt-3">
            {transactionDetails.tokens} tokens in this transaction
          </div>
          <div className="col d-flex justify-content-sm-end mt-3 pe-0">
            <div style={{whiteSpace: 'nowrap', minWidth: '275px'}}>
              View:
              <button
                className={'no-focus btn ms-2 py-1 ' + singleColor}
                style={{borderRadius: '4px 0 0 4px', width: '100px'}}
                onClick={() => views.updateView('single')}>
                Single
              </button>
              <button
                className={'no-focus btn py-1 ' + combinedColor}
                style={{borderRadius: '0 4px 4px 0', width: '100px'}}
                onClick={() => views.updateView('combined')}>
                Combined
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewBox;
