import mongoose from "mongoose";
import {
    BtcDeposit
} from "./schema/bitcoin";
import {
    Wallet
} from "./schema/wallet";
import {
    Settings
} from "./schema/settings";
import {
    Admin
} from "./schema/admin";
import {
    EthDeposit
} from "./schema/ethereum";


mongoose.Promise = global.Promise;
let options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
mongoose.connect(global.config.db_uri, options).then(() =>
    console.log("connected to database")).catch(() => console.error("db connection failed"));

export {
    Wallet,
    BtcDeposit,
    Settings,
    Admin,
    EthDeposit
};