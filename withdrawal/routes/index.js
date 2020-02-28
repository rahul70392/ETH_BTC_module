import express from "express";
let router = express.Router();
/* GET home page. */
router.get('/', (req, res) => {
  res.send("hii manjesh");
});

module.exports = router;