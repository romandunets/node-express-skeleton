exports.sendForbidden = function(res) {
  return res.status(403).send({ 
    success: false,
    message: 'You do not have rights to access this resource.'
  });
};

exports.sendBadRequest = function(res, message) {
  return res.status(400).send({
    success: false,
    message: message
  });
};
