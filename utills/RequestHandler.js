const createErrorLogPayload = require("./Utils");

class RequestHandler {
  sendError(req, res, error) {
    const errorPayload = createErrorLogPayload(req, error);
    if (error?.status !== 401) {
      console.log(error.message, "cloudwatch", errorPayload);
    }
    return res.status(error.status || 500).json({
      type: "error",
      message: error.message || "Unhandled Error",
      error,
    });
  }

  sendSuccess(req, res, message, data) {
    return res.status(200).json({
      type: "success",
      message: message || "Success Result",
      data: data,
    });
  }
}

module.exports = RequestHandler;
