const tradeCoinModal = require("../models/tradeCoin.model");
const client = require("../Services/redisClient");

const socketTestCase = (io) => {
  const userIntervals = {
    allData: {},
    filterData: {},
    oneData: {},
  };

  io.on("connection", async (socket) => {
    socket.on("tradeCoin", () => {
      const allDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "tradeCoin data",
          JSON.parse(await client.get("tradeCoinList"))
        );
      }, 1000);
      userIntervals.allData[socket.id] = allDataInterval;
    });

    socket.on("filterDataGet", async (data) => {
      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "filterDataSend",
          JSON.parse(await client.get("tradeCoinList")).filter((item) =>
            data.identifier.includes(item.InstrumentIdentifier)
          )
        );
        lengthCase = data.length;
      }, 1000);
      userIntervals.filterData[socket.id] = filterDataInterval;

      socket.on("filterDataOff", () => {
        clearInterval(userIntervals.filterData[socket.id]);
        delete userIntervals.filterData[socket.id];
      });
    });

    socket.on("getOneData", async (data) => {
      const oneDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "getOneDataSend",
          JSON.parse(await client.get("tradeCoinList")).find(
            (item) => data.identifier === item.InstrumentIdentifier
          )
        );
      }, 1000);
      userIntervals.oneData[socket.id] = oneDataInterval;

      socket.on("getOneDataOff", () => {
        clearInterval(userIntervals.oneData[socket.id]);
        delete userIntervals.oneData[socket.id];
      });
    });

    socket.on("disconnect", () => {
      clearInterval(userIntervals.allData[socket.id]);
      delete userIntervals.allData[socket.id];

      clearInterval(userIntervals.filterData[socket.id]);
      delete userIntervals.filterData[socket.id];

      clearInterval(userIntervals.oneData[socket.id]);
      delete userIntervals.oneData[socket.id];
    });
  });
};

module.exports = socketTestCase;
