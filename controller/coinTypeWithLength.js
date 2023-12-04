const tradeCoinModal = require("../models/tradeCoin.model");
const { miniList } = require("../Extra/MiniList");

const coinTypeWithLength = async (req, res) => {
  try {
    const miniCount = await tradeCoinModal
      .find({
        InstrumentIdentifier: { $in: miniList },
        Exchange: "MCX",
      })
      .count();

    const ecxCount = await tradeCoinModal
      .find({
        InstrumentIdentifier: { $nin: miniList },
        Exchange: "MCX",
      })
      .count();

    const allCount = await tradeCoinModal.find().count();

    return res.status(200).json({
      success: true,
      message: "Data found successfully.",
      allCount,
      coins: [
        { name: "MCX", coinCount: ecxCount },
        { name: "MINI", coinCount: miniCount },
      ],
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
