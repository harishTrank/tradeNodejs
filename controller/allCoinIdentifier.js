const tradeCoinModal = require("../models/tradeCoin.model");
const { miniList } = require("../Extra/MiniList");

const allCoinIdentifier = async (req, res) => {
  try {
    const { coinType } = req.query;
    let response;
    if (coinType === "MINI") {
      response = await tradeCoinModal.find({
        InstrumentIdentifier: { $in: miniList },
        Exchange: "MCX",
      });
    } else if (coinType === "MCX") {
      response = await tradeCoinModal.find({
        InstrumentIdentifier: { $nin: miniList },
        Exchange: "MCX",
      });
    } else if (coinType === "NSE") {
      response = await tradeCoinModal.find({
        Exchange: "NSE",
      });
    } else {
      response = await tradeCoinModal.find({});
    }

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(404).json({
      success: false,
      err,
    });
  }
};

module.exports = allCoinIdentifier;
