import { Request, Response, NextFunction } from "express";
import * as groupService from "../services/group";
import { AppError } from "../utils";

export async function getAllGroups(req: Request, res: Response, next: NextFunction) {
    try {
        const groups =  await groupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.InternalServerError(res, error.message));
    }
}

export async function getGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const groups =  await groupService.getGroup(parseInt(req.params.id));
        res.status(200).json(groups);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.InternalServerError(res, error.message))
        }
    }
}

export async function createGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const group =  await groupService.createGroup(req.body);
        res.status(201).json(group);
    } catch (error) {
        if(error instanceof Error)
            next(AppError.InternalServerError(res, error.message));
    }
}

export async function updateGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedGroup =  await groupService.updateGroup(parseInt(req.params.id), req.body);
        res.status(200).json(updatedGroup);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.InternalServerError(res, error.message))
        }
    }
}

export async function removeGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedGroup =  await groupService.removeGroup(parseInt(req.params.id));
        res.status(200).json(deletedGroup);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.InternalServerError(res, error.message))
        }
    }
}

export async function addUserToGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedGroup =  await groupService.addUserToGroup(parseInt(req.params.id), req.body.userIds);
        res.status(200).json(updatedGroup);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.InternalServerError(res, error.message))
        }
    }
}

export async function removeUserFromGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedGroup =  await groupService.removeUserFromGroup(parseInt(req.params.id), req.body.userIds);
        res.status(200).json(updatedGroup);
    } catch (error) {
        if(error instanceof Error) {
            error.message.includes('not found') ? 
                next(AppError.NotFound(res, error.message)) : 
                next(AppError.InternalServerError(res, error.message))
        }
    }
}