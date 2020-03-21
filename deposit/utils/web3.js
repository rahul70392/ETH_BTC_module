const Web3 = require('web3');

/**
 * Web3 Connects To Ethereum Node
 */
let web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider(global.config.eth_provider));
    // console.log(web3.isConnected())
    if (web3.isConnected() == false) {
        web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`));
        web3.eth.getBlockNumber(function (error, block) {
            if (error) {
                console.log((new Date().toGMTString()) + ' ==> ' + error);
            } else {
                console.log(`${(new Date().toGMTString())} ==> Connected to Geth Client. Latest Block: ${block}, Network ID: ${web3.version.network}`);
            }
        });
    } else {
        web3.eth.getBlockNumber(function (error, block) {
            if (error) {
                console.log((new Date().toGMTString()) + ' ==> ' + error);
            } else {
                console.log(`${(new Date().toGMTString())} ==> Connected to Geth Client. Latest Block: ${block}, Network ID: ${web3.version.network}`);
            }
        });
    }
}

module.exports = web3;