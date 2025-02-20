import { customerRouter } from "./customerRoute";
import { itemRouter } from "./itemRoute";

import { singinRouter } from "./signin";
import {singupRouter} from './siginup'
import { singoutRouter } from "./singout";
import { currentUserRouter } from "./current-user";
import { placeorderRouter } from "./sales/placeorder";
import { salesReportRouter } from "./sales/order-customer";
import { editSalesRouter } from "./sales/edit-sales-report";
import { deleteSaleRouter } from "./sales/delete-sales-report";
import { emailRouter } from "./send-email";
export {
    customerRouter,
    itemRouter,

    singinRouter,
    singupRouter,
    singoutRouter,
    currentUserRouter,
   
    placeorderRouter,
  
    salesReportRouter,
    editSalesRouter,
    deleteSaleRouter,
    emailRouter
}