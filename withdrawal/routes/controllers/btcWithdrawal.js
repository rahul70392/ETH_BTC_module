import bitcore from "bitcore-lib";
import {
    listunspent,
    sendrawtransaction
} from "../../utils/bitcoin";

let privateKey = new bitcore.PrivateKey('cRKzD4YQxn2HeFsiPYAjabQuTQy4prjbvvKWShkmszuZZS8u8YwA');
let address = "mnn5w2YTPNPTdVm7Q1qAPFLPL6kPpWXjva";

export const transaction = async (req, res) => {
    try {
        let txinfo = await listunspent(address);
        console.log("88", txinfo);
        let a = [];
        a = a.concat(txinfo.result);
        console.log(a);
        let transaction = new bitcore.Transaction()
            .from(a)
            .to('mmwPXumSaAsEcStZkTM3McWnqz9RsU9uTB', 50000)
            .change("mnn5w2YTPNPTdVm7Q1qAPFLPL6kPpWXjva")
            .fee(80000)
            .sign(privateKey)
            .serialize();

        console.log("withdrawFunds>>>>>>>>>>>transaction>", transaction.toString());
        // console.log(transaction.serialize(), "transserialixe")
        // let sendTx = await sendrawtransaction(transaction.toString());
        // console.log("send trxn", sendTx);
        res.status(200).send(`success==>> ${transaction}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("failed");
    }
};