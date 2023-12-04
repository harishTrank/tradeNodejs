const tradeCoinModal = require("../models/tradeCoin.model");
const { miniList } = require("../Extra/MiniList");

const coinTypeWithLength = async (req, res) => {
  try {
    const miniCount = await tradeCoinModal.countDocuments({
      InstrumentIdentifier: { $in: miniList },
      Exchange: "MCX",
    });

    const ecxCount = await tradeCoinModal.countDocuments({
      InstrumentIdentifier: { $nin: miniList },
      Exchange: "MCX",
    });

    const nseCound = await tradeCoinModal.countDocuments({
      Exchange: "NSE",
    });

    const allCount = await tradeCoinModal.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Data found successfully.",
      allCount,
      coins: [
        { name: "MCX", coinCount: ecxCount },
        { name: "NSE", coinCount: nseCound },
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
