var HDWalletProvider = require("@truffle/hdwallet-provider");
// var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
const infuraKey = "95a68d8f3b0a4d24a5e225a6e9e88253";
//
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*',
      gas: 9999999
    }, 
    ganache: {
      host: "127.0.0.1",
      network_id: '*',
      port: 8545, 
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // rinkeby's id
      gas: 8500000,        // rinkeby has a lower block limit than mainnet
      gasPrice: 20000000000
    }
  },
  compilers: {
    solc: {
      version: "^0.4.25"
    }
  }
};