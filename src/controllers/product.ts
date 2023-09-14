import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product";
import { AppError } from "../utils";

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const {upperBoundPrice, lowerBoundPrice} = req.query;
        if(upperBoundPrice && lowerBoundPrice && upperBoundPrice < lowerBoundPrice){
            return next(AppError.BadRequest(res, "Lower bound price must be less than or equal to upper bound price"));
        }
        const products =  await productService.getAllProducts(req.query);
        res.status(200).json(products);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.InternalServerError(res, error.message));
    }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const data: any =  await productService.getProduct(parseInt(req.params.id));
        res.status(200).json(data);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const newProduct =  await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.BadRequest(res, error.message));
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedProduct =  await productService.updateProduct(parseInt(req.params.id), req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}

export async function removeProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedProduct =  await productService.removeProduct(parseInt(req.params.id));
        res.status(200).json(deletedProduct);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}