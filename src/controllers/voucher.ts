import { Request, Response, NextFunction } from "express";
import * as voucherService from "../services/voucher";
import { AppError } from "../utils";

export async function getAllVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const vouchers =  await voucherService.getAllVouchers();
        res.status(200).json(vouchers);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.BadRequest(res, error.message));
    }
}

export async function getVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const voucher =  await voucherService.getVoucher(parseInt(req.params.id));
        res.status(200).json(voucher);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.BadRequest(res, error.message));
    }
}

export async function createVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const newVoucher =  await voucherService.createVoucher(req.body);
        res.status(201).json(newVoucher);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.BadRequest(res, error.message));
    }
}

export async function updateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedVoucher =  await voucherService.updateVoucher(parseInt(req.params.id), req.body);
        res.status(200).json(updatedVoucher);
    } catch (error) {
        if(error instanceof Error)
            error.message.includes('not found') ? 
            next(AppError.NotFound(res, error.message)) : 
            next(AppError.BadRequest(res, error.message));
    }
}

export async function removeVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedVoucher =  await voucherService.removeVoucher(parseInt(req.params.id));
        res.status(200).json(deletedVoucher);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}