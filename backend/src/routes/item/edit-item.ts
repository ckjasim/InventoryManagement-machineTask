import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { Item } from "../../models/InventoryItems";
import { BadRequestError } from "../../errors/bad-request-error";
import { validateRequest } from "../../middlewares/validateRequest";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";

const router = Router()
router.put('/api/item/:itemId',[
    param('itemId').trim()
    .notEmpty()
    .withMessage('itemId is required')
],validateRequest,requireAuth,currentUser, async(req:Request, res:Response) => {
    try {
        const {name,description,price,stock}=req.body;
    const {itemId}=req.params
console.log(itemId, 'idddd')
    const item = await Item.findById(itemId);
    if(!item){
        throw new BadRequestError('Item not found')
    }
    item.name=name||item.name;
    item.description=description||item.description;
    item.price=price||item.price;
    item.stock=stock||item.stock;
    await item.save()
    res.status(200).send(item)
    } catch (error) {
console.log(error,'lllllllllllll')
    }
    
})
export {router as editItemRouter}

