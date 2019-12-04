

fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
// method: "GET",   
headers: {
      'Content-Type': 'application/json',
     'X-CMC_PRO_API_KEY': '8156fd5c-1e27-4c73-8393-fef3b616fe8d', // put API key
   },
   // initialize parameters
   qs: {
    'start': '1',
    'limit': '500',
    'convert': 'USD'
  },
  json: true
   
})
.then(resp=>resp.json())
.then(d=>{
  num = d.data.total_cryptocurrencies
  console.log(num);
  // document.write(num);
  return d.data.total_cryptocurrencies;
})