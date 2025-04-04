import express from 'express';
import {
  getAllUsers,
  registerNewAdmin,
} from '../controllers/userController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/all', isAuthenticated, isAuthorized('Admin'), getAllUsers);
router.post('/add/new-admin', isAuthenticated, isAuthorized('Admin'), registerNewAdmin);
// Add a GET handler for the new-admin route to help users understand it's a POST endpoint
router.get('/add/new-admin', (req, res) => {
  res.status(405).json({
    success: false,
    message: "This endpoint requires a POST request with admin details and avatar"
  });
});

export default router;