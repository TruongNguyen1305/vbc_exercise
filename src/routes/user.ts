import express, { Router } from 'express';
import * as userController from '../controllers/user';
import { verifyToken } from '../middlewares';
const router: Router = express.Router();

router.get('/', verifyToken, userController.getAllUsers);

export default router; 