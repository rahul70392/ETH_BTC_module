import mongoose from "mongoose";


const BitcoinDepositSchema = new mongoose.Schema({
    userObjectID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        trim: true,
        ref: 'Wallet'
    },
    user: {
        type: String
    },
    currency: {
        type: String,
        default: 'BTC'
    },
    sentTo: {
        type: String,
        required: true,
        trim: true
    },
    txHash: {
        type: String,
        required: true,
        trim: true
    },
    vout: {
        type: Number,
        required: true
    },
    amount: {
        type: String
    },
    confirmations: {
        type: Number,
        required: true
    },
    receiveTimestamp: {
        type: Number,
        required: true
    },
    creditStatus: {
        type: String
    },
    creditTimestamp: {
        type: Number
    },
    fundSent: {
        type: Boolean
    },
    movementStatus: {
        type: Boolean
    },
    movementHash: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

BitcoinDepositSchema.index({
    movementHash: 1
});
BitcoinDepositSchema.index({
    txHash: 1,
    vout: 1
});
BitcoinDepositSchema.index({
    creditStatus: 1
});
BitcoinDepositSchema.index({
    fundSent: 1
});
BitcoinDepositSchema.index({
    fundSent: 1,
    movementStatus: 1
});

const BitcoinWithdrawalSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    currency: {
        type: String
    },
    type: {
        type: String,
    },
    status: {
        type: String
    },
    transactionHash: {
        type: String
    },
    amount: {
        type: String
    },
    raw_transaction: {
        type: String
    },
    serverTxnRef: {
        type: String
    },
    address: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});
BitcoinWithdrawalSchema.index({
    type: 1,
    userId: 1,
    status: 1,
});
const BtcWithdrawal = mongoose.model('BtcWithdrawal', BitcoinWithdrawalSchema);
const BtcDeposit = mongoose.model('BtcDeposit', BitcoinDepositSchema);

export {
    BtcWithdrawal,
    BtcDeposit
};