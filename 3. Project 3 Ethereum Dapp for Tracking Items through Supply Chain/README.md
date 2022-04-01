# Ethereum Dapp for Tracking Items through Supply Chain
For this project, I created a DApp supply chain solution backed by the Ethereum platform. I architected smart contracts that manage specific user permission controls as well as contracts that track and verify a product’s authenticity.

## 1: Plan the project with write-ups
### Project write-up - UML
![ActivityDiagram](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/UML/ActivityDiagram.png)
![SequenceDiagram](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/UML/SequenceDiagram.png)
![StateDiagram](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/UML/StateDiagram.png)
![ClassDiagram](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/UML/ClassDiagram.png)

### Project write-up - Libraries
Library|Version|purpose
---|---|---
Truffle Version|5.5.6|compile, test, deploy smart contract
Node version|16.14.1|run Dapp website
@truffle/hdwallet-provider|2.0.4|provide WalletProvider to support connect truffle with infura
### Role
- Farmer: The Farmer can harvest coffee beans, process coffee beans, pack coffee palettes, add coffee palettes, ship coffee palettes, and track authenticity.
- Distributor: The Distributor can buy coffee palettes and track authenticity.
- Retailer: The Retailer can receive coffee palettes and track authenticity.
- Consumer: The consumer can buy coffee palettes and track authenticity.
### General Write Up
In this project, I have completed all the missing codes, tested as well as run the whole project.
I tested this project with all the steps on the local network because on the rinkeby test network I have very little ETH because it is difficult to request a lot of ETH, but I also successfully deployed the smart contract to the rinkeby test network.
Also in the web UI I have added a section to help add new users to make demo easier.
The final web UI is attached as below:
![](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/images/UI1.jpeg)
![](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/images/UI2.jpeg)
![](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/images/UI3.jpeg)
![](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/images/UI4.jpeg)
Transaction history:
```
* FarmerAdded - 0xc3a5c7de37cdd77d7d0664da7c77648d8aa2ef075aa66f0fd9bfbbed151a000a
* DistributorAdded - 0xc41479cbaf096f42ca1c85a5161c287412d7f6112b8206a79962c2930b7177ef
* RetailerAdded - 0xd40eb95092d2d782b49dce023ebb35d9d13b4265210e0a432430fa3144c321a5
* ConsumerAdded - 0x53e24680b8818727a72b63a23551659f2b4b67f76706a3faff44bbc21e3abe69
* Harvested - 0x3d1c3b1b31211e29ef022a580db63572c23e9e308dee9da1a014a77a7ebf98e1
* Processed - 0x8248ae72903c604f01d4361d8d7261fadb2fa7e7d58daa61d7328ff7a00129be
* Packed - 0xac3978c601ad85d9037c021331d2fe4069343a9d68d6ef9c6f68aec59346d52b
* ForSale - 0x913ffccc83d5ff56539123dfdc1de66fe7b1937cb416ad70573b7db0709568cc
* Sold - 0xdc0473bd9fbf80d5ad9b1f9dda468a0930877456ae84a1edd6cc79026d3f6879
* Shipped - 0xd7376c8550e035987027a898532fb88c3e8e857922978f449f4b38d1b74b4038
* Received - 0xe2d89c66eaaf2b4a157ac179c205b9b706c51b0cca8feea3b0e130b522641f3f
* Purchased - 0x88e8541436b7c2b3d03e9d3488e065b50e679d865cb26bf462312b6c226037c8
```

All tests are approved without error:
![test](https://github.com/DoDuy/udacity-blockchain-developer-nanodegree/blob/main/3.%20Project%203%20Ethereum%20Dapp%20for%20Tracking%20Items%20through%20Supply%20Chain/images/test.png)

 ## 2: Deploy smart contract on a public test network (Rinkeby)
Name|Contract|Transaction
---|---|---
FarmerRole|[0x8Aa01c0b3013a190d76614Cbf0eCb33B56AF91FC](https://rinkeby.etherscan.io/address/0x8Aa01c0b3013a190d76614Cbf0eCb33B56AF91FC)|[0x14041f8fd8ede84fdde4726ddab2f9a3989906fe2ba30df0f598fd007648e2ad](https://rinkeby.etherscan.io/tx/0x14041f8fd8ede84fdde4726ddab2f9a3989906fe2ba30df0f598fd007648e2ad)
DistributorRole|[0xE53A0f1B9c45E08A424642C4e5Ebf1741bc3093e](https://rinkeby.etherscan.io/address/0xE53A0f1B9c45E08A424642C4e5Ebf1741bc3093e)|[0xd98a5e06a10943e618eafe4adeea99e63e30ba863fac2c9fec9ca035b3e896e2](https://rinkeby.etherscan.io/tx/0xd98a5e06a10943e618eafe4adeea99e63e30ba863fac2c9fec9ca035b3e896e2)
RetailerRole|[0xD44b2102c3C0224F8392B83b0e154dD2b1fa33A9](https://rinkeby.etherscan.io/address/0xD44b2102c3C0224F8392B83b0e154dD2b1fa33A9)|[0x5cac0609ac0da7828d3a936a2398161f3e72766fb0c2748177d9495c1e631706](https://rinkeby.etherscan.io/tx/0x5cac0609ac0da7828d3a936a2398161f3e72766fb0c2748177d9495c1e631706)
ConsumerRole|[0x35002B7B8657f517299b829808fAc4cf31efED37](https://rinkeby.etherscan.io/address/0x35002B7B8657f517299b829808fAc4cf31efED37)|[0x450197a609a44138673a92454c8ffae29b8f4c6bde9f871fce87d8f6f28c5683](https://rinkeby.etherscan.io/tx/0x450197a609a44138673a92454c8ffae29b8f4c6bde9f871fce87d8f6f28c5683)
SupplyChain|[0xb51823a43C3FE2C5af020e4DcEd9c3Eca2347E02](https://rinkeby.etherscan.io/address/0xb51823a43C3FE2C5af020e4DcEd9c3Eca2347E02)|[0xf0987b983cc091f8ebb5af718abad0924679c34e7656a4d0aa4f3e55e710c2c6](https://rinkeby.etherscan.io/tx/0xf0987b983cc091f8ebb5af718abad0924679c34e7656a4d0aa4f3e55e710c2c6)
