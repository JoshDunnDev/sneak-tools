import {useState} from 'react';
import ViewBox from './ViewBox.js';
import TransactionDetails from './TransactionDetails.js';
import ProfitCalculation from './ProfitCalculation.js';
import CollectionStats from './CollectionStats.js';
import {transactionRequests} from '../utils/http.js';
import {formatDetails, formatStats} from '../utils/helpers.js';

const ResaleCalculator = () => {
  const [hash, setHash] = useState('');
  const [data, setData] = useState(null);
  const [view, setView] = useState('single');
  const [requestData, setRequestData] = useState(null);
  const [salePrice, setSalePrice] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if(hash) {
      setLoading(true);
      const requestData = await transactionRequests(hash);
      setLoading(false);
      setRequestData(requestData);
      updateFormat(view, requestData);
    }
  };

  const updateView = (updatedView) => {
    setView(updatedView);
    setSalePrice('');
    setTaxPercent('');
    updateFormat(updatedView, requestData)
  }

  const updateFormat = (updatedView, requestData) => {
    const transactionDetails = formatDetails(requestData, updatedView);
    const collectionStats = formatStats(requestData);
    const ethPrice = requestData.ethPrice;

    setData({transactionDetails, collectionStats, ethPrice});
  }

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
            <TransactionDetails transactionDetails={data.transactionDetails} />
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
  }

  return (
    <div className="p-3">
      <div className="mx-auto p-4 pt-0 fullBox">
        <h2 className="text-center pt-3 mb-0">Resale Calculator</h2>
        <div
          className="row mx-auto" style={{maxWidth: '500px'}}>
          <div className="col-12 col-sm-10 px-0 pe-sm-3 mt-3">
            <input
              type="text"
              placeholder="Etherscan Transaction Hash"
              className="form-control inputHash"
              value={hash}
              onChange={(e) => {
                setHash(e.target.value);
            }} />
          </div>
          <div className="col px-0 mt-3">
            <button
              className="btn btn-primary submitButton no-focus"
              onClick={onClick}
              disabled={loading} >
                {submitText}
            </button>
          </div>
        </div>
      </div>

      {renderData}
    </div>
  );
};

export default ResaleCalculator;
