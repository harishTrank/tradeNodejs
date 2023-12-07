require("dotenv").config();

const configVal = {
  database: process.env.DB_CONNECT,
  tradeApiKey: process.env.TRADE_API_KEY,
  webSocketURL: process.env.WEBSOCKET_URL,
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenLife: process.env.ACCESS_TOKEN_LIFE,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
  },
};

module.exports = configVal;
