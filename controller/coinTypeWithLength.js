const tradeCoinModal = require("../models/tradeCoin.model");

const coinTypeWithLength = async (req, res) => {
  try {
    const { coinList } = req.query;

    const miniCount = await tradeCoinModal.countDocuments({
      Exchange: "MINI",
    });

    const ecxCount = await tradeCoinModal.countDocuments({
      Exchange: "MCX",
    });

    const nseCound = await tradeCoinModal.countDocuments({
      Exchange: "NSE",
    });

    let allCount = await tradeCoinModal.countDocuments();

    let coins = [
      { name: "MCX", coinCount: ecxCount },
      { name: "NSE", coinCount: nseCound },
      { name: "MINI", coinCount: miniCount },
    ];
    if (coinList && coinList != "[]") {
      coins = coins.filter((item) => JSON.parse(coinList)?.includes(item.name));
      allCount = 0;
      allCount = coins.map((item) => item.coinCount).reduce((a, b) => a + b);
    } else if (coinList && coinList == "[]") {
      allCount = 0;
      coins = [];
    }

    return res.status(200).json({
      success: true,
      message: "Data found successfully.",
      allCount,
      coins,
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
