import bitcoin from "../../utils/bitcoin";
import {
    Wallet,
    BtcDeposit
} from "../../db";
import BN from "bignumber.js";
import async from "async";
import {
    depositQueue
} from "../../utils/depositQ";
export const createBtcDeposit = async function (req, res) {
    try {
        //Query the transaction details
        let txn = (await bitcoin.gettransaction(req.query.tx)).result;

        /**
         * This amount is with respect to the node.
         * If it is positive means Bitcoins are definitely credited to the node addresses
         * If negative meaning Bitcoins are definitely sent out from the node
         * If zero means no bitcoins left the node
         * In all three cases, it is possible that Bitcoin moved from one of our addresses
         * to another one of our own addresses. This is not counted in amount variable
         */
        let amountDisplaced = txn.amount.toString();
        if (BN(amountDisplaced).gt("0")) {

            let deposits = txn.details;

            async.forEach(deposits, (element, callback) => {
                if (element.category === 'receive') {
                    //Check whether this transaction for our users deposit address or return
                    Wallet.findOne({
                        address: element.address
                    }).then(async (response) => {
                        if (response == '' || response == null) return callback();

                        let amount = element.amount.toString();
                        // Deposit
                        BtcDeposit.findOne({
                            txHash: txn.txid,
                            vout: element.vout
                        }).then((result) => {
                            if (result == null) {
                                BtcDeposit({
                                    userObjectID: response._id,
                                    user: response.userId,
                                    sentTo: element.address,
                                    txHash: txn.txid,
                                    vout: element.vout,
                                    amount: amount,
                                    confirmations: txn.confirmations,
                                    receiveTimestamp: txn.time * 1000,
                                    creditStatus: 'PENDING'
                                }).save().then((btcdeposit) => {
                                    if (btcdeposit) {
                                        console.log((new Date().toGMTString()) +
                                            ' ==> Bitcoin Deposit: ' + txn.txid);
                                        let qData = {
                                            amount: amount,
                                            type: "DEPOSIT",
                                            currency: "BTC",
                                            wallet: {
                                                address: element.address,
                                                tag: ""
                                            },
                                            userId: response.userId,
                                            txnRef: txn.txid,
                                            serverTxnRef: txn.txid,
                                            status: "YES",
                                            transactionInfo: btcdeposit,
                                            misc: ""
                                        };
                                        depositQueue(qData);
                                        callback();
                                    }
                                }).catch((err) => {
                                    console.log((new Date().toGMTString()) + ' ==> ' + err);
                                    callback(err);
                                });
                            } else {
                                callback();
                            }
                        }).catch((err) => {
                            console.log((new Date().toGMTString()) + ' ==> ' + err);
                            callback(err);
                        });

                    }).catch((err) => {
                        console.log((new Date().toGMTString()) + ' ==> ' + err);
                        callback(err);
                    });
                } else {
                    callback();
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                } else {
                    res.status(200).send();
                }
            });

        } else {
            res.status(400).send();
        }

    } catch (error) {
        console.log((new Date().toGMTString()) + ' ==> ' + error);
        res.status(500).send();
    }
};