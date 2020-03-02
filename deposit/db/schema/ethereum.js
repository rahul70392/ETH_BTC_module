import mongoose from "mongoose";

const EtherDepositSchema = new mongoose.Schema({
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
        default: 'ETH'
    },
    sentFrom: {
        type: String,
        required: true,
        trim: true
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
    amountActual: {
        type: String,
        required: true
    },
    amountFixed: {
        type: String
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    statusText: {
        type: String,
        required: true,
        trim: true,
        default: 'PENDING'
    },
    minedBlockNumber: {
        type: Number,
        required: true
    },
    lastBlockNumber: {
        type: Number,
        required: true
    },
    confirmations: {
        type: Number,
        required: true,
        default: 1
    },
    receiveTimestamp: {
        type: Number,
        required: true
    },
    creditStatus: {
        type: String
    },
    updatedBalance: {
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

EtherDepositSchema.index({
    txHash: 1
});
EtherDepositSchema.index({
    movementHash: 1
});
EtherDepositSchema.index({
    sentTo: 1,
    fundSent: 1
});
EtherDepositSchema.index({
    status: 1,
    creditStatus: 1
});
EtherDepositSchema.index({
    fundSent: 1,
    status: 1
});
EtherDepositSchema.index({
    fundSent: 1,
    movementStatus: 1
});

export const EthDeposit = mongoose.model('EthDeposit', EtherDepositSchema);