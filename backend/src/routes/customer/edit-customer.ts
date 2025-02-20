import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { Customer } from "../../models/customer";
import { BadRequestError } from "../../errors/bad-request-error";
import { HttpStatus } from "../../constants/enum";

const router = Router()
router.patch('/api/customer/:customerId',[
    param('customerId').trim().notEmpty()
    .withMessage('customerId is requred')
],validateRequest,requireAuth,currentUser,
async(req:Request,res:Response)=>{
    const {customerId}=req.params;
    const {name,email}=req.body;
    console.log('entered name',name)
    const customer = await Customer.findOne({_id:customerId})
    if(!customer){
        throw new BadRequestError('Customer not found')
    }
    customer.name=name||customer.name;
    customer.email=email||customer.email;
    await customer.save();
    res.status(HttpStatus.CREATED).send(customer)
}
)
export {router as editCustomerRouter}