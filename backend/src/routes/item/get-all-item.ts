import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { Item } from "../../models/InventoryItems";
const router = Router()
router.get('/api/item/getAll',requireAuth,currentUser,async(req:Request,res:Response)=>{
    const items =await Item.find();
    res.status(200).send(items);
})
export {router as allItemRouter}