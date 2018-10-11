const contactsController = require('../controllers/contacts');

module.exports = app => {
  app.route('/contacts')
    .post(contactsController.create)

  app.route('/contacts/:contactId')
    .get(contactsController.getOne)
}
