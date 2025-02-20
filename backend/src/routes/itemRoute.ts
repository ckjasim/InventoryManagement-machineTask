import { Router } from "express";
import { param, body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/current-user";
import { editCustomer, createCustomer, deleteCustomer, getAllCustomers } from "../controller/customerController";
import { createItem, editItem,  getAllItems, getEachItem } from "../controller/itemController";

const router = Router();

router.put('/api/item/:itemId',[
    param('itemId').trim()
    .notEmpty()
    .withMessage('itemId is required')
],validateRequest,requireAuth,currentUser, editItem);

router.get('/api/item/getAll',requireAuth,currentUser, getAllItems);

router.post('/api/item/create',[
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('stock').trim().isNumeric().withMessage('Stock must be a number'),
    body('price').trim().isNumeric().withMessage('Price must be a number'),
  ],validateRequest,requireAuth,currentUser, createItem);

router.get('/api/item/:itemId',[
    param('itemId').trim().notEmpty()
    .withMessage('itemId is required as param')
],validateRequest,requireAuth,currentUser, getEachItem);

export { router as itemRouter };