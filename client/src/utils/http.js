import axios from 'axios';
import {getCookie} from './helpers.js';

const getTransaction = async (hash) => {
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

const addSlugs = async ({slugs}) => {
  const token = getCookie('token');
  const body = {
    token,
    slugs
  };
  await axios.post('/api/slugs', body);
};

const getSlugs = async (token) => {
  let results;
  try {
    results = await axios.get(`/api/slugs/${token}`);
  } catch(e) {
    throw e;
  }
  const {data: {slugs}} = results;
  return slugs;
};

const getCollection = async (slug) => {
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

const getNonce = async ({walletAddress}) => {
  console.log('get account');
  const body = {
    walletAddress
  };
  const {data: {nonceMessage}} = await axios.post('/api/auth/nonce', body);
  return nonceMessage;
}

const verifyToken = async (token) => {
  console.log('get account');
  const body = {
    token
  };
  const {data: {user}} = await axios.post('/api/auth/token', body);
  return user;
}

const verifyWallet = async ({walletAddress, nonceMessage, signature}) => {
  console.log('get account');
  const body = {
    walletAddress,
    nonceMessage,
    signature
  };
  const {data: {user, token}} = await axios.post('/api/auth/wallet', body);
  return {user, token};
}

export {
  getTransaction,
  addSlugs,
  getSlugs,
  getCollection,
  getNonce,
  verifyWallet,
  verifyToken
};
