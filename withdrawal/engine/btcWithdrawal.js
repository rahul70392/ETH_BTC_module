import {
    sendrawtransaction
} from "../utils/bitcoin";
import {
    Wallet,
    Settings,
    BtcWithdrawal
} from "../db";
import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let walletQ = 'bxlend-withdrawal';

connect.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(walletQ).then(function (ok) {
        return ch.consume(walletQ, async function (msg) {
            if (msg !== null) {
                let data = JSON.parse(msg.content.toString());
                let {
                    type,
                    userId,
                    currency,
                    amount,
                    raw_transaction,
                    wallet,
                    serverTxnRef
                } = data;

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
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);

//================= save the settings parameters ===========
setImmediate(async () => {
    let findSettings = await Settings.find();
    if (findSettings.length > 0) return false;
    let save = await Settings().save();
});