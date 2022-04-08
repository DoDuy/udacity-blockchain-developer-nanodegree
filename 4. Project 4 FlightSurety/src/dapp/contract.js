import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];

        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            // await window.ethereum.enable(); 
          } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        }

        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.flights = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            this.owner = accts[0];
            console.log("owner", this.owner);
            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    registerAirline(address, name, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerAirline(address, name)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    fundAirline(amount, callback) {
        let self = this;
        let weiAmount = self.web3.utils.toWei(amount, 'ether')
        self.flightSuretyApp.methods
            .fundAirline()
            .send({ from: self.owner, value: weiAmount}, (error, result) => {
                callback(error, result);
            });
    }

    registerFlight(flightCode, callback) {
        let self = this;
        let timestamp = Math.floor(Date.now() / 1000);
        self.flightSuretyApp.methods
            .registerFlight(flightCode, timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result, self.owner, flightCode, timestamp);
            });
    }

    buyInsurance(airline, flight, timestamp, amount, callback) {
        let self = this;
        let weiAmount = self.web3.utils.toWei(amount, 'ether')
        self.flightSuretyApp.methods
            .buyInsurance(airline, flight, timestamp)
            .send({ from: self.owner, value: weiAmount}, (error, result) => {
                callback(error, result, self.owner, amount);
            });
    }

    fetchFlightStatus(airline, flight, timestamp, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .fetchFlightStatus(airline, flight, timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    getFlightStatus(airline, flight, timestamp, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getFlightStatus(airline, flight, timestamp)
            .call({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    getPassengerCredit(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getPassengerCredit()
            .call({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    payInsuree(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .payInsuree()
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }
}