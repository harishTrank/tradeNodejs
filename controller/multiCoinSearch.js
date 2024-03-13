const tradeCoinModal = require("../models/tradeCoin.model");

const multiCoinSearch = async (req, res) => {
  let response;
  try {
    response = await tradeCoinModal.find({
      Exchange: { $in: req.body.coinList },
    });

    if (req.query?.search && req.query.search.length > 0) {
      response = await tradeCoinModal
        .find({
          InstrumentIdentifier: { $regex: new RegExp(req.query.search, "i") },
          Exchange: { $in: req.body.coinList },
        })
        .sort({ InstrumentIdentifier: 1 });
    }

    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully.",
      response,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = multiCoinSearch;
