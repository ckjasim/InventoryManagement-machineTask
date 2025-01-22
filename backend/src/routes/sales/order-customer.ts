import { Request, Response, Router } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { Sales } from "../../models/sales";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router()
router.get('/api/sales/salesreport',requireAuth,currentUser,
    async(req:Request,res:Response)=>{
        if(!req.currentUser||!req.currentUser.id){
            throw new BadRequestError('the user not login')
        }
        const order =await Sales.find({userId:req.currentUser.id}).populate('customerId').populate('itemId')
        res.status(201).send(order)

})
export {router as salesReportRouter}