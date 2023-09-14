import chai from "chai";
import chaiHttp from "chai-http";

process.env.NODE_ENV = 'test';

import { User, Group, Product, Category } from "../src/models";

chai.use(chaiHttp);
// const {assert, expect} = chai;
require('chai').should()
// var foo = 'bar', beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

// assert.typeOf(foo, 'string'); // without optional message
// assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
// assert.equal(foo, 'bar', 'foo equal `bar`');
// assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
// assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');

// expect(foo).to.be.a('string');
// expect(foo).to.equal('bar');
// expect(foo).to.have.lengthOf(3);
// expect(beverages).to.have.property('tea').with.lengthOf(3);

// foo.should.be.a('string');
// foo.should.equal('bar');
// foo.should.have.lengthOf(3);
// beverages.should.have.property('tea').with.lengthOf(3);
const convertToIdList = (entities: any) => {
    let result = entities.map((entity: any) => entity.id);
    return result.slice(Math.floor(Math.random() * result.length));
}

describe('Orders', () => {
    const apiUrl = 'http://localhost:3333/api';
    let accessToken: string;

    const orderData: any = {
        "totalCost": 30500000,
        "items": [
            {
                "productId": 1,
                "quantity": 1
            },
            {
                "productId": 4,
                "quantity": 1
            }
        ]
    }

    before((done) => {
        chai.request(apiUrl).post('/auth/login').send({
                username: 'truong',
                password: '123456'
            }).end((err, res) => {
                accessToken = res.body.accessToken;
                done()
            })
    });

    it('GET voucher for order', (done) => {
        chai.request(apiUrl).post('/orders/get-vouchers').auth(accessToken, {type: 'bearer'}).send(orderData).end(
            (err, res) => {
                res.should.status(200);
                res.body.should.have.property('vouchersForOrder');
                res.body.vouchersForOrder.should.be.an('array');
                res.body.should.have.property('vouchersForOrderDetails');
                res.body.vouchersForOrderDetails.should.be.an('array');
                done()
            }
        );
    });


    it('CREATE voucher for order', (done) => {
        chai.request(apiUrl).post('/orders/').auth(accessToken, {type: 'bearer'}).send(orderData).end(
            (err, res) => {
                res.should.status(201);
                res.body.should.have.property('status').with.equal('pending');
                done()
            }
        );
    }); 
});