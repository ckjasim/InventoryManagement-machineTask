import { Router } from "express";
import { param, body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/current-user";
import { customerOrder, deleteSalesReport, editSales, placeOrder, saleCount } from "../controller/salesController";

const router = Router();

 router.delete('/api/sales/:saleId',[
    param('saleId').isMongoId().withMessage('sales is required as param')
 ],validateRequest,requireAuth,currentUser, deleteSalesReport);

router.put('/api/sales/:customerId/:itemId/:saleId', [
    param('customerId').isMongoId().withMessage('customerId is required'),
    param('itemId').isMongoId().withMessage('custoemrId is required'),
    param('saleId').isMongoId().withMessage('saleId is required')
], validateRequest, requireAuth, currentUser, editSales);

router.get('/api/sales/salesreport',requireAuth,currentUser, customerOrder);

router.post('/api/sales/placeorder/:customerId/:itemId',[
    param('itemId').trim().notEmpty().withMessage('itmeId is required'),
    body('stock').trim().isNumeric().withMessage('Stock must be a number'),
    body('price').trim().isNumeric().withMessage('Price must be a number'),
    body('totalPrice').trim().isNumeric().withMessage('total Price is required'),
    param('customerId').trim().notEmpty().withMessage('customerId be required'),
],validateRequest,requireAuth,currentUser, placeOrder);

router.get('/api/sale/saleCount/:customerId',[
    param('customerId').isMongoId().withMessage('customerId is required')
],requireAuth,currentUser, saleCount);

export { router as salesRouter };