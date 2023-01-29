const createErrorLogPayload = (req, error) => {
  const { protocol, hostname, originalUrl } = req;
  return {
    url: `${protocol}://${hostname}${originalUrl}`,
    message: error.message,
    ...{
      ...req.query,
      ...req.body,
      status: error.status || 500,
    },
  };
};

module.exports = createErrorLogPayload;
