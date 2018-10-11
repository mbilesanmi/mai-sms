const contactsController = require('../controllers/contacts');

module.exports = app => {
  app.route('/contacts')
    .post(contactsController.create)
}