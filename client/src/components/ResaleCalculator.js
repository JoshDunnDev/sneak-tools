import {useState} from 'react';
import ViewBox from './ViewBox.js';
import TransactionDetails from './TransactionDetails.js';
import ProfitCalculation from './ProfitCalculation.js';
import CollectionStats from './CollectionStats.js';
import SubmitBox from './SubmitBox.js';
import ErrorBox from './ErrorBox.js';
import {transactionRequests} from '../utils/http.js';
import {formatDetails, formatStats} from '../utils/helpers.js';
import ReactGa from 'react-ga';

const ResaleCalculator = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [view, setView] = useState('single');
  const [requestData, setRequestData] = useState(null);
  const [salePrice, setSalePrice] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const onClick = async () => {
    setInputError('');
    if(input) {
      ReactGa.event({
        category: 'Button',
        action: 'Resale Calculator Submit Clicked'
      });
      if(!input.match(/^[a-z0-9]+$/)) {
        return setInputError(
          'Please enter a valid Etherscan Transaction Hash.');
      }
      setLoading(true);
      try {
        const requestData = await transactionRequests(input);
        setRequestData(requestData);
        updateFormat(view, requestData);
      } catch(e) {
        setInputError('Please enter a valid Etherscan Transaction Hash.');
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setInput('');
    setData(null);
    setView('single');
    setRequestData(null);
    setSalePrice('');
    setTaxPercent('');
    setLoading(false);
    setInputError(false);
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

  let renderError;
  if(inputError) {
    renderError = <>
      <ErrorBox
        error={inputError}
        setInputError={setInputError} />
    </>
    setTimeout(() => {
      setInputError('');
    }, 5000);
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
      <SubmitBox props={{
        title: 'Resale Calculator',
        placeholder: 'Etherscan Transaction Hash',
        buttonText: 'Submit',
        resetButton: true,
        inputError, loading, input,
        onClick, reset, setInput, setInputError
      }} />

      {renderError}
      {renderData}
    </div>
  );
};

export default ResaleCalculator;
