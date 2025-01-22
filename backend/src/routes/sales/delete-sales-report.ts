import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { Sales } from "../../models/sales";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router();
 router.delete('/api/sales/:saleId',[
    param('saleId').isMongoId().withMessage('saled is required as param')
 ],validateRequest,requireAuth,currentUser,
async(req:Request,res:Response)=>{
    const {saleId}=req.params;
    const sale = await Sales.findByIdAndDelete(saleId);
    if(!sale){
        throw new BadRequestError('sale not found')
    }
    console.log(sale,'the delete sale',saleId)
    res.status(200).send(sale)
}


)
export {router as deleteSaleRouter}