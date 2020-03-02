import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    btcAddress: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        index: true
    },
    ethAddress: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        index: true
    },
    currency: {
        type: String
    },
    type: {
        type: String,
        default: "ADD_WALLET"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

export const Wallet = mongoose.model('Wallet', WalletSchema);