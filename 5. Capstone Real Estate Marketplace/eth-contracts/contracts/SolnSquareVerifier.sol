pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    Verifier verifier = new Verifier();

// TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address solutionAddress;
    }

// TODO define an array of the above struct
    Solution[] private solutions;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address solutionAddress);

    constructor (string memory name, string memory symbol) public CustomERC721Token(name, symbol) {}
    
// TODO Create a function to add the solutions to the array and emit the event
    function _addSolution(uint256 index, address solutionAddress) internal {
        Solution memory solution = Solution({index: index,
                                            solutionAddress: solutionAddress});

        solutions.push(solution);

        bytes32 key = keccak256(abi.encodePacked(index, solutionAddress));
        uniqueSolutions[key] = solution;

        emit SolutionAdded(index, solutionAddress);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintNFT(address to, 
                    uint256 tokenId,
                    Verifier.Proof memory proof, 
                    uint[2] memory input) 
                    public 
                    onlyOwner {
        require(verifier.verifyTx(proof, input), "Proof is invalid");

        bytes32 key = keccak256(abi.encodePacked(tokenId, to));
        require(uniqueSolutions[key].solutionAddress == address(0), "Solution already exists");

        super.mint(to, tokenId);
        _addSolution(tokenId, to);
    }
}