import {
    importaddress
} from "../utils/bitcoin";
import {
    Wallet,
    Settings
} from "../db";
import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let walletQ = 'bxlend-wallet';

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
                    wallet
                } = data;

                try {
                    let result = await importaddress(wallet.address);
                    if (result.result === null && result.error === null) {

                        let findWallet = await Wallet.findOne({
                            userId: userId,
                            address: wallet.address
                        });
                        if (findWallet) return console.log("address already imported");
                        new Wallet({
                            userId: userId,
                            address: wallet.address,
                            currency: currency
                        }).save().then(importAddress => {
                            console.log(`Address ${wallet.address} save success`);
                        }).catch(er => {
                            console.log("wallet save failed try again", er);
                        });
                    } else {
                        console.log('wallet import failed');
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