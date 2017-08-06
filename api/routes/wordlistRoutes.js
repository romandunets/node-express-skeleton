'use strict';

module.exports = function(app) {
  var wordlist = require('../controllers/wordlistController');

  app.route('/words')
    .get(wordlist.list_all_words)
    .post(wordlist.create_word);

  app.route('/words/:id')
    .get(wordlist.read_word)
    .put(wordlist.update_word)
    .delete(wordlist.delete_word);
};
