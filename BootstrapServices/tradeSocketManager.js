// const { tradeApiKey, webSocketURL } = require("../config/keys");
const tradeCoinModal = require("../models/tradeCoin.model");
const pendingOrderManager = require("../Services/pendingOrderManager");
const WebSocket = require("ws");
const nseList = require("../Extra/NSEList");
const client = require("../Services/redisClient");

const staticCoins = {
  mcx: [
    "CRUDEOIL",
    "CRUDEOILM",
    "ALUMINI",
    "ALUMINIUM",
    "COPPER",
    "COPPERM",
    "GOLD",
    "GOLDM",
    "LEAD",
    "LEADMINI",
    "NATURALGAS",
    "NATGASMINI",
    "SILVER",
    "SILVERM",
    "SILVERMIC",
    "ZINC",
    "ZINCMINI",
  ],
};
const tradeSocketManager = () => {
  const ws = new WebSocket("ws://nimblewebstream.lisuns.com:4575/");
  const authorization = {
    MessageType: "Authenticate",
    Password: "3df99b22-c498-4aec-b661-21d935b1a07c",
  };

  ws.on("open", () => {
    console.log("Connected to the WebSocket server");
    ws.send(JSON.stringify(authorization));
  });

  try {
    ws.on("message", async (data) => {
      const receivedData = JSON.parse(data);
      if (receivedData?.Complete) {
        staticCoins.mcx.map((item) => {
          ws.send(
            JSON.stringify({
              MessageType: "GetInstruments",
              Exchange: "MCX",
              InstrumentType: "FUTCOM",
              Product: item,
            })
          );
        });

        nseList.map((objIdentifier) => {
          ws.send(
            JSON.stringify({
              MessageType: "SubscribeRealtime",
              Exchange: "NSE",
              InstrumentIdentifier: objIdentifier,
            })
          );
        });
      }

      if (receivedData?.Result && receivedData?.Result.length > 0) {
        receivedData?.Result?.slice(0, 2)?.map((itemObj) => {
          itemObj &&
            ws.send(
              JSON.stringify({
                MessageType: "SubscribeRealtime",
                Exchange: "MCX",
                InstrumentIdentifier: itemObj.Identifier,
              })
            );
        });
      }
      if (receivedData?.MessageType === "RealtimeResult") {
        const tradeCoinList = JSON.parse(await client?.get("tradeCoinList"));
        console.log("tradeCoinList.length", tradeCoinList?.length);
        await client.set(
          "tradeCoinList",
          JSON.stringify([
            ...tradeCoinList?.filter(
              (filterItem) =>
                filterItem?.InstrumentIdentifier !==
                receivedData?.InstrumentIdentifier
            ),
            {
              ...receivedData,
              ...{
                buyColor:
                  tradeCoinList?.find(
                    (findItem) =>
                      findItem?.InstrumentIdentifier ===
                      receivedData?.InstrumentIdentifier
                  )?.BuyPrice < receivedData?.BuyPrice
                    ? "rgba(0, 255, 0, 0.4)"
                    : "rgba(256, 0,0, 0.4)",
              },
              ...{
                sellColor:
                  tradeCoinList?.find(
                    (findItem) =>
                      findItem?.InstrumentIdentifier ===
                      receivedData?.InstrumentIdentifier
                  )?.SellPrice < receivedData?.SellPrice
                    ? "rgba(0, 255, 0, 0.4)"
                    : "rgba(256, 0,0, 0.4)",
              },
            },
          ])
        );
      }
    });
  } catch (error) {
    console.log("error In Socket case", error);
    setTimeout(() => tradeSocketManager(), 1000);
  }

  ws.on("close", () => {
    console.log("Connection closed");
    setTimeout(() => tradeSocketManager(), 1000);
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
    setTimeout(() => tradeSocketManager(), 1000);
  });
};

module.exports = tradeSocketManager;
