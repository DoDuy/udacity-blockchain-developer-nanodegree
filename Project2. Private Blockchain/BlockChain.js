/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        // Add your code here
        this.bd.getBlocksCount()
        .then((height) => {
            if (height === 0) {
                this.addBlock(new Block.Block("This is Genesis Block!"))
                .then((block) => {
                    console.log(block);
                })
            }
        })
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        let self = this;
        return new Promise(function(resolve, reject){
            self.bd.getBlocksCount()
            .then((height) => {
                resolve(height);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    // Add new block
    addBlock(block) {
        // Add your code here
        let self = this;
        return new Promise(function(resolve, reject){
            self.getBlockHeight()
            .then((height) => {
                block.height = height;
                block.time = new Date().getTime().toString().slice(0, -3);
                if (height > 0){
                    self.getBlock(height - 1)
                    .then((previousBlock) => {
                        block.previousBlockHash = previousBlock.hash;
                        block.hash = SHA256(JSON.stringify(block).toString()).toString();
                        self.bd.addLevelDBData(height, JSON.stringify(block).toString())
                        .then((value) => {
                            resolve(block);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                    })
                    .catch((error) => {
                        reject(error);
                    })
                } else {
                    block.hash = SHA256(JSON.stringify(block).toString()).toString();
                    self.bd.addLevelDBData(height, JSON.stringify(block).toString())
                    .then((value) => {
                        resolve(block);
                    })
                    .catch((error) => {
                        reject(error);
                    });
                }           
            })  
            .catch((error) => {
                reject(error);
            })      
        })
        
    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here
        let self = this;
        return new Promise(function(resolve, reject){
            self.bd.getLevelDBData(height)
            .then((block) => {
                resolve(JSON.parse(block));
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        let self = this;
        return new Promise(function(resolve, reject){
            self.getBlock(height)
            .then((block) => {
                let blockHash = block.hash;
                block.hash = "";
                let validBlockHash = SHA256(JSON.stringify(block).toString()).toString();
                if (validBlockHash === blockHash) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    // Validate Blockchain 
    validateChain() {
        // Add your code here
        let self = this;
        var errorLog = [];
        var validLog = [];
        return new Promise(function(resolve, reject){
            self.getBlockHeight()
            .then((height) => {
                let heightList = Array.from(Array(height).keys());
                const validPromises = [];
                heightList.map((h) => {
                    validPromises.push(self.validateBlock(h));
                })

                Promise.all(validPromises)
                .then((valids) => {
                    valids.forEach(function(value, idx){
                        if (!value) {
                            errorLog.push("Block " + idx + " is not valid!");
                        }

                        const blockPromises = [];
                        heightList.map((h) => {
                            blockPromises.push(self.getBlock(h));
                        })
                        Promise.all(blockPromises)
                        .then((blocks) => {
                            for (let i = 1; i < height; i++){
                                if (blocks[i-1].hash != blocks[i].previousBlockHash) {
                                    errorLog.push("Block " + (i-1) + " and Block " + i + " are not connected!");
                                }
                            }
                            resolve(errorLog);
                        })
                        .catch((error) => {
                            reject(error);
                        })
                    })
                })
                .catch((errors) => {
                    reject(errors)
                })
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;
