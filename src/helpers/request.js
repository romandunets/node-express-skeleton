const pagination = require('./pagination')
const sorting = require('./sorting')

exports.getRequestOptions = function(req) {
  const paginationOptions = pagination.getPaginationOptions(req);
  const sortOptions = sorting.getSortingOptions(req);

  return Object.assign({}, paginationOptions, sortOptions);
};

exports.getFilteringOptions = function(req, parameters) {
  let options = {};

  parameters.forEach(function(param) {
    if (req.query[param] !== undefined) {
      options[param] = req.query[param];
    }
  });

  return options;
};
