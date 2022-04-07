const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = function(deployer) {

    let firstAirline = '0x8Bf8c98176250Fe29721dA7f79e7a4Db7A97eF6a';
    let firstAirlineName = 'Udacity Airline';
    deployer.deploy(FlightSuretyData, firstAirline, firstAirlineName)
    .then(() => {
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(() => {
                    let config = {
                        localhost: {
                            url: 'http://localhost:8545',
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');

                    FlightSuretyData.deployed()
                    .then((flightSuretyDataInstance) => {
                        flightSuretyDataInstance.authorizeCaller(FlightSuretyApp.address);
                    })
                });
    });
}