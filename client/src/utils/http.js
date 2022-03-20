import axios from 'axios';

const transactionRequests = async (hash) => {
  const transactionResponse = await axios.get(`/api/transaction/${hash}`)
  const {transaction, receipt, ethPrice} = transactionResponse.data;

  const contractAddress = receipt.logs[0].address;
  const contractResponse = await axios.get('https://api.opensea.io/api/v1/' +
    `asset_contract/${contractAddress}`);
  const contract = contractResponse.data;

  const collectionSlug = contract.collection.slug.toLowerCase();

  const contractStatsResponse = await axios.get('https://api.opensea.io/api/' +
    `v1/collection/${collectionSlug}/stats`);
  const {stats: contractStats} = contractStatsResponse.data;

  return {transaction, receipt, contract, contractStats, ethPrice};
};

const collectionRequest = async (slug) => {
  let collectionData;
  try {
    collectionData = await axios.get('https://api.opensea.io/api/' +
      `v1/collection/${slug}`);
  } catch(e) {
    throw e;
  }

  const {collection} = collectionData.data;

  return {collection};
};

export {transactionRequests, collectionRequest};
