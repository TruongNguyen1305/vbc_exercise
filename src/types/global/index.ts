import { Request } from "express";
import { JwtPayload } from "../dto/auth";

export interface RequestWithAuthInfo extends Request {
  user?: JwtPayload
} 