const tradeCoinModal = require("../models/tradeCoin.model");

const multiCoinSearch = async (req, res) => {
  try {
    const response = await tradeCoinModal.find({
      Exchange: { $in: req.body.coinList },
    });
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
