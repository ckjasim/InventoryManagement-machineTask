import { Request, Response, Router } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { currentUser } from "../../middlewares/current-user";
import { param } from "express-validator";
import { Sales } from "../../models/sales";

const router =Router();
router.get('/api/sale/saleCount/:customerId',[
    param('customerId').isMongoId().withMessage('customerId is required')
],requireAuth,currentUser,
    async (req:Request,res:Response)=>{
        const{customerId}=req.params
        const saleCount = (await Sales.find({customerId})).length
  
            res.status(200).send({saleCount})
        
      
    }
)