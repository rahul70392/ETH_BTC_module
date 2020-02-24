import express from "express";
let router = express.Router();
import {
    createBtcDeposit
} from "./controller/btcDeposit";
/* GET home page. */
router.get('/', createBtcDeposit);
module.exports = router;