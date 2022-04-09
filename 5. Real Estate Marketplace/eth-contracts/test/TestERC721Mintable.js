var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const name = "Real Eastate";
    const symbol = "RE";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(name, symbol, {from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, { from: account_one });
            await this.contract.mint(account_one, 2, { from: account_one });
            await this.contract.mint(account_one, 3, { from: account_one });
            await this.contract.mint(account_two, 4, { from: account_one });
            await this.contract.mint(account_two, 5, { from: account_one });
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(Number(totalSupply), 5, "Total supply incorrect");
        })

        it('should get token balance', async function () { 
            let balance_account_one = await this.contract.balanceOf(account_one);
            assert.equal(Number(balance_account_one), 3, "Balance of account 1 incorrect");


            let balance_account_two = await this.contract.balanceOf(account_two);
            assert.equal(Number(balance_account_two), 2, "Balance of account 2 incorrect");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let idx = 1;
            let base_uri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

            let uri = await this.contract.tokenURI(idx);
            assert.equal(uri, base_uri + String(idx), "URI incorrect");
        })

        it('should transfer token from one owner to another', async function () { 
            let idx = 3;
            await this.contract.transferFrom(account_one, account_two, idx, {from: account_one});

            let ownerOfToken = await this.contract.ownerOf(idx);
            assert.equal(ownerOfToken, account_two, "Change owner of token fail");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(symbol, name, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let error;
            try {
                await this.contract.mint(account_one, 1, { from: account_two });
            } catch (e){
                error = e;
            }
            assert.notEqual(error, null, "Minting not error");
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner();
            assert.equal(contractOwner, account_one, "Contract owner address incorrect");
        })

    });
})