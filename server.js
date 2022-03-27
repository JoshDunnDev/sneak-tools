require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const Web3 = require('web3');
const {v4} = require('uuid');
const {ethers} = require('ethers');
const jwt = require('jsonwebtoken');

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
const providerUrl = process.env.PROVIDER_URL;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const jwtSecret = process.env.JWT_SECRET;

const mongoUri = process.env.MONGO_URI;
const dbName = 'sneak_tools'

app.get('/api/transaction/:hash', async (req, res) => {
  const hash = req.params.hash;
  const web3 = new Web3(providerUrl);

  const promises = [
    web3.eth.getTransaction(hash),
    web3.eth.getTransactionReceipt(hash),
    axios.get('https://api.etherscan.io/api?module=stats&action=ethprice' +
      `&apikey=${etherscanApiKey}`)
  ];

  let values;
  try {
    values = await Promise.all(promises);
  } catch(e) {
    console.log(e);
    return res.status(400).send(e.message);
  }

  const transaction = values[0];
  const receipt = values[1];
  const ethResponse = values[2].data;
  const {result: {ethusd: ethPrice}} = ethResponse;

  res.json({transaction, receipt, ethPrice});
});

app.post('/api/auth/nonce', async (req, res) => {
  const {walletAddress} = req.body;
  const nonce = v4();
  console.log(walletAddress);
  console.log(nonce);

  const nonceMessage = 'Click to prove wallet ownership and sign in.\n\n' +
    'This request will not trigger a blockchain transaction or cost any '+
    'gas fees.\n\n' +
    'Wallet address:\n' +
    `${walletAddress}\n\n` +
    'Nonce:\n' +
    `${nonce}`;

  const collection = await getCollection({collection: 'users'});
  let user;
  try {
    user = await collection.findOne({walletAddress});
  } catch(e) {
    return res.status(400).json({error: e.message});
  }

  if(user) {
    const $set = {
      nonce,
      updated: new Date(),
    };
    try {
      await collection.updateOne({walletAddress}, {$set})
      return res.status(200).json({nonceMessage});
    } catch(e) {
      return res.status(400).json({error: e.message});
    }
  }

  try {
    await collection.insertOne({
      walletAddress,
      nonce,
      created: new Date()
    });
    return res.status(200).json({nonceMessage});
  } catch(e) {
    return res.status(400).json({error: e.message});
  }
});

app.post('/api/auth/wallet', async (req, res) => {
  const {walletAddress, nonceMessage, signature} = req.body;
  const signerAddress = ethers.utils.verifyMessage(nonceMessage, signature);

  if(signerAddress !== walletAddress) {
    return res.status(400).send('Wrong signature.')
  }

  const nonce = nonceMessage.split('\n').pop();
  const collection = await getCollection({collection: 'users'});
  let user;
  try {
    user = await collection.findOne({walletAddress, nonce});
  } catch(e) {
    return res.status(400).json({error: e.message});
  }

  const token = jwt.sign({
    id: user._id,
    walletAddress: user.walletAddress
  }, jwtSecret);

  return res.status(200).json({user, token});
});

app.post('/api/auth/token', async (req, res) => {
  const {token} = req.body;
  const {id, walletAddress} = jwt.verify(token, jwtSecret);
  const collection = await getCollection({collection: 'users'});
  let user;
  try {
    user = await collection.findOne({_id: mongodb.ObjectId(id), walletAddress});
  } catch(e) {
    return res.status(400).json({error: e.message});
  }

  return res.status(200).json({user});
});

app.post('/api/slugs', async (req, res) => {
  const {token, slugs} = req.body;
  console.log('TOKEN', token, 'ARR', slugs);
  const {walletAddress} = jwt.verify(token, jwtSecret);
  const $set = {
    walletAddress,
    slugs
  };
  const collection = await getCollection({collection: 'slugs'});
  try {
    await collection.updateOne({walletAddress}, {$set}, {upsert: true});
  } catch(e) {
    return res.status(400).json({error: e.message});
  }

  return res.status(200);
});

app.get('/api/slugs/:token', async (req, res) => {
  const {token} = req.params;
  console.log('TOKEN', token);
  const {walletAddress} = jwt.verify(token, jwtSecret);
  const collection = await getCollection({collection: 'slugs'});
  let results;
  try {
    results = await collection.findOne({walletAddress});
  } catch(e) {
    return res.status(400).json({error: e.message});
  }

  const slugs = results.collectionSlugs;

  return res.status(200).json({slugs});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const getCollection = async ({collection}) => {
  const client = await mongodb.MongoClient.connect(mongoUri);

  await client.db(dbName).collection(collection).createIndex(
    {walletAddress: 1}, {unique: true, background: false});

  return client.db(dbName).collection(collection);
}
