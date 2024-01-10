const router = require("express").Router();
const expireCoinDelete = require("../Services/expireCoinDelete");
const allCoinIdentifier = require("../controller/allCoinIdentifier");
const tradeCoinLength = require("../controller/coinTypeWithLength");
const multiCoinSearch = require("../controller/multiCoinSearch");
const squareOffApiManager = require("../controller/squareOffApiManager");

router.get("/", allCoinIdentifier);
router.get("/length", tradeCoinLength);
router.post("/coins", multiCoinSearch);
router.get("/squareoff", squareOffApiManager);
router.get("/expire", expireCoinDelete);

module.exports = router;
