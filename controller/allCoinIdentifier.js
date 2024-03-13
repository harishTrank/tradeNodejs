const tradeCoinModal = require("../models/tradeCoin.model");

const allCoinIdentifier = async (req, res) => {
  try {
    const { coinType } = req.query;
    let response;
    if (req.query?.search && req.query.search.length > 0) {
      response = await tradeCoinModal
        .find({
          InstrumentIdentifier: { $regex: new RegExp(req.query.search, "i") },
        })
        .sort({ InstrumentIdentifier: 1 });
    } else if (coinType && coinType !== "") {
      response = await tradeCoinModal
        .find({
          Exchange: coinType,
        })
        .sort({ InstrumentIdentifier: 1 });
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
