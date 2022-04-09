# Real Estate Marketplace

At present, property titles are often paper-based, creating opportunities for errors and fraud. Title professionals find defects in 25% of all titles during the transaction process, according to the American Land Title Association.

Any identified defect makes it illegal to transfer a property title to a buyer until it is rectified. This means property owners often incur high legal fees to ensure authenticity and accuracy of their property titles.

Moreover, title fraud poses a risk to homeowners worldwide. US losses associated with title fraud reportedly averaged around $103,000 per case in 2015, compelling many property buyers to purchase title insurance.

These title management issues could potentially be mitigated by using blockchain technology to build immutable digital records of land titles and using blockchain for transparent transactions. This approach could simplify property title management, making it more transparent and helping to reduce the risk of title fraud and the need for additional insurance.

Some companies and governments around the globe have already implemented blockchain technology for the title management process.

Ghanaian blockchain company Bitland has been working on a solution for Ghana, where it is estimated that almost 80% of land is unregistered, according to Forbes. Those that possess unregistered land find it more difficult to prove legal ownership, increasing their exposure to the risk of land seizures or property theft.

Bitland is seeking to create secure digital public records of ownership on its blockchain platform, with the aim of protecting land owners from title fraud. Bitland has expanded to operate in 7 African nations, India, and is also working with Native Americans in the US.

In this project you will be minting your own tokens to represent your title to the properties. Before you mint a token, you need to verify you own the property. You will use zk-SNARKs to create a verification system which can prove you have title to the property without revealing that specific information on the property.

## Project write-up - Libraries
Library|Version|purpose
---|---|---
Truffle Version|5.5.6|compile, test, deploy smart contract
@truffle/hdwallet-provider|2.0.4|provide WalletProvider to support connect truffle with infura

## Installation and setup
- Install node modules
```
$ npm install
```
- Install [docker](https://docs.docker.com/get-docker/)
- Implement Zokrates to generate verifier.sol
```
$ docker run -v "path/to/zokrates/code:/home/zokrates/code" -ti --name zokrates zokrates/zokrates /bin/bash
$ cd code/square
$ zokrates compile -i square.code
$ zokrates setup
$ zokrates compute-witness -a 3 9
$ zokrates generate-proof
$ zokrates export-verifier
```
- Move file `zokrates/code/square/verifier.sol` to `eth-contracts/contracts/verifier.sol` then replace code line
```
pragma solidity ^0.8.0;
```
to 
```
pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;
```
## Deployment
- Test on development environment
```
truffle develop
compile
migrate
test
```
![](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/5.%20Capstone%20Real%20Estate%20Marketplace/images/test.png)
- Contract [abi's](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/tree/main/5.%20Capstone%20Real%20Estate%20Marketplace/eth-contracts/build/contracts)
- Deploy on rinkeby and mint 10 token
```
truffle migrate --reset --network rinkeby
```
![](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/5.%20Capstone%20Real%20Estate%20Marketplace/images/deploy.png)
- Contract on rinkeby test network
Name|Contract|Transaction
---|---|---
Verifier|[0x5856Ee518C3270C52E2e277eF3F2CCe8B61a0D53](https://rinkeby.etherscan.io/address/0x5856Ee518C3270C52E2e277eF3F2CCe8B61a0D53)|[0x6234c470fa370c8cb310c7a09dff2c0db6026e56772f8549cbb2f18556e54c8a](https://rinkeby.etherscan.io/tx/0x6234c470fa370c8cb310c7a09dff2c0db6026e56772f8549cbb2f18556e54c8a)
SolnSquareVerifier|[0x80C893589cb92A7d8BD97085b30C6b3120eC01ad](https://rinkeby.etherscan.io/address/0x80C893589cb92A7d8BD97085b30C6b3120eC01ad)|[0x682738af6c7e49b7138c64dd564ba600487815c30e8d6b17ca36d4bcd2fe8c79](https://rinkeby.etherscan.io/tx/0x682738af6c7e49b7138c64dd564ba600487815c30e8d6b17ca36d4bcd2fe8c79)

## Opensea testnet
[Contract owner](https://testnets.opensea.io/0x9e1a893dfcb05a17ad66c2f5ad0342dcbd5c20c9)\
[NFT1](https://testnets.opensea.io/assets/0x80c893589cb92a7d8bd97085b30c6b3120ec01ad/1)\
[NFT2](https://testnets.opensea.io/assets/0x80c893589cb92a7d8bd97085b30c6b3120ec01ad/2)\
[NFT3](https://testnets.opensea.io/assets/0x80c893589cb92a7d8bd97085b30c6b3120ec01ad/3)\
[NFT4](https://testnets.opensea.io/assets/0x80c893589cb92a7d8bd97085b30c6b3120ec01ad/4)\
[NFT5](https://testnets.opensea.io/assets/0x80c893589cb92a7d8bd97085b30c6b3120ec01ad/5)
