const { createClient } = require("redis");

let client;

(async () => {
  client = createClient({
    url: "redis://localhost:6379",
  });
  await client.connect();
})();

module.exports = client;
