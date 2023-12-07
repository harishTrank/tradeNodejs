const { miniList } = require("../Extra/MiniList");
const client = require("../Services/redisClient");

const allCoinIdentifier = async (req, res) => {
  try {
    const { coinType } = req.query;
    let response;
    const allTradeCoin = JSON.parse(await client.get("tradeCoinList")).sort(
      (a, b) => a?.InstrumentIdentifier?.localeCompare(b?.InstrumentIdentifier)
    );

    if (coinType === "MINI") {
      response = allTradeCoin.filter(
        (item) =>
          miniList.some((pattern) => pattern.test(item.InstrumentIdentifier)) &&
          item.Exchange === "MCX"
      );
    } else if (coinType === "MCX") {
      response = allTradeCoin.filter(
        (item) =>
          !miniList.some((pattern) =>
            pattern.test(item.InstrumentIdentifier)
          ) && item.Exchange === "MCX"
      );
    } else if (coinType === "NSE") {
      response = allTradeCoin.filter((item) => item.Exchange === "NSE");
    } else {
      response = allTradeCoin;
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
