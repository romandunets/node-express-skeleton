import mongoose from 'mongoose';
import response from '../helpers/response';
import request from '../helpers/request';
import pagination from '../helpers/pagination';

const Item = mongoose.model('Item');

exports.list = function(req, res) {
  if (!req.currentUser.canRead(req.locals.user)) return response.sendForbidden(res);
  const query = Object.assign({ owner: req.params.userId }, request.getFilteringOptions(req, ['name']));
  Item.paginate(query, request.getRequestOptions(req), function(err, result) {
    if (err) return response.sendNotFound(res);
    pagination.setPaginationHeaders(res, result);
    res.json(result.docs);
  });
};

exports.create = function(req, res) {
    const user = req.locals.user;
    if (!req.currentUser.canEdit(user)) return response.sendForbidden(res);

    const item = new Item(req.body);
    item.owner = user;
    item.save(function(err, item) {
      if (err) return response.sendBadRequest(res, err);

      user.items.push(item);
      user.save(function(err, user) {
        if (err) return response.sendBadRequest(res, err);
        response.sendCreated(res, item);
      });
    });
};

exports.read = function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if (err) return response.sendNotFound(res);
    if (!req.currentUser.canRead(item)) return response.sendForbidden(res);
    res.json(item);
  });
};

exports.update = function(req, res) {
  Item.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, item) {
    if (err) return response.sendBadRequest(res, err);
    if (!req.currentUser.canEdit(item)) return response.sendForbidden(res);
    res.json(item);
  });
};

exports.delete = function(req, res) {
  Item.remove({ _id: req.params.id }, function(err, item) {
    if (err) return response.sendNotFound(res);
    if (!req.currentUser.canEdit(item)) return response.sendForbidden(res);
    res.json({ message: 'Item successfully deleted' });
  });
};
