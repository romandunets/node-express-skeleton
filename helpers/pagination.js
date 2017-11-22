const config = require('config');

exports.getPaginationOptions = function(req, message) {
  const page = (req.query.page !== undefined) ? parseInt(req.query.page) : config.pagination.defaultPage;
  const limit = (req.query.pageSize !== undefined) ? parseInt(req.query.pageSize) : config.pagination.defaultLimit;

  return {
  	page: page,
  	limit: limit
  };
};
