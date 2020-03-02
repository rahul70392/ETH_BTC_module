import BN from "bignumber.js";
import {
    Wallet,
    EthDeposit
} from "../../db";
import web3 from "../../utils/web3";
import {
    depositQueue
} from "../../utils/depositQ";
/**
 * Create Ether Deposit
 * @param {JSON} element Transaction object
 * @param {Number} timestamp Block Timestamp
 * @param {JSON} settings Settings object passed from index
 */
export const createEthDeposit = function (element, timestamp, settings) {
    //Check if deposit meant for our deposit address
    Wallet.findOne({
        ethAddress: element.to.toLowerCase()
    }).then((response) => {
        if (response == '' || response == null) return;

        if (web3.eth.getTransactionReceipt(element.hash) == null) {
            console.log((new Date().toGMTString()) +
                ' ==> Receipt Returned Null. Retrying After 5 Mins: ' + element.hash);
            setTimeout(() => {
                createEthDeposit(element, timestamp, settings);
            }, 300000);
            return;
        }

        if (web3.eth.getTransactionReceipt(element.hash).status == '0x0') return;
        if (BN(element.value).lte("0")) return;

        let valueSent = BN(element.value).div('1e18').toString();
        let valueFixed = BN(element.value).div('1e18').dp(8, 1).toString();
        //Recheck whether same hash present or not in deposit logs
        EthDeposit.findOne({
            txHash: element.hash
        }).then((hashPresentEth) => {

            if (hashPresentEth == null) {

                //Case 1: Valid deposit
                if (BN(valueSent).gte(settings.minDeposit.ethereum)) {
                    EthDeposit({
                        userObjectID: response._id,
                        user: response.userId,
                        sentFrom: element.from,
                        sentTo: element.to,
                        txHash: element.hash,
                        amount: valueSent,
                        minedBlockNumber: element.blockNumber,
                        lastBlockNumber: element.blockNumber,
                        receiveTimestamp: timestamp * 1000,
                        creditStatus: 'PENDING',
                        fundSent: false,
                        movementStatus: false
                    }).save().then((result) => {
                        if (result) {
                            console.log((new Date().toGMTString()) +
                                ' ==> User Ether Deposit: ' + element.hash);
                            let qData = {
                                amount: valueSent,
                                type: "DEPOSIT",
                                currency: "ETH",
                                wallet: {
                                    address: element.to,
                                    tag: ""
                                },
                                userId: response.userId,
                                txnRef: element.hash,
                                serverTxnRef: result._id,
                                status: "PENDING",
                                transactionInfo: result,
                                misc: ""
                            };
                            depositQueue(qData);
                        }
                    }).catch((err) => {
                        console.log((new Date().toGMTString()) + ' ==> ' + err);
                    });

                    //Case 2: Minimum Deposit
                } else {
                    EthDeposit({
                        userObjectID: response._id,
                        user: response.userId,
                        sentFrom: element.from,
                        sentTo: element.to,
                        txHash: element.hash,
                        amount: valueSent,
                        minedBlockNumber: element.blockNumber,
                        lastBlockNumber: element.blockNumber + 11,
                        receiveTimestamp: timestamp * 1000,
                        status: 500,
                        statusText: "SUCCESS",
                        confirmations: 12,
                    }).save().then((result) => {
                        if (result) {
                            console.log((new Date().toGMTString()) +
                                ' ==> User Minimum Ether Deposit: ' + element.hash);
                        }
                    }).catch((err) => {
                        console.log((new Date().toGMTString()) + ' ==> ' + err);
                    });
                }

            }
        }).catch((err) => {
            console.log((new Date().toGMTString()) + ' ==> ' + err);
        });

    }).catch((err) => {
        console.log((new Date().toGMTString()) + ' ==> ' + err);
    });
};