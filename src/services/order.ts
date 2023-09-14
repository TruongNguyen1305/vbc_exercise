import { Response } from "express";
import { Product, Order, OrderDetail, User, Voucher } from "../models";
import { getAll, getById } from "../repositories/crud";
import { JwtPayload, OrderItemDto, createOrderDto } from "../types";
import { AppError } from "../utils";
import { redis, sequelize } from "../config";
import { getVoucherForUser, getVoucherForOrderDetails } from "./voucher";

async function getAllOrders() {
    const orders: Order[] = await getAll(Order, {});
    return orders;
}

async function getMyOrders(userId: number) {
    const orders: Order[] = await getAll(Order, {
        where: {
            UserId: userId 
        }
    });
    return orders;
}

async function getOrder(orderId: number, user: JwtPayload) {
    const order: any = await Order.findByPk(orderId, {
        attributes: ['id', 'totalCost', 'status', 'discount'],
        include: [
            {
                model: OrderDetail,
                attributes: ['id', 'quantity', 'total', 'totalAfterApplied'],
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price']
                }]
            },
            {
                model: User,
                attributes: ['id', 'username']
            },
            {
                model: Voucher,
                attributes: ['id', 'name', 'code', 'description'],
            }
        ]
    });

    if(!order) new Error(`Order ${orderId} not found`);
    
    if(!user.isAdmin && order.User.id !== user.id) new Error('You are not allowed to read this order');

    return order;
}

async function createOrder(dto: createOrderDto, user: JwtPayload) {
    try {
        const result = await sequelize.transaction(async (t) => {
            // return newOrder;

            const {totalCost, orderDetailsWithTotal} = await calculateOrder(dto.items);
            let discount = 0;
            const voucherDb: any = {};

            if(dto.voucherIds) {
                const vouchersForUser = await getVoucherForUser(user, totalCost, false, t);
                for(const voucherId of dto.voucherIds){
                    const voucher = vouchersForUser[voucherId]
                    voucherDb[voucherId] = voucher;
                    if(!voucher) 
                        throw new Error(`Voucher ${voucherId} can not applied for this order`);
                    
                    const quantity = await redis.get(voucherId.toString());
                    console.log('quantity: ' + quantity);
                    if(!quantity || parseInt(quantity) < 1) 
                        throw new Error(`Voucher ${voucherId} is out of stock`);
                    
                    const value = voucher.type === 'value' ? voucher.value : (voucher.value * totalCost) / 100;
                    discount += value < voucher.maxValue ? value : voucher.maxValue;
                }
            }

            const vouchersForOrderDetails = await getVoucherForOrderDetails(orderDetailsWithTotal, false, t);
            for(const orderDetail of orderDetailsWithTotal) {
                if(orderDetail.voucherIds){
                    let discountForDetail = 0;
                    for(const voucherId of orderDetail.voucherIds) {
                        const voucher = vouchersForOrderDetails[orderDetail.productId][voucherId];
                        if(voucherDb[voucherId])
                            throw new Error(`Only apply ${voucherId} once on this order`);
                        voucherDb[voucherId] = voucher;
                        if(!voucher) 
                            throw new Error(`Voucher ${voucherId} can not applied for this product ${orderDetail.productId}`);

                        const quantity = await redis.get(voucherId.toString());
                        console.log('quantity: ' + quantity);
                        if(!quantity || parseInt(quantity) < 1) 
                            throw new Error(`Voucher ${voucherId} is out of stock`);
                        

                        let value = voucher.type === 'value' ? voucher.value : (voucher.value * orderDetail.total) / 100;
                        if(value > voucher.maxValue) value = voucher.maxValue;
                        discountForDetail += orderDetail.total < value ? orderDetail.total : value;
                        console.log(voucherId, value)
                    }

                    orderDetail.totalAfterApplied -= discountForDetail;
                    discount += discountForDetail > orderDetail.total ? orderDetail.total : discountForDetail;
                }
            }

            console.log(totalCost - discount)

            if(totalCost - discount !== dto.totalCost) throw new Error('Total cost is not valid');

            let orderDetails: OrderDetail[] = [];
            for(const detail of orderDetailsWithTotal) {            
                const orderDetail: any = await OrderDetail.create({
                    quantity: detail.quantity,
                    total: detail.total,
                    totalAfterApplied: detail.totalAfterApplied,
                }, {transaction: t});

                await detail.product.addOrderDetails(orderDetail, {transaction: t});
                
                orderDetails.push(orderDetail);
            }

            const newOrder: any = await Order.create({
                totalCost: dto.totalCost,
                discount
            }, {transaction: t});

            await newOrder.setOrderDetails(orderDetails, {transaction: t});
            await newOrder.setVouchers(Object.values(voucherDb), {transaction: t});
            await newOrder.setUser(user.id, {transaction: t});

            for(const voucher of Object.values(voucherDb)){
                if(voucher instanceof Voucher) {
                    await voucher.update({
                        quantity: voucher.quantity - 1
                    }, {transaction: t});
                    console.log(voucher.quantity);
                    await redis.set(voucher.id.toString(), voucher.quantity)
                }
            }

            return newOrder;
        });

        return result;
    } catch (error) {
        throw error;
    }
}

