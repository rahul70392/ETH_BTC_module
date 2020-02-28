import {
    sendrawtransaction
} from "../utils/bitcoin";
import {
    Wallet,
    BtcWithdrawal
} from "../db";
import {
    withdrawalResponseQueue
} from "../utils/withdrawalQResponse";

export const btcWithdrawalProcess = async (type, userId, currency, amount, raw_transaction, wallet, serverTxnRef) => {

    try {
        let txResult = await sendrawtransaction(raw_transaction);

        if (txResult.error == null) {
            let findTxnHash = await BtcWithdrawal.findOne({
                transactionHash: txResult.result
            });
            if (findTxnHash) {
                console.log("Duplicate transaction");
                let data = {
                    type: "WITHDRAW_RESPONSE",
                    userId: userId,
                    currency: currency,
                    amount: amount,
                    transaction: txResult.result,
                    status: "duplicate transaction",
                    serverTxnRef: serverTxnRef,
                    wallet: {
                        address: wallet.address,
                        tag: ""
                    }
                };
                withdrawalResponseQueue(data);
            } else {
                new BtcWithdrawal({
                    userId: userId,
                    amount: amount,
                    type: type,
                    currency: currency,
                    status: "unconfirmed",
                    transactionHash: txResult.result,
                    raw_transaction: raw_transaction,
                    address: wallet.address,
                    serverTxnRef: serverTxnRef
                }).save().then(result => {

                    if (result) {

                        console.log((new Date().toGMTString()) + ' ==> BTC: ' +
                            txResult.result + ' Amount: ' + amount);
                        //======= send btc Q response ==============
                        let data = {
                            type: "WITHDRAW_RESPONSE",
                            userId: userId,
                            currency: currency,
                            amount: amount,
                            transaction: result,
                            status: "unconfirmed",
                            serverTxnRef: serverTxnRef,
                            wallet: {
                                address: wallet.address,
                                tag: ""
                            }
                        };
                        withdrawalResponseQueue(data);
                    } else {
                        console.log("save withdrawal failed");
                        let data = {
                            type: "WITHDRAW_RESPONSE",
                            userId: userId,
                            currency: currency,
                            amount: amount,
                            transaction: "",
                            status: "failed",
                            serverTxnRef: serverTxnRef,
                            wallet: {
                                address: wallet.address,
                                tag: ""
                            }
                        };
                        withdrawalResponseQueue(data);
                    }
                }).catch((err) => {
                    console.log((new Date().toGMTString()) + ' ==> ' + err);
                });
            }
        } else {
            console.log("BTC transaction failed");
            let data = {
                type: "WITHDRAW_RESPONSE",
                userId: userId,
                currency: currency,
                amount: amount,
                transaction: "",
                status: "failed",
                serverTxnRef: serverTxnRef,
                wallet: {
                    address: wallet.address,
                    tag: ""
                }
            };
            withdrawalResponseQueue(data);
        }

    } catch (error) {
        console.log('connection failed RPC url');
    }
};