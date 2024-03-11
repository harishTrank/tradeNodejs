require("dotenv").config();

module.exports = {
  database:
    "mongodb+srv://harish1903:UjvIbp3lTr9lJcv1@cluster0.9dc4cqz.mongodb.net/",
  tradeApiKey: "3df99b22-c498-4aec-b661-21d935b1a07c",
  webSocketURL: "ws://nimblewebstream.lisuns.com:4575/",
  jwt: {
    accessSecret: "3s6v9y$B&E)H@McQfThWmZq4t7w!z%C*",
    accessTokenLife: "180d",
    refreshSecret: "RgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6",
    refreshTokenLife: "365d",
  },
};
