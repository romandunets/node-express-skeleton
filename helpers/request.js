var pagination = require('./pagination');
var sorting = require('./sorting');

exports.getRequestOptions = function(req) {
  const paginationOptions = pagination.getPaginationOptions(req);
  const sortOptions = sorting.getSortingOptions(req);

  return Object.assign({}, paginationOptions, sortOptions);
};
