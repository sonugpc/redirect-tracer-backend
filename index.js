const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./models");
const app = express();
app.use(cors());
app.use(express.json());
initializeDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server listening on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Unable to Connect DB");
    console.log(err);
  });

process.on("SIGINT", () => {
  console.log("stopping the server", "info");
  process.exit();
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM Received, exiting...", "info");
  process.exit(0);
});

app.use(require("./routes"));
