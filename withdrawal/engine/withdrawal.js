import {
    btcWithdrawalProcess
} from "./btcWithdrawal";
import {
    Settings,
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
                if (currency == "BTC") {
                    btcWithdrawalProcess(type, userId, currency, amount, raw_transaction, wallet, serverTxnRef);
                } else if (currency == "ETH") {
                    console.log(" Eth withdrawal function");
                } else {
                    console.log("please select the currency ETH or BTC");
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