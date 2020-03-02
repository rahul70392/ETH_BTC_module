import {
    depositQueue
} from "../../utils/depositQ";
import {
    EthDeposit
} from "../../db";


/**
 * Update ETH confirmations whenever a new block is mined.
 * We need to check confirmations based on current block and the blocknumber
 * in which the transaction was mined
 */
export const updateEthConfirmations = function (blocknumber) {
    EthDeposit.find({
        status: 0
    }).then((response) => {
        //Loop over the deposits
        response.forEach(element => {
            if (element.lastBlockNumber != blocknumber) {
                element.confirmations += blocknumber - element.lastBlockNumber;
                element.lastBlockNumber = blocknumber;

                //Case 1: Confirmed Deposit
                if (element.confirmations >= 2) {
                    element.confirmations = 2;
                    element.status = 100;
                    element.statusText = 'SUCCESS';
                    element.creditStatus = 'SUCCESS';
                    element.save().then(async (result) => {
                        if (result) {
                            console.log((new Date().toGMTString()) +
                                ' ==> Ether Deposit Confirmed: ' + result.txHash);
                            //======= add Q ======
                            let qData = {
                                amount: element.amount,
                                type: "DEPOSIT",
                                currency: "ETH",
                                wallet: {
                                    address: element.sentTo,
                                    tag: ""
                                },
                                userId: response.userId,
                                txnRef: result.txHash,
                                serverTxnRef: result._id,
                                status: "confirmed",
                                transactionInfo: result,
                                misc: ""
                            };
                            depositQueue(qData);
                        }
                    }).catch((err) => {
                        console.log((new Date().toGMTString()) + ' ==> ' + err);
                    });

                    //Case 2: Deposit still not confirmed so updating confirmations
                } else {
                    element.save().then((result) => {
                        if (result) {
                            console.log(`${(new Date().toGMTString())} ==> Updated Ether Confirmations: ${result.txHash} Confirmations: ${result.confirmations}`);
                        }
                    }).catch((err) => {
                        console.log((new Date().toGMTString()) + ' ==> ' + err);
                    });
                }

            }
        });
    }).catch((err) => {
        console.log((new Date().toGMTString()) + ' ==> ' + err);
    });
};