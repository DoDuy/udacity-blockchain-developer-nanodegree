// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Proof = require("../../zokrates/code/square/proof.json");

contract('Verifier', accounts => {
    const account_one = accounts[0];

    const name = "Real Eastate";
    const symbol = "RE";

    describe('Test verification with correct and incorrect proof', function () {
        beforeEach(async function () { 
            this.contract = await SolnSquareVerifier.new(name, symbol, {from: accounts[0]});
        })

        it('Test if a new solution can be added and if an ERC721 token can be minted', async function () { 
            let result;
            try {
                result = await this.contract.mintNFT(account_one, 1, 
                                                Proof.proof,
                                                Proof.inputs,
                                                {from: account_one});
            } catch (e){
                console.log(e);
            }
            assert.notEqual(result, null, "ERC721 token should be minted");
            assert.equal(result.logs[1].event, "SolutionAdded", "New solution can be added");            
        })
    });
})