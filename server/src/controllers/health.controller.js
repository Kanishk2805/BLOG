export const getHealth = (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "screenscope-api",
    timestamp: new Date().toISOString()
  });
};

