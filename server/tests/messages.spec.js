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
      sender = senderContact.dataValues;

      db.Contact.create({
        name: 'new tester',
        phoneNum: '09902827265'
      })
      .then((receiverContact) => {
        receiver = receiverContact.dataValues;

        db.Message.create({
          content: 'test message',
          senderId: sender.id,
          receiverId: receiver.id
        })
        .then((firstSms) => {
          message1 = firstSms.dataValues;

          db.Message.create({
            content: 'other test',
            senderId: sender.id,
            receiverId: receiver.id
          })
          .then((secondSms) => {
            message2 = secondSms.dataValues;
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
});
