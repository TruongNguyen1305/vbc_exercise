import express, { Router } from 'express';
import * as catController from '../controllers/category';
import { verifyAdmin, verifyToken, validate_create_cat } from '../middlewares';
const router: Router = express.Router();

router.get('/', catController.getAllCategories);
router.post('/', verifyToken, verifyAdmin, validate_create_cat, catController.createCategory);
router.get('/:id', catController.getCategory);
router.put('/:id',verifyToken, verifyAdmin, validate_create_cat, catController.updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, catController.removeCategory);

export default router; 