import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { Sales } from "../../models/sales";
import { BadRequestError } from "../../errors/bad-request-error";
import { Item } from "../../models/InventoryItems";

const router = Router()
router.put('/api/sales/:customerId/:itemId/:saleId', [
    param('customerId').isMongoId().withMessage('customerId is required'),
    param('itemId').isMongoId().withMessage('custoemrId is required'),
    param('saleId').isMongoId().withMessage('saleId is required')
], validateRequest, requireAuth, currentUser,
    async (req: Request, res: Response) => {
      
        const { customerId, itemId, saleId } = req.params;
        const { stock, totalPrice } = req.body;
        const sale = await Sales.findById(saleId);
        
        if (!sale) {
            throw new BadRequestError('Sale not found');
        }
        if(sale.itemId==itemId){
            
        }
        const item = await Item.findById(itemId);
        if (!item) {
            throw new BadRequestError('Item not found');
            }
            item.stock=item.stock-stock;
            item.save();

        sale.customerId = customerId || sale.customerId;
       
        sale.itemId = itemId || sale.itemId;
        sale.totalPrice = totalPrice ? totalPrice : sale.totalPrice;
        sale.stock = stock ? stock : sale.stock;
        await sale.save();
        res.status(200).send(sale);


    })
    export { router as editSalesRouter};