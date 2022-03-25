// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
contract SampleToken is ERC20 {

    constructor(string memory _name, string memory _symbol, uint _initialSupply) ERC20(_name, _symbol) {
        require(_initialSupply > 0, "INITIAL_SUPPLY has to be greater than 0");
        _mint(msg.sender, _initialSupply*10**decimals());
    }

    // function decimals() public view virtual override returns (uint8) {
    //     return 10;
    // }
}