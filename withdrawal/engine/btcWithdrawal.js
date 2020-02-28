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
            new BtcWithdrawal({
                userId: userId,
                amount: amount,
                type: type,
                currency: currency,
                status: "PROCESSING",
                transactionHash: txResult.result,
                raw_transaction: raw_transaction,
                address: wallet.address,
                serverTxnRef: serverTxnRef
            }).save().then(result => {
                console.log(result);
                if (result) {

                    console.log((new Date().toGMTString()) + ' ==> BTC: ' +
                        txResult.result + ' Amount: ' + amount);
                    // postBtcWithdrawal(id, withdrawals, actualFee, txResult.result);
                    //======= send btc Q response ==============
                    let data = {
                        type: "WITHDRAW_RESPONSE",
                        userId: userId,
                        currency: currency,
                        amount: amount,
                        transaction: result,
                        status: "PROCESSING",
                        serverTxnRef: serverTxnRef,
                        wallet: {
                            address: wallet.address,
                            tag: ""
                        }
                    };
                    withdrawalResponseQueue(data);
                } else {
                    console.log("save withdrawal failed");
                }
            }).catch((err) => {
                console.log((new Date().toGMTString()) + ' ==> ' + err);
            });
        } else {
            console.log("failed trx btc");
        }

    } catch (error) {
        console.log('connection failed RPC url');
    }
};