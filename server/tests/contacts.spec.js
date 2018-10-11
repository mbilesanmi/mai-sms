import request from 'supertest';
import chai from 'chai';
import app from '../../index';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let testContact;

describe('CONTACT API', () => {
  before(done => {
    db.Contact.create({
      name: 'Mai Mai',
      phoneNum: '090876754365'
    })
    .then((contact) => {
      testContact = contact.dataValues;
      done();
    });
  });

  after(done => {
    db.Contact.destroy({ where: {} })
    .then(done());
  });

  describe('CREATE Contact POST /contacts', () => {
    it('it should create a new contact when data is valid', done => {
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

    it('it should not create a contact with the same phone number', done => {
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

  describe('GET Contact GET /contacts/contactId', () => {
    it('it should get a contact when it exists', done => {
      superRequest.get(`/contacts/${testContact.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.contact.name).to.equal('Mai Mai');
          expect(res.body.contact.phoneNum).to.equal('090876754365');
          done();
        });
    });

    it('it should not get a contact if it does not exist', done => {
      superRequest.get('/contacts/99999999999')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Contact not found');
          done();
        });
    });

    it('it should not get a contact if contactId is invalid', done => {
      superRequest.get('/contacts/hghjg')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid contact id');
          done();
        });
    });
  });

  describe('GET all Contacts GET /contacts', () => {
    it('it should get all contacts successfully', (done) => {
      superRequest.get('/contacts')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.contacts.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  describe('UPDATE Contacts PUT /contacts', () => {
    it('it should update a single contact', done => {
      superRequest.put(`/contacts/${testContact.id}`)
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'testing',
          phoneNum: '01234567980'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.contact.name).to.equal('testing');
          expect(res.body.contact.phoneNum).to.equal('01234567980');
          done();
        });
    });

    it('it should fail for a contact that doesnt exist', done => {
      superRequest.put('/contacts/1212121212121')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'testing',
          phoneNum: '01234567980'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Contact not found');
          done();
        });
    });
  });

  describe('DELETE Contacts DELETE /contacts', () => {

    it('it should delete a contact successfully', done => {
      superRequest.delete(`/contacts/${testContact.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Contact deleted');
          done();
        });
    });

    it('it should fail for Invalid contact', done => {
      superRequest.delete('/contacts/ssdhnaf')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('Invalid contact id.');
          done();
        });
    });

    it('it should fail contact is not found', done => {
      superRequest.delete('/contacts/1291021902')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to
            .equal('Contact not found');
          done();
        });
    });
  });

});
