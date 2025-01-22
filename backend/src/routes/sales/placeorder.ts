import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { BadRequestError } from "../../errors/bad-request-error";
import { Sales } from "../../models/sales";
import { Item } from "../../models/InventoryItems";

const router = Router()
router.post('/api/sales/placeorder/:customerId/:itemId',[
    param('itemId').trim().notEmpty().withMessage('itmeId is required'),
    body('stock').trim().isNumeric().withMessage('Stock must be a number'),
    body('price').trim().isNumeric().withMessage('Price must be a number'),
    body('totalPrice').trim().isNumeric().withMessage('total Price is required'),
    param('customerId').trim().notEmpty().withMessage('customerId be required'),


],validateRequest,requireAuth,currentUser,async(req:Request,res:Response)=>{
    const {stock,price,totalPrice}=req.body;
    const {customerId,itemId}=req.params
    if(!req.currentUser||!req.currentUser.id){
        throw new BadRequestError('user not login')
    }
    const item =await Item.findById(itemId);
    if(!item){
        throw new BadRequestError('item not found')
    }
    if(!item.stock){
        throw new BadRequestError('item stock is empty')
    }
    item.stock=item.stock-stock
    await item.save()
    const order = Sales.build({customerId,price,stock,totalPrice,userId:req.currentUser.id,itemId,saleDate:Date.now()})
    await order.save()
    res.status(201).send(order)

})
export {router as placeorderRouter}