import {
    sendrawtransaction
} from "../utils/bitcoin";
import web3 from "../utils/web3";
import {
    Wallet,
    EthWithdrawal
} from "../db";
import {
    withdrawalResponseQueue
} from "../utils/withdrawalQResponse";

export const ethWithdrawalProcess = async (type, userId, currency, amount, raw_transaction, wallet, serverTxnRef) => {

    try {
        let findTxnHash = await EthWithdrawal.findOne({
            raw_transaction: raw_transaction
        });
        if (findTxnHash) {
            console.log("Duplicate transaction");
            let data = {
                type: "WITHDRAW_RESPONSE",
                userId: userId,
                currency: currency,
                amount: amount,
                transaction: txResult,
                status: "duplicate transaction",
                serverTxnRef: serverTxnRef,
                wallet: {
                    address: wallet.address,
                    tag: ""
                }
            };
            return withdrawalResponseQueue(data);
        }

        let txResult = web3.eth.sendRawTransaction(raw_transaction);

        if (txResult) {
            new EthWithdrawal({
                userId: userId,
                amount: amount,
                type: type,
                currency: currency,
                status: "UNCONFIRMED",
                transactionHash: txResult,
                raw_transaction: raw_transaction,
                address: wallet.address,
                serverTxnRef: serverTxnRef
            }).save().then(result => {

                if (result) {

                    console.log((new Date().toGMTString()) + ' ==> ETH: ' +
                        txResult + ' Amount: ' + amount);
                    //======= send btc Q response ==============
                    let data = {
                        type: "WITHDRAW_RESPONSE",
                        userId: userId,
                        currency: currency,
                        amount: amount,
                        transaction: result,
                        status: "UNCONFIRMED",
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
                        transaction: {},
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
                let data = {
                    type: "WITHDRAW_RESPONSE",
                    userId: userId,
                    currency: currency,
                    amount: amount,
                    transaction: {},
                    status: "failed",
                    serverTxnRef: serverTxnRef,
                    wallet: {
                        address: wallet.address,
                        tag: ""
                    }
                };
                withdrawalResponseQueue(data);
            });
        } else {
            console.log("ETH transaction failed");
            let data = {
                type: "WITHDRAW_RESPONSE",
                userId: userId,
                currency: currency,
                amount: amount,
                transaction: {},
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
        console.log('Invalid input', error);
        let data = {
            type: "WITHDRAW_RESPONSE",
            userId: userId,
            currency: currency,
            amount: amount,
            transaction: {},
            status: "failed",
            serverTxnRef: serverTxnRef,
            wallet: {
                address: wallet.address,
                tag: ""
            }
        };
        withdrawalResponseQueue(data);
    }
};