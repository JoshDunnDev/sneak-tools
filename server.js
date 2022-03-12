const express = require('express');
const cors = require('cors');
// const mongodb = require('mongodb');
const Web3 = require('web3');

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

require('dotenv').config({path: '.env'});

const app = express();
app.use(cors());

const port = process.env.PORT || 8000;
const providerUrl = process.env.PROVIDER_URL;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

// handle production
if(process.env.NODE_ENV === 'production') {
  // static folder
  app.use(express.static(__dirname + '/client/build'));

  //handle single page app
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
  });
}

app.get('/api/transaction/:hash', async (req, res) => {
  const hash = req.params.hash;
  const web3 = new Web3(providerUrl);

  const promises = [
    web3.eth.getTransaction(hash),
    web3.eth.getTransactionReceipt(hash),
    axios.get('https://api.etherscan.io/api?module=stats&action=ethprice' +
      `&apikey=${etherscanApiKey}`)
  ];
  const values = await Promise.all(promises);
  const transaction = values[0];
  const receipt = values[1];
  const ethResponse = values[2].data;
  const {result: {ethusd: ethPrice}} = ethResponse;

  res.json({transaction, receipt, ethPrice});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});