import sinon from 'sinon';
import chai from 'chai';
import chaiHttp = require('chai-http');
import bcryptjs from 'bcryptjs';

import UserMock from './mock/models/Users.json'
import  User from '../database/models/User'
import { app } from '../app';
import { Response } from 'superagent';


chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  describe('Retorna um erro caso um dos dados não exista', async () => {
    let chaiHttpResponse1: Response;
    let chaiHttpResponse2: Response;
    let chaiHttpResponse3: Response;
    const missingData = {};
    const missingEmail = {
      'password': '123456'
    }
    const missingPassword = {
      'email': 'email@email.com'
    }
    beforeEach(async() => {
      chaiHttpResponse1 = await chai
      .request(app)
      .post('/login')
      .send(missingData);
      chaiHttpResponse2 = await chai
      .request(app)
      .post('/login')
      .send(missingEmail)
      chaiHttpResponse3 = await chai
      .request(app)
      .post('/login')
      .send(missingPassword)
    })
    it('Retorna a mensagem de erro adequada', () => {
      expect(chaiHttpResponse1.body.message).to.equal('All fields must be filled');
      expect(chaiHttpResponse2.body.message).to.equal('All fields must be filled');
      expect(chaiHttpResponse3.body.message).to.equal('All fields must be filled');
    });
    it('Retorna o status 400', () => {
      expect(chaiHttpResponse1.status).to.equal(400);
      expect(chaiHttpResponse2.status).to.equal(400);
      expect(chaiHttpResponse3.status).to.equal(400);
    })
  } )
  describe('Retorna um erro caso o e-mail não exista', () => {
    let chaiHttpResponse: Response;
    const invalidUser =  {
      'email': 'invalidemail@email',
      'password': '123456'
    }
    beforeEach(async () => {
      sinon.stub(User, 'findOne').resolves(undefined)
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(invalidUser)
    });
    afterEach(() => {
      (User.findOne as sinon.SinonStub).restore();
    });
    it('Retorna a mensagem de erro adequada', () => {
      expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password')
    });
    it('Retorna o status 401', () => {
      expect(chaiHttpResponse.status).to.equal(401)
    });
  });
  describe('Retorna um erro caso a senha esteja errada', () => {
    let chaiHttpResponse: Response;
    const invalidPassword = {
      'email': 'admin@admin.com',
      'password': 'senhaerrada'
    };
    beforeEach(async () => {
      sinon.stub(User, 'findOne').resolves(UserMock[0] as User)
      sinon.stub(bcryptjs, 'compare').resolves(false)
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(invalidPassword)
    });
    afterEach(() => {
      (User.findOne as sinon.SinonStub).restore();
      (bcryptjs.compare as sinon.SinonStub).restore();
    });
    it('Retorna a mensagem adequada', () => {
      expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password')
    });
    it('Retorna o status adequado', () => {
      expect(chaiHttpResponse.status).to.equal(401)
    })
  })
});
