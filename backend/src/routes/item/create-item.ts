import {Request, Response, Router} from 'express'
import { body } from 'express-validator'
import { requireAuth } from '../../middlewares/require-auth'
import { currentUser } from '../../middlewares/current-user'
import { Item } from '../../models/InventoryItems'
import { BadRequestError } from '../../errors/bad-request-error'
import { validateRequest } from '../../middlewares/validateRequest'
const router = Router()
router.post('/api/item/create',[
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('stock').trim().isNumeric().withMessage('Stock must be a number'),
    body('price').trim().isNumeric().withMessage('Price must be a number'),
  ],validateRequest,requireAuth,currentUser,async(req:Request,res:Response)=>{
    const {name,description,stock,price}=req.body
    const existingItem =await Item.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } })
    if (existingItem) {
        throw new BadRequestError('item exist');
    }
    const item = Item.build({name,description,stock,price})
    await item.save()
    res.status(201).send(item)

})
export {router as createItemRouter}