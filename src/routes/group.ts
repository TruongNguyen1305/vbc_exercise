import express, { Router } from 'express';
import * as groupController from '../controllers/group';
import { 
    verifyAdmin, 
    verifyToken, 
    validate_create_group, 
    validate_update_group, 
    validate_addUserToGroup 
} from '../middlewares';
const router: Router = express.Router();

router.get('/', groupController.getAllGroups);
router.post('/', verifyToken, verifyAdmin, validate_create_group, groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.put('/:id',verifyToken, verifyAdmin, validate_update_group, groupController.updateGroup);
router.delete('/:id', verifyToken, verifyAdmin, groupController.removeGroup);
router.put('/:id/add', verifyToken, verifyAdmin, validate_addUserToGroup, groupController.addUserToGroup);
router.put('/:id/remove', verifyToken, verifyAdmin, validate_addUserToGroup, groupController.removeUserFromGroup);


export default router; 