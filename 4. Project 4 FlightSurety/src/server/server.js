import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

// Watch contract events
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;
const ALL_STATUS = [STATUS_CODE_UNKNOWN, STATUS_CODE_ON_TIME, STATUS_CODE_LATE_AIRLINE, STATUS_CODE_LATE_WEATHER, STATUS_CODE_LATE_TECHNICAL, STATUS_CODE_LATE_OTHER];

const TEST_ORACLES_COUNT = 25;
let offet = 10;

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

// Register oracles
(async() => {
  const accounts = await web3.eth.getAccounts();
  let fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
  console.log("fee: ", fee);
  for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
    await flightSuretyApp.methods.registerOracle().send({from: accounts[a+offet], value: fee, gas:3000000});
    let result = await flightSuretyApp.methods.getMyIndexes().call({from: accounts[a+offet]});
    console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
  }
})();

// Main
(async() => {

  console.log("Wait 10 seconds for Registering oracles...")
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, async function (error, event) {
    // if (error) console.log(error)
    // console.log("event: ", event.event)
    // console.log(event.returnValues)
    let index = event.returnValues.index;
    let airline = event.returnValues.airline;
    let flight = event.returnValues.flight;
    let timestamp = event.returnValues.timestamp;
    console.log(index, airline, flight, timestamp);
  
    let status_code = ALL_STATUS.sample();
    const accounts = await web3.eth.getAccounts();
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {
      let oracleIndexes = await flightSuretyApp.methods.getMyIndexes().call({from: accounts[a+offet]});
      console.log(oracleIndexes)
      for(let idx=0;idx<3;idx++) {
        try {
          await flightSuretyApp.methods.submitOracleResponse(oracleIndexes[idx], 
            airline, flight, timestamp, status_code).send({from: accounts[a+offet], gas: 3000000});
        }catch(e) {
          // console.log(e);
        }
      }
    }
    let flightStatus = await flightSuretyApp.methods.getFlightStatus(airline, flight, timestamp).call();
    console.log("flightStatus: ", flightStatus);
  
  });
  
  flightSuretyData.events.FlightStatusUpdated({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log("event: ", event.event)
    console.log(event.returnValues)
  });

  flightSuretyData.events.FlightRegistered({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log("event: ", event.event)
    console.log(event.returnValues)
  });

})();


const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


