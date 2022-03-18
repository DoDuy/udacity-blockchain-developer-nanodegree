const SHA256 = require('crypto-js/sha256');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blockchain = new BlockChain.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // Add your code here
            let height = req.param('index');
            this.blockchain.getBlock(height)
            .then((block) => {
                res.status(200).send(block);
            })
            .catch((error) => {
                res.status(550).json(error);
            })
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here
            let data = req.param('data');
            this.blockchain.addBlock(new Block.Block(data))
            .then((block) => {
                res.status(200).send(block);
            })
            .catch((error) => {
                res.status(550).json(error);
            })
        });
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}