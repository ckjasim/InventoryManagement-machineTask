import {Request,Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { HttpStatus } from "../constants/enum";


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
    res.status(HttpStatus.BAD_REQUEST).send({
        message:err.message
    })
}