async function updateOrder(orderId: number, user: JwtPayload, status: string) {
    const order = await Order.findByPk(orderId);
    if(!order) throw new Error(`Order ${orderId} not found`);
    if(order.status === 'cancelled') throw new Error(`Order ${orderId} has been cancelled`);
    if(!user.isAdmin && user.id !== order.UserId) throw new Error('You are not allowed to update this order');
    if(status !== 'cancelled' && !user.isAdmin)
        throw new Error('You are not allowed to update progress of this order');

    await order.update({status});
}

async function removeOrder(res: Response, orderId: number, user: JwtPayload) {
    try {
        const result = await sequelize.transaction(async (t) => {
            const order: any = await Order.findByPk(orderId)
            if(!order) throw AppError.NotFound(res, `Order ${orderId} not found`);
            if(order.status !== 'pending') throw AppError.BadRequest(res, `Order ${orderId} is ${order.status}`);
            if(!user.isAdmin && order.UserId !== user.id) throw AppError.Forbidden(res, 'You are not allowed to remove this order');
            const vouchers = await order.getVouchers({transaction: t, lock: true});
            for(const voucher of vouchers) {
                await voucher.update({ quantity: voucher.quantity + 1}, {transaction: t})
            }
            await order.destroy({transaction: t});
            return order;
        });
        return result;
    } catch (error) {
        throw error;
    }
    
}

async function getVouchersForOrder(dto: createOrderDto, user: JwtPayload) {
    const {totalCost, orderDetailsWithTotal} = await calculateOrder(dto.items);
    if(totalCost !== dto.totalCost) throw new Error('Total cost is not valid'); 

    const vouchersForUser = await getVoucherForUser(user, totalCost);
    const vouchersForOrderDetails = await getVoucherForOrderDetails(orderDetailsWithTotal);
    
    return {
        vouchersForOrder: vouchersForUser,
        vouchersForOrderDetails
    };
}

async function calculateOrder(orderDetails: OrderItemDto[]) {
    let totalCost = 0;
    let orderDetailsWithTotal = [];
    for(const orderDetail of orderDetails) {
        const product = await getById(Product, orderDetail.productId, ['id', 'price']);
        if(!product) throw new Error(`Product ${orderDetail.productId} not found`);
                
        totalCost += product.price * orderDetail.quantity;
        orderDetailsWithTotal.push({
            productId: orderDetail.productId,
            quantity: orderDetail.quantity,
            voucherIds: orderDetail.voucherIds,
            total: product.price * orderDetail.quantity,
            totalAfterApplied: product.price * orderDetail.quantity,
            product,
            categories: await product.getCategories({attributes: ['id'], joinTableAttributes: []})
        });
    }
    return {totalCost, orderDetailsWithTotal};
}

export {getAllOrders, getMyOrders, getOrder, createOrder, updateOrder, removeOrder, getVouchersForOrder};