const tradeCoinModal = require("../models/tradeCoin.model");

const allCoinIdentifier = async (req, res) => {
  try {
    const response = await tradeCoinModal.find({});
    // .select("InstrumentIdentifier Exchange");

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
