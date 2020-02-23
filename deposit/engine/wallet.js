import {
    importaddress
} from "../utils/bitcoin";
import {
    Wallet
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
                console.log(wallet.address, type);
                try {
                    let result = await importaddress(wallet.address);
                    if (result.result === null && result.error === null) {
                        console.log('wallet import success');
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