import { Request, Response, NextFunction } from "express";
import * as catService from "../services/category";
import { AppError } from "../utils";

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const cats =  await catService.getAllCats();
        res.status(200).json(cats);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.InternalServerError(res, error.message));
    }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const cat =  await catService.getCat(parseInt(req.params.id));
        res.status(200).json(cat);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const newCat =  await catService.createCat(req.body.name);
        res.status(201).json(newCat);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.BadRequest(res, error.message));
    }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedCat =  await catService.updateCat(parseInt(req.params.id), req.body.name);
        res.status(200).json(updatedCat);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}

export async function removeCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedCat =  await catService.removeCat(parseInt(req.params.id));
        res.status(200).json(deletedCat);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.BadRequest(res, error.message))
        }
    }
}