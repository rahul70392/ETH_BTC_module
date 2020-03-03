import {
    btcWithdrawalProcess
} from "./btcWithdrawal";
import {
    ethWithdrawalProcess
} from "./ethWithdrawal";
import {
    Settings,
    EthWithdrawal,
    BtcWithdrawal
} from "../db";
import {
    withdrawalResponseQueue
} from "../utils/withdrawalQResponse";
import web3 from "../utils/web3";
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
                    console.log("BTC withdrawal process");
                    btcWithdrawalProcess(type, userId, currency, amount, raw_transaction, wallet, serverTxnRef);
                } else if (currency == "ETH") {
                    console.log(" Eth withdrawal function");
                    ethWithdrawalProcess(type, userId, currency, amount, raw_transaction, wallet, serverTxnRef);
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

// ===== update ETH withdrawal status =========
setInterval(async () => {
    try {
        let ethWithdrawals = await EthWithdrawal.find({
            type: "WITHDRAW",
            currency: "ETH",
            status: "UNCONFIRMED"
        });
        if (ethWithdrawals.length === 0) return;

        ethWithdrawals.forEach(async element => {
            let receipt = web3.eth.getTransactionReceipt(element.transactionHash);
            if (receipt == null || receipt == '' || !receipt) return;
            element.status = (receipt.status == '0x1') ? 'SUCCESS' : 'FAILED';
            let saved = await element.save();
            if (saved) {
                console.log((new Date().toGMTString()) +
                    ' ==> ETH Withdrawal Status Confirmed. Hash: ', element.transactionHash);
                let data = {
                    type: "WITHDRAW_RESPONSE",
                    userId: element.userId,
                    currency: element.currency,
                    amount: element.amount,
                    transaction: saved,
                    status: saved.status,
                    serverTxnRef: element.serverTxnRef,
                    wallet: {
                        address: element.address,
                        tag: ""
                    }
                };
                withdrawalResponseQueue(data);
            } else {
                console.log("ETH Withdrawal Status update Failed");
            }
        });
    } catch (error) {
        console.log((new Date().toGMTString()) + ' ==> ' + error);
    }
}, 5000);