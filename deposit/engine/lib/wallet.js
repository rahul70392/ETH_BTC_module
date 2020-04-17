import {
    importaddress
} from "../../utils/bitcoin";
import {
    Wallet,
    Settings
} from "../../db";
import open from "amqplib";
let connect = open.connect(global.config.queue_uri);
let walletQ = 'bxlend-wallet';
let exchange = 'bxlend-wallet-events';
const exchangeOptions = {
    durable: false,
    autoDelete: false,
};

connect.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    // ch.assertExchange(exchange, 'topic', exchangeOptions);
    ch.bindQueue(walletQ, exchange, '');
    return ch.consume(walletQ, async function (msg) {
        if (msg !== null) {
            let data = JSON.parse(msg.content.toString());
            let {
                type,
                userId,
                currency,
                wallet
            } = data;
            if (currency == "BTC") {
                btcWalletAddress(userId, currency, wallet, type);
            } else if (currency == "ETH") {
                ethWalletAddress(userId, currency, wallet, type);
            } else {
                console.log("Please add ETH or BTC wallet address");
            }
            ch.ack(msg);
        }
    });
}).catch(console.warn);


const btcWalletAddress = async (userId, currency, wallet, type) => {
    try {
        let result = await importaddress(wallet.address);
        if (result.result === null && result.error === null) {

            let findWallet = await Wallet.findOne({
                userId: userId,
                btcAddress: wallet.address
            });
            if (findWallet) return console.log("address already imported");
            new Wallet({
                userId: userId,
                btcAddress: wallet.address,
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
};

const ethWalletAddress = async (userId, currency, wallet, type) => {
    try {
        let findWallet = await Wallet.findOne({
            userId: userId,
            ethAddress: wallet.address
        });
        if (findWallet) return console.log("address already imported");
        new Wallet({
            userId: userId,
            ethAddress: wallet.address,
            currency: currency
        }).save().then(importAddress => {
            console.log(`Address ${wallet.address} save success`);
        }).catch(er => {
            console.log("wallet save failed try again", er);
        });

    } catch (error) {
        console.log('connection failed RPC url');
    }
};