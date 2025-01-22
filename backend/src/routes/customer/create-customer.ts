import {Request, Response, Router} from 'express'
import { body } from 'express-validator'
import { requireAuth } from '../../middlewares/require-auth'
import { currentUser } from '../../middlewares/current-user'
import { BadRequestError } from '../../errors/bad-request-error'
import { validateRequest } from '../../middlewares/validateRequest'
import { Customer } from '../../models/customer'
const router = Router()
router.post('/api/customer/create',[
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().withMessage('Name is required')
    
  ],validateRequest,requireAuth,currentUser,async(req:Request,res:Response)=>{
    const {name,email}=req.body
    const existingCustomer =await Customer.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } ,email})
    if (existingCustomer) {
        throw new BadRequestError('Customer exist');
    }
    if (!req.currentUser || !req.currentUser.id) {
        throw new BadRequestError('User information is missing');
      }
    const{id}=req.currentUser 
    const customer = Customer.build({name,userId:id,email})
    await customer.save()
    res.status(201).send(customer)

})
export {router as createCustomerRouter}