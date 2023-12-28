const axios = require("axios");
const { pool, url } = require("../Services/pendingOrderManager");
const tradeCoinModal = require("../models/tradeCoin.model");

const squareOffApiManager = async (req, res) => {
  const client = await pool.connect();
  try {
    const { coinType } = req.query;
    const sqlQuery = `SELECT id FROM "App_myuser" where margin_sq=TRUE and status=True`;
    const users = await client.query(sqlQuery);
    users?.rows?.map(async (userId) => {
      const positionQuery = `SELECT 
            identifer,
            coin_name,
            SUM(quantity) AS total_quantity,
            AVG(CASE WHEN quantity > 0 THEN price ELSE NULL END) AS avg_buy_price,
            AVG(CASE WHEN quantity < 0 THEN price ELSE NULL END) AS avg_sell_price
            FROM "App_buyandsellmodel"
            WHERE 
            buy_sell_user_id = '${userId?.id}'
            AND trade_status = TRUE
            AND is_pending = FALSE
            AND is_cancel = FALSE
            AND ex_change ${coinType === "NSE" ? "=" : "!="} 'NSE'
            GROUP BY 
        identifer, coin_name`;
      const userPositionResult = await client.query(positionQuery);

      userPositionResult?.rows?.map(async (position) => {
        const currentLiveData = await tradeCoinModal.findOne({
          InstrumentIdentifier: position.identifer,
        });
        await axios.post(url, {
          userId: userId?.id,
          identifer: position?.identifer,
          trade_type: "Market",
          coin_name: position?.coin_name,
          ex_change: currentLiveData?.Exchange,
          action: Number(position?.total_quantity) < 0 ? "BUY" : "SELL",
          quantity: Number(position?.total_quantity),
          price:
            Number(position?.total_quantity) > 0
              ? currentLiveData.SellPrice
              : currentLiveData.BuyPrice,
          is_pending: false,
          ip_address: "square off",
          order_method: "square off",
          lot_size: currentLiveData.QuotationLot,
          sl_flag: false,
          stop_loss: 0,
          is_cancel: false,
          type: "WEB",
        });
      });
    });
    res.status(200).json({
      success: true,
      message: "Operation complete.",
    });
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  } finally {
    client.release();
  }
};

module.exports = squareOffApiManager;
