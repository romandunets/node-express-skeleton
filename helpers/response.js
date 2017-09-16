exports.sendForbidden = function(res) {
  return res.status(403).send({ message: 'You do not have rights to access this resource.' });
};
