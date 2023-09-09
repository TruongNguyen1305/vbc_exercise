import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order";
import { AppError } from "../utils";
import { RequestWithAuthInfo } from "../types";

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders =  await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.InternalServerError(res, error.message));
    }
}

export async function getMyOrders(req: RequestWithAuthInfo, res: Response, next: NextFunction) {
    try {
        if(req.user){
            const orders =  await orderService.getMyOrders(req.user.id);
            res.status(200).json(orders);
        }
    } catch (error) {
        if(error instanceof Error)
            next(AppError.InternalServerError(res, error.message));
    }
}

export async function getOrder(req: RequestWithAuthInfo, res: Response, next: NextFunction) {
    try {
        if(req.user){
            const order =  await orderService.getOrder(res, parseInt(req.params.id), req.user);
            res.status(200).json(order);
        }
    } catch (error) {
        next(error);
    }
}

export async function getVouchersForOrder(req: RequestWithAuthInfo, res: Response, next: NextFunction) {
    try {
        if(req.user){
            const vouchers =  await orderService.getVouchersForOrder(res, req.body, req.user);
            res.status(200).json(vouchers);
        }
    } catch (error) {
        next(error);
    }
}

export async function createOrder(req: RequestWithAuthInfo, res: Response, next: NextFunction) {
    try {
        if(req.user){
            const newOrder =  await orderService.createOrder(res, req.body, req.user);
            res.status(201).json(newOrder);
        }
    } catch (error) {
        next(error);
    }
}

export async function updateOrder(req: RequestWithAuthInfo, res: Response, next: NextFunction) {
    try {
        if(req.user){
            await orderService.updateOrder(res, parseInt(req.params.id), req.user, req.body);
            res.status(200).json({
                message: 'Product updated successfully'
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function removeOrder(req: RequestWithAuthInfo, res: Response, next: NextFunction) {
    try {
        if(req.user){
            const deletedOrder =  await orderService.removeOrder(res, parseInt(req.params.id), req.user);
            res.status(200).json(deletedOrder);
        }
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.InternalServerError(res, error.message))
        }
    }
}