import url from "url";
import jayson from "jayson/promise";
let rpc = url.parse(global.config.btc_provider);
rpc.timeout = 50000;
const client = jayson.client.http(rpc);
/**
 * List unspent inputs of an address with specified number of confirmations
 * @param {String} address Bitcoin address whose unspent inputs are needed
 * @param {Number} minconf Minimum number of confirmations for those inputs
 * @async
 * @returns {Promise} Wrapped promise with an array of unspent inputs
 */
async function listunspent(address, minconf) {
    return client.request('listunspent', [minconf, 9999999, [address], true]);
}

/**
 * Get the current state of the blockchain node
 * @async
 * @returns {Promise} Wrapped promise with the JSON object of the blockchain status
 */
async function getblockchaininfo() {
    return client.request('getblockchaininfo', []);
}

/**
 * Import an address on the blockchain node
 * @param {String} address Bitcoin address to be imported
 * @async
 * @returns {Promise} Wrapped promise with the result and error of import operation
 */
async function importaddress(address) {
    return client.request('importaddress', [address, address, false]);
}

/**
 * Validate an address
 * @param {String} address Address to be validated
 * @async
 * @returns {Promise} Wrapped promise with the result and error of validate operation
 */
async function validateaddress(address) {
    return client.request('validateaddress', [address]);
}

/**
 * Submit a raw transaction
 * @param {String} tx Raw transaction object to be submitted on the blockchain
 * @async
 * @return {Promise} Wrapped Promise with the hash of the submitted txn or error
 */
async function sendrawtransaction(tx) {
    return client.request('sendrawtransaction', [tx]);
}

/**
 * Get transaction details using transaction hash
 * @param {String} tx Transaction hash of the txn to be queried
 * @async
 * @returns {Promise} Wrapped promise with the transaction details object
 */
async function gettransaction(tx) {
    return client.request('gettransaction', [tx, true]);
}

/**
 * Get block details using block hash
 * @param {String} hash Bitcoin block hash string
 * @async
 * @returns {Promise} Wrapped promise with the block details object
 */
async function getblock(hash) {
    return client.request('getblock', [hash]);
}
export {
    listunspent,
    getblockchaininfo,
    importaddress,
    validateaddress,
    sendrawtransaction,
    gettransaction,
    getblock
};