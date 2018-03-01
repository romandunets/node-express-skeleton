import express from 'express';

import items from '../../controllers/items';
import auth from '../../controllers/auth';

const routes  = express.Router({ mergeParams: true });

routes.use(auth.verifyToken);

routes.route('/')
  .get(items.list)
  .post(items.create);

routes.route('/:id')
  .get(items.read)
  .put(items.update)
  .delete(items.delete);

module.exports = routes;
