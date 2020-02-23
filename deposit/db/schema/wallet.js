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
    }
});

export const Wallet = mongoose.model('Wallet', WalletSchema);