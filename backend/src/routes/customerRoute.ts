import { Router } from "express";
import { param, body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/current-user";
import { editCustomer, createCustomer, deleteCustomer, getAllCustomers } from "../controller/customerController";

const router = Router();

router.patch('/api/customer/:customerId', [
    param('customerId').trim().notEmpty().withMessage('customerId is required')
], validateRequest, requireAuth, currentUser, editCustomer);

router.get('/api/customer/getAll', requireAuth, currentUser, getAllCustomers);

router.post('/api/customer/create', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid')
], validateRequest, requireAuth, currentUser, createCustomer);

router.delete('/api/customer/:customerId', [
    param('customerId').trim().notEmpty().withMessage('customerId is required')
], validateRequest, requireAuth, currentUser, deleteCustomer);

export { router as customerRouter };