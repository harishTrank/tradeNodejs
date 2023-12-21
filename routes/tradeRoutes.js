const router = require("express").Router();
const allCoinIdentifier = require("../controller/allCoinIdentifier");
const tradeCoinLength = require("../controller/coinTypeWithLength");
const multiCoinSearch = require("../controller/multiCoinSearch");

router.get("/", allCoinIdentifier);
router.get("/length", tradeCoinLength);
router.post("/coins", multiCoinSearch);

module.exports = router;
