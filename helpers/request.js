var pagination = require('./pagination');
var sorting = require('./sorting');

exports.getRequestOptions = function(req) {
  const paginationOptions = pagination.getPaginationOptions(req);
  const sortOptions = sorting.getSortingOptions(req);

  return Object.assign({}, paginationOptions, sortOptions);
};

exports.getFilteringOptions = function(req, parameters) {
  var options = {};

  parameters.forEach(function(param) {
    if (req.query[param] !== undefined) {
      options[param] = req.query[param];
    }
  });

  return options;
};
