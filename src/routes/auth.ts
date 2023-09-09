import express, { Router } from 'express';
import * as authController from '../controllers/auth';
import { validate_login } from '../middlewares';
const router: Router = express.Router();

router.post('/', validate_login, authController.register);
router.post('/login', validate_login, authController.login);
router.get('/token', authController.reGenerateAccessToken);

export default router;