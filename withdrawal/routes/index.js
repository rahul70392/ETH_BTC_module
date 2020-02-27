import express from "express";
let router = express.Router();
import {
  transaction
} from "./controllers/btcWithdrawal";
/* GET home page. */
router.get('/', (req, res) => {
  res.send("hii manjesh");
});
router.post('/trx', transaction);
module.exports = router;