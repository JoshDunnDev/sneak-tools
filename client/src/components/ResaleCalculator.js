import {useState} from 'react';
import ViewBox from './ViewBox.js';
import TransactionDetails from './TransactionDetails.js';
import ProfitCalculation from './ProfitCalculation.js';
import CollectionStats from './CollectionStats.js';
import {transactionRequests} from '../utils/http.js';
import {formatDetails, formatStats} from '../utils/helpers.js';
import ReactGa from 'react-ga';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRotateLeft} from '@fortawesome/free-solid-svg-icons';

const ResaleCalculator = () => {
  const [hash, setHash] = useState('');
  const [data, setData] = useState(null);
  const [view, setView] = useState('single');
  const [requestData, setRequestData] = useState(null);
  const [salePrice, setSalePrice] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashError, setHashError] = useState(false);

  const onClick = async () => {
    if(hash) {
      ReactGa.event({
        category: 'Button',
        action: 'Submit Button Clicked'
      });
      if(!hash.match(/^[a-z0-9]+$/)) {
        return setHashError(true);
      }
      setLoading(true);
      try {
        const requestData = await transactionRequests(hash);
        setRequestData(requestData);
        updateFormat(view, requestData);
      } catch(e) {
        setHashError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  let inputClasses;
  if(hashError) {
    inputClasses = 'form-control inputHash errorHash';
  } else {
    inputClasses = 'form-control inputHash';
  }

  const onKeyDown = (e) => {
    if(e.code === 'Enter') {
      onClick();
    }
  };

  const reset = () => {
    setHash('');
    setData(null);
    setView('single');
    setRequestData(null);
    setSalePrice('');
    setTaxPercent('');
    setLoading(false);
    setHashError(false);
  };

  const updateView = (updatedView) => {
    setView(updatedView);
    setSalePrice('');
    setTaxPercent('');
    updateFormat(updatedView, requestData)
  };

  const updateFormat = (updatedView, requestData) => {
    const transactionDetails = formatDetails(requestData, updatedView);
    const collectionStats = formatStats(requestData);
    const ethPrice = requestData.ethPrice;

    setData({transactionDetails, collectionStats, ethPrice});
  };

  let submitText
  if(loading) {
    submitText = <>
      <span className="spinner-border spinner-border-sm" />
    </>
  } else {
    submitText = <>
      <span>Submit</span>
    </>
  }

  let renderError;
  if(hashError) {
    renderError = <>

      <div className="mt-4">
      <div className="mx-auto pb-3 errorBox">
        <div className="row justify-content-between mx-3">
          <div className="col-12 col-sm-7 d-flex align-items-center mt-3">
            Please enter a valid Etherscan Transaction Hash.
          </div>
        </div>

      </div>
    </div>
    </>
  }

  let renderData;
  if(data) {
    let renderViewBox;
    if(data.transactionDetails.tokens > 1) {
      renderViewBox = <>
        <ViewBox
          transactionDetails={data.transactionDetails}
          views={{view, updateView}} />
      </>

    }

    renderData = <>
      {renderViewBox}
      <div className="container-fluid px-0" style={{maxWidth: '900px'}}>
        <div className="row justify-content-center gx-0">
          <div
            className="col px-0"
            style={{minWidth: '272px'}}>
            <TransactionDetails
              transactionDetails={data.transactionDetails} />
          </div>
          <div
            className="col px-0"
            style={{minWidth: '272px'}}>
            <ProfitCalculation
              transactionDetails={data.transactionDetails}
              ethPrice={data.ethPrice}
              sale={{salePrice, setSalePrice}}
              tax={{taxPercent, setTaxPercent}} />
          </div>
        </div>
      </div>

      <CollectionStats collectionStats={data.collectionStats} />
    </>;
  };

  return (
    <div className="p-3">
      <div className="mx-auto p-4 pt-0 fullBox">
        <h2 className="text-center pt-3 mb-0">Resale Calculator</h2>
        <div
          className="row mx-auto" style={{maxWidth: '600px'}}>
          <div className="col-12 col-sm-9 px-0 pe-sm-2 mt-3">
            <input
              type="text"
              placeholder="Etherscan Transaction Hash"
              className={inputClasses}
              value={hash}
              onKeyDown={onKeyDown}
              onChange={(e) => {
                setHash(e.target.value)
                setHashError(false);
              }} />
          </div>
          <div
            className="col px-0 mt-3">
            <button
              className="btn btn-primary submitButton no-focus me-2"
              onClick={onClick}
              disabled={loading} >
                {submitText}
            </button>
            <button
              className="btn btn-secondary resetButton no-focus px-2"
              onClick={reset} >
              <FontAwesomeIcon
                icon={faRotateLeft}
                size="1x" />
            </button>
          </div>
        </div>
      </div>

      {renderError}
      {renderData}
    </div>
  );
};

export default ResaleCalculator;
