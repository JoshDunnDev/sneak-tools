import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {round} from '../utils/helpers.js';

const TransactionDetails = ({transactionDetails}) => {
  const [small, setSmall] = useState(null);
  const generalRound = 1e4;

  if(small === null) {
    if(window.innerWidth >= 576) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  }


  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if(window.innerWidth >= 576) {
          setSmall(true);
        } else {
          setSmall(false);
        }
      }, 250);
    }

    window.addEventListener('resize', handleResize)
  });

  return (
    <div className="mt-4 pe-sm-2">
      <h4 className="text-left">Transaction Details</h4>
      <div
        className="container mt-2 px-0 halfBox">
        <div
          className="row mx-3 pt-3"
          style={small ? {minHeight: '344px'} : {}}>
          <div className="col">
            <div>Purchase Price</div>
            <h5>
              {round(transactionDetails.purchasePrice, generalRound)} ETH
            </h5>

            <div className="mt-3">Transaction Fee</div>
            <h5>
              {round(transactionDetails.transactionFee, generalRound)} ETH
            </h5>

            <div className="mt-3">Total Cost</div>
            <h5>
              {round(transactionDetails.totalCost, generalRound)} ETH
            </h5>

            <div className="mt-3">OpenSea Fee</div>
            <h5>{transactionDetails.openseaFee}%</h5>

            <div className="mt-3">Royalty Fee</div>
            <h5>{transactionDetails.royaltyFee}%</h5>
          </div>
        </div>
        <div className="px-3 pb-2 mt-3 totalBox">
          <div className="px-2 pt-2">
            <div className="mb-1 fw-bold">
              Break Even Sale Price
            </div>
            <h5 className="mb-0">
              {round(transactionDetails
                .minimumSellPrice, generalRound)} ETH
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionDetails.propTypes = {
  transactionDetails: PropTypes.object
};

export default TransactionDetails;
