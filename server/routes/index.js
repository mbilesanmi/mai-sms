const contactsController = require('../controllers/contacts');

module.exports = app => {
  app.route('/contacts')
    .get(contactsController.getAll)
    .post(contactsController.create)

  app.route('/contacts/:contactId')
    .get(contactsController.getOne)
}
