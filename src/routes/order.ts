import express, { Router } from 'express';
import * as orderController from '../controllers/order';
import { verifyAdmin, verifyToken, validate_create_order, validate_update_order } from '../middlewares';
const router: Router = express.Router();

router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.get('/me', verifyToken, orderController.getMyOrders);
router.post('/get-vouchers', verifyToken, validate_create_order, orderController.getVouchersForOrder);
router.get('/:id', verifyToken, orderController.getOrder);
router.post('/', verifyToken, validate_create_order, orderController.createOrder);
router.put('/:id', verifyToken, validate_update_order, orderController.updateOrder);
router.delete('/:id', verifyToken, orderController.removeOrder);

export default router; 