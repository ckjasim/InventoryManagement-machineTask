import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { BadRequestError } from '../errors/bad-request-error';
import { HttpStatus } from '../constants/enum';
import { Item } from '../models/InventoryItems';

export const editItem = async (req: Request, res: Response) => {
  try {
    const {name,description,price,stock}=req.body;
const {itemId}=req.params
const item = await Item.findById(itemId);
if(!item){
    throw new BadRequestError('Item not found')
}
item.name=name||item.name;
item.description=description||item.description;
item.price=price||item.price;
item.stock=stock||item.stock;
await item.save()
res.status(200).send(item)
} catch (error) {
}
};
export const getAllItems = async (req: Request, res: Response) => {
  const items =await Item.find();
  res.status(200).send(items);
};

export const createItem = async (req: Request, res: Response) => {
  const {name,description,stock,price}=req.body
    const existingItem =await Item.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } })
    if (existingItem) {
        throw new BadRequestError('item exist');
    }
    const item = Item.build({name,description,stock,price})
    await item.save()
    res.status(201).send(item)

};

export const getEachItem = async (req: Request, res: Response) => {
  const {itemId}=req.params;
  const item = await Item.findById(itemId);
  if(!item){
      throw new BadRequestError('Item not found');
  }
  res.status(200).send(item)
};
