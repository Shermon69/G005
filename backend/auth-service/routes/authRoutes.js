import express from 'express';
import { registerUser, loginUser, getAllUsers, deleteUser } from '../controllers/authController.js';
import { verifyToken, isAdmin, requireRole } from '../middleware/authMiddleware.js';
import { getPendingRestaurants, verifyRestaurant } from '../controllers/authController.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

//admin only routes
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.delete('/user/:id', verifyToken, isAdmin, deleteUser);
router.get('/restaurants/pending', verifyToken, isAdmin, getPendingRestaurants);
router.patch('/restaurant/:id/verify', verifyToken, isAdmin, verifyRestaurant);

export default router;