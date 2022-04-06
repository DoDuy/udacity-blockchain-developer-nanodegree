
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    await config.flightSuretyData.authorizeCaller(config.owner);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) first airline is added when contract is deployed', async () => {
    let airlineCount = await config.flightSuretyData.getAirlineCount.call(); 
    let isRegistered = await config.flightSuretyData.isRegistered.call(config.firstAirline); 
    assert.equal(isRegistered, true, "First airline should be registired at contract deploy.");
    assert.equal(airlineCount, 1, "Airline count should equal 1 after contract deploy.");
  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {

    }
    let result = await config.flightSuretyData.isRegistered.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) register an Airline using registerAirline() if it funded', async () => {

    let AIRLINE_MINIMUM_FUND = await config.flightSuretyApp.AIRLINE_MINIMUM_FUND.call();
    await config.flightSuretyApp.fundAirline({from: config.firstAirline, value: AIRLINE_MINIMUM_FUND});
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {

    }
    let result = await config.flightSuretyData.isRegistered.call(newAirline); 

    // ASSERT
    assert.equal(result, true, "Airline should be registerd");

  });

  it('(airline) register an Airline using registerAirline() if amount of registerd airlines if greater than 4', async () => {

    let AIRLINE_MINIMUM_FUND = await config.flightSuretyApp.AIRLINE_MINIMUM_FUND.call();
    await config.flightSuretyApp.fundAirline({from: config.firstAirline, value: AIRLINE_MINIMUM_FUND});

    // ACT
    let offset = 10;
    try {
      for(let i = 0; i < 4; i++) {
        await config.flightSuretyApp.registerAirline(accounts[i+offset], {from: config.firstAirline});
        await config.flightSuretyApp.fundAirline({from: accounts[i+offset], value: AIRLINE_MINIMUM_FUND});
      }
    }
    catch(e) {}

    let newAirline = accounts[offset+4];
    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {}
    let result = await config.flightSuretyData.isRegistered.call(newAirline); 
    // ASSERT
    assert.equal(result, false, "Airline should not be registerd");

    // ACT
    try {
      for(let i = 0; i < 2; i++) {
        await config.flightSuretyApp.registerAirline(newAirline, {from: accounts[i+offset]});
      }
    }
    catch(e) {}

    result = await config.flightSuretyData.isRegistered.call(newAirline); 
    // ASSERT
    assert.equal(result, true, "Airline should be registerd because of more than 50% airline register");

  });
 

});
