import request from 'supertest';
import chai from 'chai';
import app from '../../index';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let testContact;

describe('CONTACT API', () => {
  before((done) => {
    db.Contact.create({
      name: 'Mai Mai',
      phoneNum: '090876754365'
    })
    .then((contact) => {
      testContact = contact.dataValues;
      done();
    });
  });

  after((done) => {
    db.Contact.destroy({ where: {} })
    .then(done());
  });

  describe('CREATE Contact POST /contacts', () => {

    it('it should create a new contact when data is valid', (done) => {
      superRequest.post('/contacts')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Mai test',
          phoneNum: '04063009409'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to
            .equal('Added to contacts');
          expect(res.body.data.name).to.equal('Mai test');
          expect(res.body.data.phoneNum).to.equal('04063009409');
          done();
        });
    });

    it('it should not create a contact with the same phone number', (done) => {
      superRequest.post('/contacts')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'New test',
          phoneNum: testContact.phoneNum
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('Phone number already exists');
          // expect(res.body.data.type).to.equal('unique violation');
          done();
        });
    });

    it('it should not create a contact with no name or phone number', done => {
      superRequest.post('/contacts')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: '',
          phoneNum: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('Both Name and Phone number are required.');
          done();
        });
    });

    it('it should not create a phoneNumber with invalid type', (done) => {
      superRequest.post('/contacts')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'test user',
          phoneNum: 'sasadas'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('Wrong format for Phone number.');
          done();
        });
    });
  });
});