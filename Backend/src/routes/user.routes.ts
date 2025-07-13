import express from "express";
import { handleUserLogin, handleUserRegister, handleChangeUserDetails, handleUserLogout, handleUserDetails } from "../controllers/user.controllers";
import { restrictUserLogin } from "../middlewares/auth.middlewares";
const router = express.Router();

router.get('/logout', handleUserLogout);
router.get('/details', restrictUserLogin,handleUserDetails);

router.post('/login', handleUserLogin);
router.post('/register', handleUserRegister);

router.put('/', restrictUserLogin, handleChangeUserDetails);

export default router;