const routes = require('express').Router();
const words = require('../controllers/wordlistController');

routes.route('/')
  .get(words.list_all_words)
  .post(words.create_word);

routes.route('/:id')
  .get(words.read_word)
  .put(words.update_word)
  .delete(words.delete_word);

module.exports = routes;
