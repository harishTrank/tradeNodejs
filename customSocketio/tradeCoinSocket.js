const tradeCoinModal = require("../models/tradeCoin.model");

const socketTestCase = (io) => {
  const userIntervals = {
    allData: {},
    filterData: {},
    oneData: {},
  };

  io.on("connection", async (socket) => {
    socket.on("tradeCoin", () => {
      const allDataInterval = setInterval(async () => {
        io.to(socket.id).emit("tradeCoin data", await tradeCoinModal.find({}));
      }, 500);
      userIntervals.allData[socket.id] = allDataInterval;
    });

    socket.on("filterDataGet", async (data) => {
      if (userIntervals.filterData[socket.id]) {
        clearInterval(userIntervals.filterData[socket.id]);
      }

      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "filterDataSend",
          await tradeCoinModal.find({
            InstrumentIdentifier: { $in: data.identifier },
          })
        );
        lengthCase = data.length;
      }, 500);
      userIntervals.filterData[socket.id] = filterDataInterval;

      socket.on("filterDataOff", () => {
        clearInterval(userIntervals.filterData[socket.id]);
        delete userIntervals.filterData[socket.id];
      });
    });

    socket.on("getOneData", async (data) => {
      if (userIntervals.oneData[socket.id]) {
        clearInterval(userIntervals.oneData[socket.id]);
      }

      const oneDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "getOneDataSend",
          await tradeCoinModal.findOne({
            InstrumentIdentifier: data.identifier,
          })
        );
      }, 500);
      userIntervals.oneData[socket.id] = oneDataInterval;

      socket.on("getOneDataOff", () => {
        clearInterval(userIntervals.oneData[socket.id]);
        delete userIntervals.oneData[socket.id];
      });
    });

    socket.on("getGoldData", async (data) => {
      if (userIntervals.oneData[socket.id]) {
        clearInterval(userIntervals.oneData[socket.id]);
      }

      const oneDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "getGoldDataSend",
          await tradeCoinModal.find({
            InstrumentIdentifier: { $regex: `/${data.value}/i` },
            Exchange: "MCX",
          })
        );
      }, 500);
      userIntervals.oneData[socket.id] = oneDataInterval;

      socket.on("getGoldDataOff", () => {
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
