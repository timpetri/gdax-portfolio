
const accounts_endpoint = "https://api.gdax.com/accounts";
const products_endpoint = "https://api.gdax.com/products";
const product_endpoint = "https://api.gdax.com/products/{product-id}/ticker"

products = {"BTC-USD": 'BTC', 
            "ETH-USD": 'ETH', 
            "LTC-USD": 'LTC',
            "BCH-USD": 'BCH'};
accounts = {}
prices = {}

let keyHolder = new KeyHolder();

function requestBalanceInformation() {
  timestamp = Date.now() / 1000;
  axios.get(accounts_endpoint, {
    headers : {"Content-Type": "application/json",
           "CB-ACCESS-KEY": keyHolder.load('GDAX_VIEWER_API_KEY'),
           "CB-ACCESS-TIMESTAMP": timestamp,
           "CB-ACCESS-PASSPHRASE": keyHolder.load('GDAX_VIEWER_PASSPHRASE'),
           "CB-ACCESS-SIGN": signGdaxMessage('GET', 
               '/accounts', 
               {}, 
               timestamp, 
               keyHolder.load('GDAX_VIEWER_SECRET'))}})
      .then(function(res) {
        res.data.forEach(acc => {
          accounts[acc.currency] = parseFloat(acc.balance);
        });
        updateUI();
      })
      .catch(function(err) {

      });
}

// Requests market price for all products
function requestMarketInformation(product) {
  axios.get(product_endpoint.replace("{product-id}", product))
    .then(function(res) {
      prices[products[product]] = parseFloat(res.data.price);
      updateUI();
    })
    .catch(function(err) {
      console.error(err);
    });
}

function getLatestInformation() {
  // TODO(): check if long enough time has passed first
  requestBalanceInformation();
  Object.keys(products).forEach(product => {
    requestMarketInformation(product);
  });
}

function updateUI() {
  var total = 0;
  for (key in products) {
    let coins = accounts[products[key]];
    let price = prices[products[key]];
    if (coins && price) 
      total += coins * price;
    if (!coins) coins = 0
    if (!price) price = 0
    document.getElementById(products[key])
        .getElementsByClassName('price')[0].textContent = `(${price.toLocaleString('en-US', 
            {style: 'currency', currency: 'USD'})})`;
    document.getElementById(products[key])
        .getElementsByClassName('amount')[0].textContent = `${parseFloat(coins)} ${products[key]}`;
    document.getElementById(products[key])
        .getElementsByClassName('value')[0].textContent = `${(coins * price).toLocaleString('en-US', 
            {style: 'currency', currency: 'USD'})}`;
  }
  if (!total) {
    total = 0.0;
  }
    document.getElementById('total').textContent = `${(total).toLocaleString('en-US', 
        {style: 'currency', currency: 'USD'})}`;
    // showHoldings();
}

function showHoldings() {
  document.getElementById('spinner').style.display = 'none';
  document.getElementById('holdings').style.display = 'block'
}

window.onload = getLatestInformation

function signGdaxMessage(method, requestPath, messageBody, timestamp, secret) { 
  // create the prehash string by concatenating required parts
  var message = timestamp + method + requestPath; 
  if (method !== 'GET') message += JSON.stringify(messageBody)

  // Base64 decode the alphanumeric secret string
  var words = CryptoJS.enc.Base64.parse(secret);
  var key = CryptoJS.enc.Hex.stringify(words);

  // Use it as key for SHA 256 HMAC 
  var signed_message = CryptoJS.HmacSHA256(message, words);

  // base 64 encode the digest output before sending in header
  var output = signed_message.toString(CryptoJS.enc.Base64);
  return output;
}