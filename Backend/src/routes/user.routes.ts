import express from "express";
import { Request, Response } from "express";
import { handleUserLogin, handleUserRegister, handleChangeUserDetails, handleUserLogout, handleUserDetails } from "../controllers/user.controllers";
import { restrictUserLogin } from "../middlewares/auth.middlewares";
const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
    res.status(200).send("Hello, I'm running")
});
router.get('/logout', handleUserLogout);
router.get('/details', restrictUserLogin, handleUserDetails);

router.post('/login', handleUserLogin);
router.post('/register', handleUserRegister);

router.put('/', restrictUserLogin, handleChangeUserDetails);


export default router;