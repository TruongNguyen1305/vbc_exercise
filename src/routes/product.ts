import express, { Router } from 'express';
import * as productController from '../controllers/product';
import { verifyAdmin, verifyToken, validate_search_product, validate_create_product, validate_update_product } from '../middlewares';
const router: Router = express.Router();

router.get('/', validate_search_product, productController.getAllProducts);
router.post('/', verifyToken, verifyAdmin, validate_create_product, productController.createProduct);
router.get('/:id', productController.getProduct);
router.put('/:id',verifyToken, verifyAdmin, validate_update_product, productController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productController.removeProduct);

export default router; 