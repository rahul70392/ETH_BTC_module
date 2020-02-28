import {
    sendrawtransaction
} from "../utils/bitcoin";
import {
    Wallet,
    BtcWithdrawal
} from "../db";

export const btcWithdrawalProcess = async (type, userId, currency, amount, raw_transaction, wallet, serverTxnRef) => {

    try {
        let txResult = await sendrawtransaction(raw_transaction);
        if (txResult.error == null) {
            new BtcWithdrawal({
                userId: userId,
                amount: amount,
                type: type,
                token: currency,
                status: "PROCESSING",
                raw_transaction: raw_transaction,
                address: wallet.address,
                serverTxnRef: serverTxnRef
            }).save((result) => {
                if (result.n >= 1 && result.nModified >= 1 && result.ok == 1) {

                    console.log((new Date().toGMTString()) + ' ==> BTC: ' +
                        txResult.result + ' Amount: ' + amount);
                    // postBtcWithdrawal(id, withdrawals, actualFee, txResult.result);
                    //===== send Q response   =====
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