import chai from "chai";
import chaiHttp from "chai-http";

process.env.NODE_ENV = 'test';

import { User, Group, Product, Category, Voucher } from "../src/models";


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

describe('Vouchers', () => {
    const apiUrl = 'http://localhost:3333/api';

    const baseVoucher: any = {
        "name": "Voucher giảm tiền",
        "description": "Giảm 6% Đơn Tối Thiểu ₫100k tối đa 50k",
        "startDate": new Date(Date.now() + 60 * 60 * 1000),
        "endDate": new Date(Date.now() + 24 * 60 * 60 * 1000),
        "quantity": 1,
        "lowerBoundDeal": 100000,
    }

    before(async() => {
        await Voucher.destroy({where: {}})
    })

    describe('/GET all vouchers', () => {
        it('it should GET all the vouchers', (done) => {
            chai.request(apiUrl).get('/vouchers').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
        });
    });

    describe('/CREATE voucher', () => {
        let accessToken: string;
        const applyFor = ['all', 'users', 'groups', 'products', 'categories']

        before((done) => {
            chai.request(apiUrl).post('/auth/login').send({
                username: 'truong',
                password: '123456'
            }).end((err, res) => {
                accessToken = res.body.accessToken;
                done()
            })
        });

        it('it throw error when create the voucher with type percentage without providing maxValue', (done) => {
            chai.request(apiUrl).post('/vouchers').auth(accessToken, {type: 'bearer'}).send({
                ...baseVoucher,
                type: 'percentage',
                value: 6,
                applyFor: applyFor[0]
            }).end((err, res) => {
                res.should.status(400);
                res.body.should.have.property('message').equal('maxValue is required');
                done()
            })
        });

        it('it throw error when create the voucher with type percentage and value is out of range [1, 100]', 
            (done) => {
                chai.request(apiUrl).post('/vouchers').auth(accessToken, {type: 'bearer'}).send({
                    ...baseVoucher,
                    type: 'percentage',
                    value: Math.floor(Math.random() * 100) + 101,
                    applyFor: applyFor[0]
                }).end((err, res) => {
                    res.should.status(400);
                    res.body.should.have.property('message').includes('must be between 1 and 100');
                    done()
                })
            }
        );

        it('it throw error when create the voucher with type value and provide maxValue', (done) => {
            chai.request(apiUrl).post('/vouchers').auth(accessToken, {type: 'bearer'}).send({
                ...baseVoucher,
                type: 'value',
                value: 50000,
                maxValue: 10000,
                applyFor: applyFor[0]
            }).end((err, res) => {
                res.should.status(400);
                res.body.should.have.property('message').includes("Don't need to provide maxValue");
                done()
            })
        });

        it('it throw error when create the voucher apply for | User | Group | Product | Cat | without providing appliedForIds', 
            (done) => {
                chai.request(apiUrl).post('/vouchers').auth(accessToken, {type: 'bearer'}).send({
                    ...baseVoucher,
                    type: 'percentage',
                    value: 6,
                    maxValue: 50000,
                    applyFor: applyFor.slice(1)[Math.floor(Math.random() * 4)]
                }).end((err, res) => {
                    res.should.status(400);
                    res.body.should.have.property('message').equal("appliedIds is required");
                    done()
                })
            }
        );

        it('it should create the voucher', 
            async () => {
                const applyIdx = Math.floor(Math.random() * 5);
                let appliedIds: number[] = [];
                switch(applyFor[applyIdx]) {
                    case 'users':
                        appliedIds = convertToIdList(await User.findAll({attributes: ['id']}));
                        break;
                    case 'groups':
                        appliedIds = convertToIdList(await Group.findAll({attributes: ['id']}));
                        break;
                    case 'products':
                        appliedIds = convertToIdList(await Product.findAll({attributes: ['id']}));
                        break;
                    case 'categories':
                        appliedIds = convertToIdList(await Category.findAll({attributes: ['id']}));
                        break;
                    default:
                        appliedIds = [];
                }
                
                chai.request(apiUrl).post('/vouchers').auth(accessToken, {type: 'bearer'}).send({
                    ...baseVoucher,
                    type: 'percentage',
                    value: 6,
                    maxValue: 50000,
                    applyFor: applyFor[applyIdx],
                    appliedIds: appliedIds
                }).end((err, res) => {
                    res.should.status(201);
                    res.body.should.have.property('status').equal('created');
                })
            }
        );
    });
});