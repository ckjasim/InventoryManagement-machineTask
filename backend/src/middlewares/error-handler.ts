import {Request,Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";


export const errorhandler =(
    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    if(err instanceof CustomError){
      return res.status(err.statusCode).send({errors:err.serializeErrors()})
    }
  
    console.log('something went wrong',err.message)
    res.status(400).send({
        message:err.message
    })
}