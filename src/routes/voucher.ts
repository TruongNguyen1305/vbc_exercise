import express, { Router } from 'express';
import * as voucherController from '../controllers/voucher';
import { verifyAdmin, verifyToken, validate_create_voucher, validate_update_voucher } from '../middlewares';
const router: Router = express.Router();

router.get('/', voucherController.getAllVouchers);
router.post('/', verifyToken, verifyAdmin, validate_create_voucher, voucherController.createVoucher);
router.get('/:id', voucherController.getVoucher);
router.put('/:id',verifyToken, verifyAdmin, validate_update_voucher, voucherController.updateVoucher);
router.delete('/:id', verifyToken, verifyAdmin, voucherController.removeVoucher);

export default router; 