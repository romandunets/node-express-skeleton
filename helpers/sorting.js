exports.getSortingOptions = function(req) {
  return (req.query.sort !== undefined) ? {
    sort: req.query.sort.replace(',', ' ')
  } : {};
};
