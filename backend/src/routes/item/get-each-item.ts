import { Request, Response, Router } from "express";
import {  param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { Item } from "../../models/InventoryItems";
import { BadRequestError } from "../../errors/bad-request-error";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";

const router = Router();
router.get('/api/item/:itemId',[
    param('itemId').trim().notEmpty()
    .withMessage('itemId is required as param')
],validateRequest,requireAuth,currentUser,async(req:Request,res:Response)=>{
    const {itemId}=req.params;
    const item = await Item.findById(itemId);
    if(!item){
        throw new BadRequestError('Item not found');
    }
    res.status(200).send(item)
})
export {router as getEachItemRouter}