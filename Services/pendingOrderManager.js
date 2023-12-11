const { Pool } = require("pg");
const axios = require("axios");

const pool = new Pool({
  host: "13.232.101.55",
  user: "postgres",
  password: ",sclBQhGIHk3",
  database: "postgres",
  port: 5432,
});

const url = "http://13.232.101.55:8000/api/buy-sell-sl/";
const dateManager = (val) => {
  return `${val?.split("_")?.[2]?.slice(0, 2)} ${val
    ?.split("_")?.[2]
    ?.slice(2, 5)} ${val?.split("_")?.[2]?.slice(7)}`;
};

const pendingOrderManager = async (currentData) => {
  const client = await pool.connect();
  try {
    // LIMIT case -----------------
    const sqlQuery = `SELECT * FROM "App_buyandsellmodel" where is_pending=true AND LOWER(identifer)=LOWER('${currentData.InstrumentIdentifier}')`;
    const result = await client.query(sqlQuery);
    if (result.rows && result.rows.length > 0) {
      const successIds = result.rows
        .map((row) => {
          if (currentData) {
            if (
              (row.action === "BUY" && currentData.BuyPrice <= row.price) ||
              (row.action === "SELL" && currentData.SellPrice >= row.price)
            ) {
              return Number(row.id);
            }
          }
        })
        .filter((removeUndefined) => removeUndefined !== undefined);

      if (successIds && successIds.length > 0) {
        const updateQuery = `UPDATE "App_buyandsellmodel" SET is_pending = false WHERE id in (${successIds})`;
        await client.query(updateQuery);
      }
    }
    //  ----------------- ----------------- -----------------

    // SL CASE  ----------------- ----------------- ---------
    const selectSL = `SELECT * FROM "App_buyandsellmodel" where sl_flag = false AND LOWER(identifer)=LOWER('${currentData.InstrumentIdentifier}') AND LOWER(trade_type) = LOWER('SL')`;
    const resultSL = await client.query(selectSL);
    if (resultSL.rows && resultSL.rows.length > 0) {
      resultSL.rows.map(async (mapItem) => {
        if (
          (mapItem.action.toUpperCase() === "BUY" &&
            mapItem.price >= currentData.BuyPrice) ||
          (mapItem.action.toUpperCase() === "SELL" &&
            mapItem.price <= currentData.SellPrice)
        ) {
          await axios.post(url, {
            id: mapItem.buy_sell_user_id,
            identifer: currentData?.InstrumentIdentifier,
            trade_type: "SL",
            coin_name:
              currentData?.Exchange === "NSE"
                ? `NSE ${currentData?.InstrumentIdentifier}`
                : `${currentData?.Exchange || ""} ${
                    currentData?.InstrumentIdentifier?.split("_")?.[1]
                  }, ${dateManager(currentData?.InstrumentIdentifier) || ""}`,
            ex_change: currentData.Exchange,
            action: mapItem.action.toUpperCase() === "SELL" ? "BUY" : "SELL",
            quantity: -mapItem.quantity,
            price:
              mapItem.action.toUpperCase() === "SELL"
                ? currentData.BuyPrice
                : currentData.SellPrice,
            is_pending: false,
            lot_size: currentData.QuotationLot,
            sl_flag: true,
          });
          await client.query(
            `UPDATE "App_buyandsellmodel" SET sl_flag = true WHERE id in (${mapItem.id})`
          );
        }
      });
    }
    //  ----------------- ----------------- -----------------
  } catch (err) {
    console.error("Error executing query:", err.message);
  } finally {
    client.release();
  }
};

module.exports = pendingOrderManager;
