const Contact = require('../models').Contact;
const Message = require('../models').Message;

module.exports = {
  create(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: 'Request cannot be empty'
      });
    };

    const { name, phoneNum } = req.body;

    if(!name || !phoneNum) {
      return res.status(400).send({ message: 'Both Name and Phone number are required.' });
    }
    if (isNaN(phoneNum)) {
      return res.status(400).send({ message: 'Wrong format for Phone number.' });
    }

    Contact.create({
      name: req.body.name,
      phoneNum: req.body.phoneNum
    })
    .then(contact => {
      if (contact) {
        return res.status(201).send({
          data: contact,
          message: 'Added to contacts'
        });
      }
    })
    .catch(e => res.status(400).send({ 'message': e.errors[0].message || e }));
  },

  getOne(req, res) {
    const { contactId } = req.params;

    if (isNaN(contactId)) {
      return res.status(400).send({ message: 'Invalid contact id' });
    }
    
    Contact.findById(parseInt(contactId))
    .then(contact => {
      if (!contact) {
        return res.status(404).send({ 'message': 'Contact not found' });
      }
      return res.status(200).send({ contact });
    })
    .catch(e => res.status(400).send({ 'message': e.errors[0].message || e }));
  },

  getAll(req, res) {
    Contact.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
    })
    .then(contacts => {
      if (contacts.length < 1) {
        return res.status(404).send({ message: 'No contacts found' }); 
      }
      return res.status(200).send({ contacts });
    })
    .catch(e => {
      return res.status(400).json({ 'message': e.errors[0].message || e });
    });
  },
}
