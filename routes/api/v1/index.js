const router = require("express").Router();

router.use("/trace-url", require("./RedirectRouter"));

module.exports = router;
