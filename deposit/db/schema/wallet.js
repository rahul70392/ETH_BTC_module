import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    address: {
        type: String
    },
    currency: {
        type: String
    }
});

export const Wallet = mongoose.model('Wallet', WalletSchema);