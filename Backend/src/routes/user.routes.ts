import express from "express";
import { handleUserLogin, handleUserRegister, handleUserLogout, handleUserDetails } from "../controllers/user.controllers";
import { restrictUserLogin } from "../middlewares/auth.middlewares";
const router = express.Router();

router.post('/login', handleUserLogin);
router.post('/register', handleUserRegister);
router.get('/logout', handleUserLogout);
router.get('/details', restrictUserLogin,handleUserDetails);

export default router;