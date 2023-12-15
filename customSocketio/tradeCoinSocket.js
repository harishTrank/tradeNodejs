const tradeCoinModal = require("../models/tradeCoin.model");

const socketTestCase = (io) => {
  const userIntervals = {
    allData: {},
    filterData: {},
    filterData2: {},
    oneData: {},
  };

  io.on("connection", async (socket) => {
    socket.on("tradeCoin", () => {
      const allDataInterval = setInterval(async () => {
        io.to(socket.id).emit("tradeCoin data", await tradeCoinModal.find({}));
      }, 1000);
      userIntervals.allData[socket.id] = allDataInterval;
    });

    socket.on("filterDataGet", async (data) => {
      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "filterDataSend",
          await tradeCoinModal.find({
            InstrumentIdentifier: { $in: data.identifier },
          })
        );
        lengthCase = data.length;
      }, 1000);
      userIntervals.filterData[socket.id] = filterDataInterval;

      socket.on("filterDataOff", () => {
        clearInterval(userIntervals.filterData[socket.id]);
        delete userIntervals.filterData[socket.id];
      });
    });

    socket.on("filterDataGet2", async (data) => {
      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "filterDataSend2",
          await tradeCoinModal.find({
            InstrumentIdentifier: { $in: data.identifier },
          })
        );
        lengthCase = data.length;
      }, 1000);
      userIntervals.filterData2[socket.id] = filterDataInterval;

      socket.on("filterDataOff2", () => {
        clearInterval(userIntervals.filterData2[socket.id]);
        delete userIntervals.filterData2[socket.id];
      });
    });

    socket.on("getOneData", async (data) => {
      const oneDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "getOneDataSend",
          await tradeCoinModal.findOne({
            InstrumentIdentifier: data.identifier,
          })
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

      clearInterval(userIntervals.filterData2[socket.id]);
      delete userIntervals.filterData2[socket.id];

      clearInterval(userIntervals.oneData[socket.id]);
      delete userIntervals.oneData[socket.id];
    });
  });
};

module.exports = socketTestCase;
