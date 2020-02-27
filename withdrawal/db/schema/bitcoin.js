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


export const BtcDeposit = mongoose.model('BtcDeposit', BitcoinDepositSchema);