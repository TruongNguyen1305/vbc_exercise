import { v4 as uuidv4 } from 'uuid';
import scheduler from 'node-schedule';
import { User, Voucher } from "../models";
import { deleteEntryById } from "../repositories/crud";
import { CreateVoucherDto, JwtPayload, OrderItemWithTotalDto, UpdateVoucherDto } from "../types";
import { sequelize } from "../config";
import { Op, Transaction } from 'sequelize';
import { redis } from '../config';

async function getAllVouchers() {
    const vouchers: Voucher[] = await Voucher.findAll();
    return vouchers;
}

async function getVoucher(id: number) {
    const voucher: any = await Voucher.findByPk(id);

    if(!voucher) throw new Error(`Id not found`);
    let voucherApplyFor;
    switch(voucher.applyFor) {
        case 'users':
            voucherApplyFor = await voucher.getUsers({attributes: ['id', 'username'], joinTableAttributes: []});
            break;
        case 'groups':
            voucherApplyFor = await voucher.getGroups({attributes: ['id', 'name'], joinTableAttributes: []});
            break;
        case 'products':
            voucherApplyFor = await voucher.getProducts({attributes: ['id', 'name', 'price'], joinTableAttributes: []});
            break;
        case 'categories':
            voucherApplyFor = await voucher.getCategories({attributes: ['id', 'name'], joinTableAttributes: []});
    }
    return {
        [voucher.applyFor]: voucherApplyFor,
        ...voucher.dataValues
    };
}

async function createVoucher(dto: CreateVoucherDto) {
    const result = await sequelize.transaction(async (t) => {
        const {appliedIds, ...instance}  = dto;

        if(dto.type === 'value' && dto.maxValue)
            throw new Error("Don't need to provide maxValue if voucher type is 'value'");

        if(dto.applyFor !== 'all' && (!appliedIds || appliedIds.length === 0)) 
            throw new Error('appliedIds is required');

        const newVoucher: any = await Voucher.create({
            ...instance,
            code: uuidv4()
        }, {transaction: t});

        switch(dto.applyFor) {
            case 'users':
                await newVoucher.setUsers(dto.appliedIds, {transaction: t});
                break;
            case 'groups':
                await newVoucher.setGroups(dto.appliedIds, {transaction: t});
                break;
            case 'products':
                await newVoucher.setProducts(dto.appliedIds, {transaction: t});
                break;
            case 'categories':
                await newVoucher.setCategories(dto.appliedIds, {transaction: t});
        }

        await redis.set(newVoucher.id.toString(), newVoucher.quantity);

        return newVoucher;
    });

    scheduler.scheduleJob(result.id + '-start', result.startDate, async ()=>{
        await result.update({status: 'in-term'});
        console.log(`Voucher ${result.id} released`);
    });

    scheduler.scheduleJob(result.id + '-end', result.endDate, async ()=>{
        await result.update({status: 'expired'});
        console.log(`Voucher ${result.id} expired`);
    });

    return result;
}

async function updateVoucher(voucherId: number, dto: UpdateVoucherDto) {
    
    const result = await sequelize.transaction(async (t) => {
        
        const voucher: any = await Voucher.findByPk(voucherId, {transaction: t, lock: true});
        
        if(!voucher) throw new Error(`Voucher ${voucherId} not found`);

        if(voucher.status !== 'created') throw new Error('Cannot update voucher which was released');
        
        const {appliedIds, ...instance}  = dto;

        if(dto.applyFor) {
            if(dto.applyFor === 'all') {
                if(appliedIds && appliedIds.length > 0) {
                    throw new Error("You don't need to pass appliedIds when applyFor is 'all'");
                }
            }
            else{
                if(!appliedIds || appliedIds.length === 0) {
                    throw new Error('appliedIds is required');
                }
            }
        }

        switch(dto.applyFor === 'all' ? voucher.applyFor : dto.applyFor) {
            case 'users':
                await voucher.setUsers(appliedIds || [], {transaction: t});
                break;
            case 'groups':
                await voucher.setGroups(appliedIds || [], {transaction: t});
                break;
            case 'products':
                await voucher.setProducts(appliedIds || [], {transaction: t});
                break;
            case 'categories':
                await voucher.setCategories(appliedIds || [], {transaction: t});
        }

        await voucher.update(instance, {transaction: t});

        return voucher;
    });

    if(dto.startDate){
        scheduler.scheduledJobs[result.id + '-start'].cancel();
        scheduler.scheduleJob(result.id + '-start', result.startDate, async ()=>{
            await result.update({status: 'in-term'});
            console.log(`Voucher ${result.id} released`);
        });
    }
    if(dto.endDate){
        scheduler.scheduledJobs[result.id + '-end'].cancel();
        scheduler.scheduleJob(result.id + '-end', result.endDate, async ()=>{
            await result.update({status: 'expired'});
            console.log(`Voucher ${result.id} expired`);
        });
    }

    return result;
}

