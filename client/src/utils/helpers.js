// converts wei to eth
const convert = (wei) => {
  const ethConversion = 1000000000000000000;
  return Math.round((wei / ethConversion) * 1e12) / 1e12;
};

const round = (val, exp) => {
  return Math.round((val) * exp) / exp;
};

const formatDetails = (requestData, view) => {
  const tokens = getCount(requestData);
  let splitCount;
  if(view === 'single') {
    splitCount = tokens;
  } else {
    splitCount = 1;
  }
  const purchasePrice = convert(requestData.transaction.value / splitCount);
  const transactionFee = convert(requestData.receipt.gasUsed *
    requestData.receipt.effectiveGasPrice / splitCount);
  const totalCost = round(purchasePrice + transactionFee, 1e12);
  const openseaFee = requestData.contract
    .opensea_seller_fee_basis_points / 100;
  const royaltyFee = requestData.contract
    .dev_seller_fee_basis_points / 100;
  const minimumSellPrice = round(totalCost/
    (1-((openseaFee+royaltyFee)/100)), 1e12);

  return {
    tokens, purchasePrice, transactionFee, totalCost, openseaFee, royaltyFee,
    minimumSellPrice
  };
};

const formatStats = (requestData) => {
  const name = requestData.contract.collection.name;
  const imgUrl = requestData.contract.image_url;
  const floorPrice = requestData.contractStats.floor_price;
  const volume = requestData.contractStats.total_volume;
  const supply = requestData.contractStats.total_supply;
  const owners = requestData.contractStats.num_owners;

  return {
    name, imgUrl, floorPrice, volume, supply, owners
  };
};

function abbrNum(number, decPlaces) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10,decPlaces);

  // Enumerate number abbreviations
  var abbrev = ['K', 'M', 'B', 'T'];

  // Go through the array backwards, so we do the largest first
  for (var i=abbrev.length-1; i>=0; i--) {

    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10,(i+1)*3);

    // If the number is bigger or equal do the abbreviation
    if(size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round(number*decPlaces/size)/decPlaces;

      // Handle special case where we round up to the next abbreviation
      if((number === 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      if(Number.isInteger(number)) {
        number += '.0';
        number += abbrev[i];
      } else {
        number += abbrev[i];
      }


      // We are done... stop
      break;
    } else {
      number = Number.parseFloat(number).toFixed(0);
    }
  }
  return number;
}

const getCount = (requestData) => {
  let count;
  // mint
  if((requestData.receipt.to).toLowerCase() === (
    requestData.receipt.logs[0].address).toLowerCase()) {
    count = requestData.receipt.logs.filter(log => {
      return (log.address).toLowerCase() === (
        requestData.receipt.to).toLowerCase();
    }).length;
    return count;
  }

  // multi-transaction
  const address = requestData.receipt.from.split('0x').pop();
  requestData.receipt.logs.forEach((log) => {
    const index = log.topics.findIndex(element => element.includes(address))
    if(index >= 0) {
      if(!count) {
        count = 0;
      }
      count += 1;
    }
  });

  return count;
};

export {formatDetails, formatStats, abbrNum, round};
