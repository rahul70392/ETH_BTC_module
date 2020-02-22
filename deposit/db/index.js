import mongoose from "mongoose";
import {
    Wallet
} from "./schema/wallet";
mongoose.Promise = global.Promise;
let options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
mongoose.connect(global.config.db_uri, options).then(() =>
    console.log("connected to database")).catch(() => console.error("db connection failed"));

export {
    Wallet
};