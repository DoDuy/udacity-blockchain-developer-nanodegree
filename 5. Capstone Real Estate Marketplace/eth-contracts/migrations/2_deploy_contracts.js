// migrating the appropriate contracts
var Verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const Proof = require("../../zokrates/code/square/proof.json");

module.exports = function(deployer) {
  const NUM_TOKENS = 10;

  deployer.deploy(Verifier)
  .then(() => {
    return deployer.deploy(SolnSquareVerifier, "Real Eastate", "RE")
    .then(async (instance) => {
      let owner = await instance.getOwner(); 
      for (let i = 1; i <= NUM_TOKENS; i++) {
        let result;
        try {
            result = await instance.mintNFT(owner, i, 
                                          Proof.proof,
                                          Proof.inputs);
        } catch (e){
            console.log(e);
        }
        if (result) {
          console.log("Mint: ", owner, i, "Solution event: ", result.logs[1].event)
        } else {
          console.log("Mint fail")
        }
      }
    })
  })
};
