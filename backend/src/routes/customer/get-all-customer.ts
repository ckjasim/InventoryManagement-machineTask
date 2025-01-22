import {Request, Response, Router} from 'express'

import { requireAuth } from '../../middlewares/require-auth'
import { currentUser } from '../../middlewares/current-user'
import { BadRequestError } from '../../errors/bad-request-error'

import { Customer } from '../../models/customer'
const router = Router()
router.get('/api/customer/getAll',requireAuth,currentUser,async(req:Request,res:Response)=>{
   
    if (!req.currentUser || !req.currentUser.id) {
        throw new BadRequestError('User information is missing');
      }
    const{id}=req.currentUser 
    const customers =await Customer.find({userId:id})
   
    res.status(200).send(customers)

})
export {router as AllCustomerRouter}