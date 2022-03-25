const sampleContract = artifacts.require("sampleToken.sol");

module.exports = function (deployer) {
  deployer.deploy(sampleContract, "DuyDo", "DD", 100000);
};
