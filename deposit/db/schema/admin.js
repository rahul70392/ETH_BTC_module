import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    queuedEthBlock: {
        type: Number,
        required: true
    },
    lastParsedEthBlock: [],
    lastParsedBtcBlock: []
});

export const Admin = mongoose.model('Admin', AdminSchema);