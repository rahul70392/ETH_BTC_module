import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
    minDeposit: {
        bitcoin: {
            type: String,
            default: "0.0002"
        },
        ethereum: {
            type: String,
            default: "0.01"
        },
    },
    minWithdrawal: {
        bitcoin: {
            type: String,
            default: "0.0002 "
        },
        ethereum: {
            type: String,
            default: "0.01"
        }
    },
    maxWithdrawal: {
        bitcoin: {
            type: String
        },
        ethereum: {
            type: String
        }
    },
    withdrawalFees: {
        bitcoin: {
            type: String
        },
        ethereum: {
            type: String
        }
    }
});

export const Settings = mongoose.model('Settings', SettingSchema);