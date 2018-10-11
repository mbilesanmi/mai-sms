const contactsController = require('../controllers/contacts');
const messagesController = require('../controllers/messages');

module.exports = app => {
  app.route('/contacts')
    .get(contactsController.getAll)
    .post(contactsController.create)

  app.route('/contacts/:contactId')
    .get(contactsController.getOne)
    .put(contactsController.update)
    .delete(contactsController.delete)

  app.route('/sms/:senderId/:receiverId')
    .post(messagesController.create);

  app.route('/sms/:userId')
    .get(messagesController.getAll)
}
