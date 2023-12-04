const { Pool } = require("pg");
const tradeCoinModal = require("../models/tradeCoin.model");

const pool = new Pool({
  host: "13.127.239.118",
  user: "postgres",
  password: ",sclBQhGIHk3",
  database: "postgres",
  port: 5432,
});

const pendingOrderManager = async (currentData) => {
  const client = await pool.connect();
  try {
    const sqlQuery = `SELECT * FROM "App_buyandsellmodel" where is_pending=true`;
    const result = await client.query(sqlQuery);

    const successIds = result.rows
      .map((row) => {
        const currentLiveData = currentData.find(
          (findItem) => findItem.InstrumentIdentifier === row.identifer
        );
        if (currentLiveData) {
          if (
            (row.action === "BUY" &&
              currentLiveData.BuyPrice >= row.buy_price) ||
            (row.action === "SELL" &&
              currentLiveData.SellPrice <= row.sell_price)
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
  } catch (err) {
    console.error("Error executing query:", err.message);
  } finally {
    client.release();
  }
};

module.exports = pendingOrderManager;
