const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
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
