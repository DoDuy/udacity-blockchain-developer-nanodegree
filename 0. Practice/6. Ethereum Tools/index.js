/*##########################

CONFIGURATION
##########################*/

// -- Step 1: Set up the appropriate configuration 
var Web3 = require("web3") 
var EthereumTransaction = require("ethereumjs-tx").Transaction
var web3 = new Web3('HTTP://127.0.0.1:7545')

// -- Step 2: Set the sending and receiving addresses for the transaction. 
var sendingAddress = '0x2f0F5fFF26e3407F2B423F3Ee9651ceD3593a8BF' 
var receivingAddress = '0xC82E25bFB1455744E666b6CcAB15C5B788698628'

// -- Step 3: Check the balances of each address
console.log("Before sending:")
web3.eth.getBalance(sendingAddress).then(balance => {
    console.log(web3.utils.fromWei(balance, 'ether'))
})
web3.eth.getBalance(receivingAddress).then(balance => {
    console.log(web3.utils.fromWei(balance, 'ether'))
})

/*##########################

CREATE A TRANSACTION
##########################*/

// -- Step 4: Set up the transaction using the transaction variables as shown 
var amountSend = "10"
console.log("Amount send = ", amountSend, web3.utils.toWei(amountSend,  "ether"))
var rawTransaction ={
    nonce: web3.utils.toHex(2),
    to: receivingAddress,
    gasPrice: web3.utils.toHex(20000000),
    gasLimit: web3.utils.toHex(30000),
    value: web3.utils.toHex(web3.utils.toWei(amountSend,  'ether')),
    data: web3.utils.toHex("")
}

// -- Step 5: View the raw transaction rawTransaction

// -- Step 6: Check the new account balances (they should be the same) 
// web3.eth.getBalance(sendingAddress).then(console.log) 
// web3.eth.getBalance(receivingAddress).then(console.log)

/*##########################

Sign the Transaction
##########################*/

// -- Step 7: Sign the transaction with the Hex value of the private key of the sender 
var privateKeySender = 'df6df096a7eced904990a329f02221fcb87f3f1b32fd540600728dd1edbba038' 
var privateKeySenderHex = new Buffer.from(privateKeySender, 'hex') 
var transaction = new EthereumTransaction(rawTransaction) 
transaction.sign(privateKeySenderHex)

/*#########################################

Send the transaction to the network
#########################################*/

// -- Step 8: Send the serialized signed transaction to the Ethereum network. 
var serializedTransaction = transaction.serialize(); 
web3.eth.sendSignedTransaction(serializedTransaction);