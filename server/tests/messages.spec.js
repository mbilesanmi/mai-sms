import request from 'supertest';
import chai from 'chai';
import app from '../../index';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let sender;
let receiver;
let message1;
let message2;

describe('SMS API', () => {
  before((done) => {
    db.Contact.create({
      name: 'tester',
      phoneNum: '098384748282'
    })
    .then((senderContact) => {
      sender = senderContact;

      db.Contact.create({
        name: 'new tester',
        phoneNum: '09902827265'
      })
      .then((receiverContact) => {
        receiver = receiverContact;

        db.Message.create({
          content: 'test message',
          senderId: sender.id,
          receiverId: receiver.id
        })
        .then((firstSms) => {
          message1 = firstSms;

          db.Message.create({
            content: 'other test',
            senderId: sender.id,
            receiverId: receiver.id
          })
          .then((secondSms) => {
            message2 = secondSms;
            done();
          });
        });
      });
    });
  });

  after(done => {
    db.Message.destroy({ 
      where: {}
    })
    .then(() => {
      db.Contact.destroy({ where: {} })
      .then(done());
    });
  });


  describe('CREATE Sms POST /sms', () => {
    it('it should send message successfully', (done) => {
      superRequest.post(`/sms/${sender.id}/${receiver.id}`)
        .set({ 'content-type': 'application/json' })
        .send({ content: 'blah blah' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Message sent');
          expect(res.body.sms.content).to.be.equal('blah blah');
          expect(res.body.sms.receiverId).to.be.equal(receiver.id);
          expect(res.body.sms.senderId).to.be.equal(sender.id);
          expect(res.body.sms.status).to.be.equal('sent');
          done();
        });
    });

    it('it should not send sms when senderId/receiverId is invalid', (done) => {
      superRequest.post(`/sms/${sender.id}/asaddsd`)
        .set({ 'content-type': 'application/json' })
        .send({ content: 'blah blah' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid receiver ID');
          done();
        });
    });

    it('it should not send sms when receiver doesnt exist', (done) => {
      superRequest.post(`/sms/${sender.id}/123456789`)
        .set({ 'content-type': 'application/json' })
        .send({ content: 'blah blah' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Receiver not found');
          done();
        });
    });

    it('it should not send sms if recipient and sender are the same', (done) => {
      superRequest.post(`/sms/${sender.id}/${sender.id}`)
        .set({ 'content-type': 'application/json' })
        .send({ content: 'blah blah' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Sender and receiver cannot be the same');
          done();
        });
    });
  });

  describe('GET All Sms GET /api/sms_messages', () => {
    it('it should fail to get all sms for a contact that doesnt exist', done => {
      superRequest.get(`/sms/${sender.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.messages.length).to.be.greaterThan(0);
          done();
        });
    });

    it('it should fail to get all sms for a contact that doesnt exist', done => {
      superRequest.get('/sms/89917009')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Contact not found');
          done();
        });
    });
  
    it('it should fail to get all sms for invalid contact successfully', done => {
      superRequest.get('/sms/ghcfhvghnf')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid user');
          done();
        });
    });
  });

  describe('DELETE Sms DELETE /api/sms', () => {
    it('it should delete sms successfully if contactId is sender', (done) => {
      superRequest.delete(`/sms/${sender.id}/${message1.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          console.log(res.body)
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Message successfully deleted');
          done();
        });
    });

    it('it should not delete sms if contactId is not the sender', (done) => {
      superRequest.delete(`/sms/${receiver.id}/${message2.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You can only delete sent messages');
          done();
        });
    });

    it('it should fail if messageId does not exist', (done) => {
      superRequest.delete(`/sms/${sender.id}/999999`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Message not found');
          done();
        });
    });

    it('it should fail if contactId does not exist', (done) => {
      superRequest.delete(`/sms/999999/${message2.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Contact not found');
          done();
        });
    });
  });
});
