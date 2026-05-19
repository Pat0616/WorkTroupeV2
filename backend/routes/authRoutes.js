import express from 'express'

import{
login,
register,
me
} from '../controllers/authController.js';



const authRouter = express.Router();

authRouter.post('/auth/register',register)
authRouter.post('/auth/login', login)
authRouter.get('/auth/me',me)

export default authRouter;