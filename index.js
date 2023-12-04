const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./routes");
const tradeSocketManager = require("./BootstrapServices/tradeSocketManager");
const http = require("http"); // Import the http module
const tradeCoinSocket = require("./customSocketio/tradeCoinSocket");
const mongoose = require("mongoose");
const { database } = require("./config/keys");
const cors = require("cors");
const path = require("path");

// Enable CORS for all routes
app.use(cors());

// Parse JSON and url-encoded data
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Setup routes and logging
app.use(routes);
app.use(morgan("combined"));

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server using the HTTP server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Set up a connection event custom socket
tradeCoinSocket(io);

// Configure MongoDB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`${"✓"} ${"MongoDB Connected!"}`))
  .then(() => {
    // third part data --------------------------------------

    // ------------------------------------------------------

    // Start the Socket.IO server and other services
    tradeSocketManager();

    // Set up the server to listen on the specified port
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, "0.0.0.0", () =>
      console.log(`Server Started on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
