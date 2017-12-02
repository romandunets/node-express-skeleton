exports.sendCreated = function(res, data) {
  return res.status(201).send(data);
};

exports.sendBadRequest = function(res, message) {
  return res.status(400).send({
    success: false,
    message: message
  });
};

exports.sendUnauthorized = function(res, message) {
  return res.status(401).send({
    success: false,
    message: message
  });
};

exports.sendForbidden = function(res) {
  return res.status(403).send({ 
    success: false,
    message: 'You do not have rights to access this resource.'
  });
};

exports.sendNotFound = function(res) {
  return res.status(404).send({
    success: false,
    message: 'Resource not found.'
  });
};

exports.setHeadersForCORS = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept");
  next();
}
