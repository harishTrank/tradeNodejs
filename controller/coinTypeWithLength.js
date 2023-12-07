const { miniList } = require("../Extra/MiniList");
const client = require("../Services/redisClient");

const coinTypeWithLength = async (req, res) => {
  try {
    const allTradeCoin = JSON.parse(await client.get("tradeCoinList"));
    const miniCount = allTradeCoin.filter(
      (item) =>
        miniList.some((pattern) => pattern.test(item.InstrumentIdentifier)) &&
        item.Exchange === "MCX"
    ).length;

    const ecxCount = allTradeCoin.filter(
      (item) =>
        !miniList.some((pattern) => pattern.test(item.InstrumentIdentifier)) &&
        item.Exchange === "MCX"
    ).length;

    const nseCound = allTradeCoin.filter(
      (item) => item.Exchange === "NSE"
    ).length;

    const allCount = allTradeCoin.length;

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
