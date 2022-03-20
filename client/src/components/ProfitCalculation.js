import PropTypes from 'prop-types';
import {round} from '../utils/helpers.js';
import ReactGa from 'react-ga';

const ProfitCalculation = ({transactionDetails, ethPrice, sale, tax}) => {
  const mathRound = 1e12;
  const generalRound = 1e4;
  let profitEth = 0;
  let profitUsd = 0;

  if(sale.salePrice) {
    if(isNaN(Number(sale.salePrice))) {
      profitEth = 0;
      profitUsd = 0;
    } else {
      profitEth = round((sale.salePrice - ((sale.salePrice) *
      (transactionDetails.openseaFee + transactionDetails.royaltyFee)/100) -
      transactionDetails.totalCost), mathRound);

      profitUsd = round((ethPrice * profitEth), mathRound);
    }
  }

  let taxAmountEth = 0;
  let taxAmountUsd = 0;
  let profitAfterTaxEth = 0;
  let profitAfterTaxUsd = 0;
  if(tax.taxPercent) {
    if(isNaN(Number(tax.taxPercent))) {
      taxAmountEth = 0;
      taxAmountUsd = 0;
      profitAfterTaxEth = 0;
      profitAfterTaxUsd = 0;
    } else {
      taxAmountEth = round(profitEth * (tax.taxPercent/100), mathRound);
      taxAmountUsd = round(profitUsd * (tax.taxPercent/100), mathRound);
      profitAfterTaxEth = round((profitEth - taxAmountEth), mathRound);
      profitAfterTaxUsd = round((profitUsd - taxAmountUsd), mathRound);
    }
  }

  const handleSaleInputClick = () => {
    ReactGa.event({
      category: 'Input',
      action: 'Sale Input Clicked'
    });
  }

  const handleTaxInputClick = () => {
    ReactGa.event({
      category: 'Input',
      action: 'Tax Input Clicked'
    });
  }

  return (
    <div className="mt-4 ps-sm-2">
      <h4 className="text-left">Profit Calculation</h4>
      <div className="container mt-2 px-0 halfBox">
        <div className="row mx-3">
          <div className="col-12 col-md-6 mt-3">
            <div>Sale Price (ETH)</div>
            <div className="inputPlaceholder" data-placeholder="ETH">
              <input
                type="text"
                value={sale.salePrice}
                onChange={(e) => {
                  sale.setSalePrice(e.target.value);
                }}
                onClick={handleSaleInputClick}
                placeholder="ETH Price"
                className="form-control input mt-1"
                style={{
                  height: '38px', width: '100%', paddingRight: '45px'
                }} />
            </div>
          </div>
          <div className="col mt-3 ps-md-3">
            <div>Current ETH Price</div>
            <h5 className="mt-2">
              ${Number.parseFloat(ethPrice).toFixed(2)}
            </h5>
          </div>
        </div>
        <div className="my-3 totalBox">
          <div className="row pb-2 mx-3">
            <div className="col-12 col-md-6 mt-2 pb-2 pb-md-0">
              <div className="mb-1 fw-bold">Profit (ETH)</div>
              <h5 className="mb-0">
                {round(profitEth, generalRound)} ETH
              </h5>
            </div>

            <div
              className="col pt-2 border-top border-md-start
                border-md-top-0 pt-md-0 mt-md-2 ps-md-3">
              <div className="mb-1 fw-bold">Profit (USD)</div>
              <h5 className="mb-0">
                ${Number.parseFloat(profitUsd).toFixed(2)}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-3 px-0 halfBox">
        <div className="row mx-3 pt-3">
          <div className="row pe-0">
            <div className="col-12 col-md-6 pe-0 pe-md-2">
              <div>Tax Percent (Optional)</div>
              <div className="inputPlaceholder" data-placeholder="%">
                <input
                  type="text"
                  value={tax.taxPercent}
                  onChange={(e) => {
                    tax.setTaxPercent(e.target.value);
                  }}
                  onClick={handleTaxInputClick}
                  placeholder="Percent"
                  className="form-control input mt-1"
                  style={{
                    height: '38px', width: '100%', paddingRight: '30px'
                  }} />
              </div>
            </div>
            <div className="row mx-0 px-0">
              <div className="col-12 col-md-6 mt-3">
                <div>Tax Amount (ETH)</div>
                <h5 className="mt-2">
                  {round(taxAmountEth, generalRound)} ETH
                </h5>
              </div>
              <div className="col mt-3 ms-md-3">
                <div>Tax Amount (USD)</div>
                <h5 className="mt-2">
                  ${Number.parseFloat(taxAmountUsd).toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 totalBox">
          <div className="row pb-2 mx-3">
            <div className="col-12 col-md-6 mt-2 pb-2 pb-md-0">
              <div className="mb-1 fw-bold">Profit After Tax (ETH)</div>
              <h5 className="mb-0">
                {round(profitAfterTaxEth, generalRound)} ETH
              </h5>
            </div>

            <div
              className="col pt-2 border-top border-md-start
                border-md-top-0 pt-md-0 mt-md-2 ps-md-3">
              <div className="mb-1 fw-bold">Profit After Tax (USD)</div>
              <h5 className="mb-0">
                ${Number.parseFloat(profitAfterTaxUsd).toFixed(2)}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfitCalculation.propTypes = {
  transactionDetails: PropTypes.object,
  ethPrice: PropTypes.string
};

export default ProfitCalculation;
