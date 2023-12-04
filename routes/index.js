const router = require("express").Router();
const createError = require("http-errors");
const allCoinIdentifier = require("../controller/allCoinIdentifier");

router.get("/test", (req, res) => {
  res.status(200).json({
    test: "test pass",
  });
});

router.get("/api/tradeCoin", allCoinIdentifier);

router.use("/api", (req, res, next) => {
  next(
    createError.NotFound("The route you are trying to access does not exist.")
  );
});

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

module.exports = router;
