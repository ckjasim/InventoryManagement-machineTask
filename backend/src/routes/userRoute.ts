import { Router } from "express";
import { param, body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { requireAuth } from "../middlewares/require-auth";

import { editCustomer, createCustomer, deleteCustomer, getAllCustomers } from "../controller/customerController";
import { signIn, signOut, signUp, sendEmailToUser, currentUserInfo } from "../controller/userController";
import { currentUser } from "../middlewares/current-user";

const router = Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),    
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
],validateRequest, signUp);

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be vaild'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')

], validateRequest, signIn);

router.post('/api/users/signout', signOut);

router.get('/api/users/currentuser',currentUser,requireAuth, currentUserInfo);

router.post('/api/users/sendEmail', currentUser, validateRequest, sendEmailToUser);


export { router as userRouter };