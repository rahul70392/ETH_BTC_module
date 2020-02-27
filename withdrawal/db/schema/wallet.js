import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        index: true
    },
    address: {
        type: String,
        unique: true,
        trim: true,
        required: true,
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