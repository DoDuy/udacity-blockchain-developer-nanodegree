# Ethereum Dapp for Tracking Items through Supply Chain
For this project, I created a DApp supply chain solution backed by the Ethereum platform. I architected smart contracts that manage specific user permission controls as well as contracts that track and verify a product’s authenticity.

## 1: Plan the project with write-ups
### Project write-up - UML
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

All tests are approved without error:
 ## 2: Deploy smart contract on a public test network (Rinkeby)
Name|Contract|Transaction
---|---|---
FarmerRole|0x8Aa01c0b3013a190d76614Cbf0eCb33B56AF91FC|0x14041f8fd8ede84fdde4726ddab2f9a3989906fe2ba30df0f598fd007648e2ad
DistributorRole|0xE53A0f1B9c45E08A424642C4e5Ebf1741bc3093e|0xd98a5e06a10943e618eafe4adeea99e63e30ba863fac2c9fec9ca035b3e896e2
RetailerRole|0xD44b2102c3C0224F8392B83b0e154dD2b1fa33A9|0x5cac0609ac0da7828d3a936a2398161f3e72766fb0c2748177d9495c1e631706
ConsumerRole|0x35002B7B8657f517299b829808fAc4cf31efED37|0x450197a609a44138673a92454c8ffae29b8f4c6bde9f871fce87d8f6f28c5683
SupplyChain|0xb51823a43C3FE2C5af020e4DcEd9c3Eca2347E02|0xf0987b983cc091f8ebb5af718abad0924679c34e7656a4d0aa4f3e55e710c2c6
