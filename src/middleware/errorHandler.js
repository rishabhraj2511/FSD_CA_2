function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(error.errors).map((fieldError) => fieldError.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid request value' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