async function removeVoucher(id: number) {
    const deletedVoucher = await deleteEntryById(Voucher, id);
    scheduler.scheduledJobs[deletedVoucher.id + '-start'].cancel();
    scheduler.scheduledJobs[deletedVoucher.id + '-end'].cancel();
    return deletedVoucher;
}

async function getVoucherForUser(userData: JwtPayload, totalCost: number, getList: boolean = true, t: Transaction | null = null) {
    const user: any = await User.findByPk(userData.id);
    const voucherData: any = {};
    const query: any = {
        where: {
            lowerBoundDeal: {
                [Op.lte]: totalCost
            },
            quantity: {
                [Op.gt]: 0
            }
            //status: 'in-term' //for test
        },
        joinTableAttributes: [],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }

    if(t) {
        query.transaction = t;
        query.lock = true;
    }
    
    const groups = await user.getGroups();

    //voucher apply for all
    const voucherForAll = await Voucher.findAll({
        where: {
            lowerBoundDeal: {
                [Op.lte]: totalCost
            },
            quantity: {
                [Op.gt]: 0
            },
            // status: 'in-term', //for test
            applyFor: 'all',
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        transaction: t,
        lock: true,
    });
    voucherForAll.forEach((voucher: any) => {
        voucherData[voucher.id] = voucher;
    });

    //voucher appply for user
    const vouchersOfUser = await user.getVouchers(query);
    vouchersOfUser.forEach((voucher: any) => {
        voucherData[voucher.id] = voucher;
    });

    //voucher apply for each group
    for(const group of groups) {
        const vouchersOfGroup = await group.getVouchers(query);
        vouchersOfGroup.forEach((voucher: any) => {
            voucherData[voucher.id] = voucher;
        });
    }

    return getList ? Object.values(voucherData) : voucherData;
}

async function getVoucherForOrderDetails(orderDetails: OrderItemWithTotalDto[], getList: boolean = true, t: Transaction | null = null) {
    const voucherData: any = {}; 
    for(const orderDetail of orderDetails) {
        voucherData[orderDetail.productId] = {}
        const query: any = {
            where: {
                lowerBoundDeal: {
                    [Op.lte]: orderDetail.total
                },
                quantity: {
                    [Op.gt]: 0
                }
                // status: 'in-term', //for test
            },
            joinTableAttributes: [],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }

        if(t) {
            query.transaction = t;
            query.lock = true;
        }

        //get voucher for product
        const vouchersOfProduct = await orderDetail.product.getVouchers(query);

        vouchersOfProduct.forEach((voucher: any) => {
            voucherData[orderDetail.product.id][voucher.id] = voucher;
        });

        //get voucher for category
        for(const category of orderDetail.categories) {
            const vouchersOfCategory = await category.getVouchers(query);
            vouchersOfCategory.forEach((voucher: any) => {
                voucherData[orderDetail.product.id][voucher.id] = voucher;
            });
        }
    }

    return getList ? Object.entries(voucherData).map(([productId, vouchers]) => ({
        productId,
        vouchers: Object.values(vouchers as Object)
    })) : voucherData;
}

export {getAllVouchers, getVoucher, createVoucher, updateVoucher, removeVoucher, getVoucherForUser, getVoucherForOrderDetails};