const router = require("express").Router();
const allCoinIdentifier = require("../controller/allCoinIdentifier");
const tradeCoinLength = require("../controller/coinTypeWithLength");

router.get("/", allCoinIdentifier);
router.get("/length", tradeCoinLength);

module.exports = router;
