const Contact = require('../models').Contact;
const Message = require('../models').Message;

module.exports = {
  create(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: 'Request cannot be empty'
      });
    };

    const { content } = req.body;

    const { receiverId, senderId } = req.params;

    if (isNaN(senderId)) {
      return res.status(400).send({ message: 'Invalid sender ID' });
    }
    if (isNaN(receiverId)) {
      return res.status(400).send({ message: 'Invalid receiver ID' });
    }
    if (senderId === receiverId) return res.status(400).send({ message: 'Sender and receiver cannot be the same' })

    Contact.findById(senderId)
    .then(sender => {
      if (sender) {
        return Contact.findById(receiverId)
        .then(receiver => {
          if (receiver) {
            return Message.create({
              content, senderId, receiverId
            })
            .then(message => res.status(201).send({
              sms: message,
              message: 'Message sent'
            }))
            .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
          }
          return res.status(404).send({ message: 'Receiver not found' });
        });
      }
      return res.status(404).send({ message: 'Sender not found' });
    });
  },

  getAll(req, res) {
    const { userId } = req.params;

    if (isNaN(userId)) return res.status(400).send({ message: 'Invalid user ID' });

    return Contact.findById(userId)
    .then(user => {
      if (!user) return res.status(404).send({ message: 'Contact not found' });

      return Message.findAll({
        where: {
          $or: [{
            senderId: userId
          }, {
            receiverId: userId
          }]
        },
      })
      .then(messages => {
        if (messages) return res.status(200).send({ messages });
      })
      .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
    })
    .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
  }
};
