const RedirectController = require("../../../controllers/RedirectController");

const router = require("express").Router();

router.post("/", RedirectController.traceRedirect);
module.exports = router;
