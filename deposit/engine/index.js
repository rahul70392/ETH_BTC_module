import async from "async";
import web3 from "../utils/web3";
import {
    Settings,
    Admin
} from "../db";
import {
    updateEthConfirmations
} from "./lib/confirmation";
import {
    createEthDeposit
} from "./lib/createDeposit";
import "./lib/wallet";
/**
 * Startup Script To Queue Latest Block
 */
setImmediate(async () => {
    const latestEthBlock = web3.eth.blockNumber;

    let [findSetting, findAdmin] = await Promise.all([Settings.find(), Admin.find()]);
    if (findSetting.length >= 1) {
        console.log("Settings data save for min and max value for Eth and Btc");
    } else {
        let saveSettings = await Settings().save();
    }
    if (findAdmin.length >= 1) {
        console.log("admin save block");
    } else {
        let saveAdmin = await Admin({
            queuedEthBlock: latestEthBlock + 1,
            lastParsedEthBlock: [latestEthBlock],
            lastParsedBtcBlock: []
        }).save();
    }
    const lastEthBlock = (await Admin.aggregate([{
        $project: {
            lastParsedEthBlock: {
                $arrayElemAt: ["$lastParsedEthBlock", -1]
            }
        }
    }]))[0].lastParsedEthBlock;

    if (latestEthBlock - lastEthBlock > 1) {
        Admin.updateOne({}, {
            $set: {
                queuedEthBlock: latestEthBlock + 1
            }
        }).then((result) => {
            if (result.n == 1 && result.nModified == 1 && result.ok == 1) {
                console.log((new Date().toGMTString()) + ' ==> Queued Block: ' + (latestEthBlock + 1));
            }
        });
    }
});

/**
 * @description Ethereum Blocks Watch
 * @fires callback When a new block is added to the node
 */
setInterval(async () => {
    const nextBlock = (await Admin.findOne({})).queuedEthBlock;

    //Passing true returns full transactions of the block
    const block = web3.eth.getBlock(nextBlock, true);

    /**
     * Below logic prevents reading of duplicate blocks and
     * so creating duplicate entries for same transactions
     */
    if (block != null) {
        Admin.updateOne({}, {
            $inc: {
                queuedEthBlock: 1
            }
        }).then((result) => {
            if (result.n == 1 && result.nModified == 1 && result.ok == 1) {
                console.log(`${(new Date().toGMTString())} ==> Parsing New Block: ${nextBlock}`);
                checkTransactions(nextBlock, block.transactions, block.timestamp);
                updateEthConfirmations(block.number);
            }
        }).catch((err) => {
            console.log((new Date().toGMTString()) + ' ==> ' + err);
        });
    } else {
        console.log(`${(new Date().toGMTString())} ==> Retrying Block Number ${nextBlock}`);
    }
}, 10000);

/**
 * Checks every transaction from the block and accordingly creates a deposit
 * for DEVG or ETH based on the "to" address
 * @param {Array} transactions An array of transactions mined in a block
 * @param {Number} timestamp Timestamp of the block being parsed
 * @async
 */
async function checkTransactions(number, transactions, timestamp) {
    /**
     * Pull Settings so that it can be passed to the
     * subsequent functions so that we don't need to
     * individually query db again in every function
     */
    let settings = await Settings.findOne({});

    async.forEach(transactions, (element, callback) => {
            /**
             * We need to ignore the transactions from our gas address
             * else it will create a minimum deposit every time we credit
             * gas to our address after a DEVG deposit.
             */
            let result = (element.from != null && element.to != null) ?
                createEthDeposit(element, timestamp, settings) : false;

            callback();
        },
        function (err) {
            if (err) {
                console.log(err);
            } else {
                Admin.updateOne({}, {
                    $addToSet: {
                        lastParsedEthBlock: number
                    }
                }).then((result) => {
                    if (result.n == 1 && result.nModified == 1 && result.ok == 1) {
                        console.log(`${(new Date().toGMTString())} ==> Successfully Parsed Ethereum Block: ${number}`);
                    }
                }).catch((err) => {
                    console.log((new Date().toGMTString()) + ' ==> ' + err);
                });
            }
        });
}