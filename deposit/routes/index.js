import express from "express";
import {
  addWallet
} from "./controller/wallet";
let router = express.Router();

/* GET home page. */
router.post('/add_wallet', addWallet);

module.exports = router;