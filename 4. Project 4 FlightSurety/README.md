# FlightSurety
## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

```
npm install
truffle compile
```

## Develop Client
### Setting and Run Ganache GUI
`Number of accounts: 50`\
`Init balance: 1000 ETH`\
`Port: 8545`

### To run truffle tests:

```
truffle test --network ganache
```
Output:

### Migration to Ganache
Edit `firstAirline` in migrations/2_deploy_contracts.js as what address that you want
Run tuffle migrate:

```
truffle migrate --reset --network ganache
```
### Run UI app
```
npm run dapp
```

To view dapp:

`http://localhost:8000`\
Web UI:


### Develop Server

```
npm run server
```

### Demo Steps

- Use 1st Airline address (imported to metamask):
    - Fund 10 ETH to activate your 1st Airline
    - Add new Airline
- Use new added Airline address (imported to metamask):
    - Fund 10 ETH to activate your 2nd Airline
    - Register new Flight
    - Log Flight information in Logs section
- Use Passenger address (imported to metamask):
    - Buy insurance
    - Fetch Flight Status
    - Wait about 10 seconds then Check Flight Status (Note: because of random status respond from oracles so try `Fetch Flight Status` again until Flight Stuatus is `STATUS_CODE_LATE_AIRLINE`)
    - Check and Withdrawable Funds 

## Deploy smart contract on a public test network (Rinkeby)
Name|Contract|Transaction
---|---|---
FlightSuretyData|[0x82b3c72bdD8282fCb6b2304fF12b29345EA144b0](https://rinkeby.etherscan.io/address/0x82b3c72bdD8282fCb6b2304fF12b29345EA144b0)|[0x9199b18739f294ad60c517ed47ed0eda918f18c83969a6a1855d0c84f668aaa6](https://rinkeby.etherscan.io/tx/0x9199b18739f294ad60c517ed47ed0eda918f18c83969a6a1855d0c84f668aaa6)
FlightSuretyApp|[0x5Ea1EC200c63425fFcb563b61980bf844eA41D3a](https://rinkeby.etherscan.io/address/0x5Ea1EC200c63425fFcb563b61980bf844eA41D3a)|[0x8606749efbc7327857c7a1d7c79294054da24cf2a00727da532d20ab364fb3ce](https://rinkeby.etherscan.io/tx/0x8606749efbc7327857c7a1d7c79294054da24cf2a00727da532d20ab364fb3ce)
