const tradeCoinModal = require("../models/tradeCoin.model");

const coinTypeWithLength = async (req, res) => {
  try {
    const listFixed = [
      /ZINCMINI/,
      /SILVERM/,
      /NATGASMINI/,
      /LEADMINI/,
      /GOLDM/,
      /COPPERM/,
      /ALUMINIUM/,
      /CRUDEOILM/,
    ];
    const miniCount = await tradeCoinModal
      .find({
        InstrumentIdentifier: { $in: listFixed },
      })
      .count();

    const ecxCount = await tradeCoinModal
      .find({
        InstrumentIdentifier: { $nin: listFixed },
        Exchange: "MCX",
      })
      .count();

    return res.status(200).json({
      success: true,
      message: "Data found successfully.",
      miniCount,
      ecxCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = coinTypeWithLength;
