const tradeCoinModal = require("../../models/tradeCoin.model");

const weeklyAdminManager = async (req, res) => {
  let { identifiers } = req.query;
  identifiers = JSON.parse(identifiers.replaceAll(`'`, `"`));
  try {
    const response = await tradeCoinModal
      .find({
        InstrumentIdentifier: {
          $in: identifiers,
        },
      })
      .select("BuyPrice SellPrice InstrumentIdentifier");
    return res.status(200).json({
      status: true,
      message: "Data getting successfully.",
      response,
    });
  } catch (e) {
    console.log("e", e);
    return res.status(404).json({
      status: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = weeklyAdminManager;
