import { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { HttpStatus } from '../constants/enum';
import { Sales } from '../models/sales';
import { Item } from '../models/InventoryItems';

export const deleteSalesReport = async (req: Request, res: Response) => {
  const { saleId } = req.params;
  const sale = await Sales.findByIdAndDelete(saleId);
  if (!sale) {
    throw new BadRequestError('sale not found');
  }
  console.log(sale, 'the delete sale', saleId);
  res.status(200).send(sale);
};
export const editSales = async (req: Request, res: Response) => {
  const { customerId, itemId, saleId } = req.params;
  const { stock, totalPrice } = req.body;
  const sale = await Sales.findById(saleId);

  if (!sale) {
    throw new BadRequestError('Sale not found');
  }
  if (sale.itemId == itemId) {
  }
  const item = await Item.findById(itemId);
  if (!item) {
    throw new BadRequestError('Item not found');
  }
  item.stock = item.stock - stock;
  item.save();

  sale.customerId = customerId || sale.customerId;

  sale.itemId = itemId || sale.itemId;
  sale.totalPrice = totalPrice ? totalPrice : sale.totalPrice;
  sale.stock = stock ? stock : sale.stock;
  await sale.save();
  res.status(200).send(sale);
};

export const customerOrder = async (req: Request, res: Response) => {
  if (!req.currentUser || !req.currentUser.id) {
    throw new BadRequestError('the user not login');
  }
  const order = await Sales.find({ userId: req.currentUser.id })
    .populate('customerId')
    .populate('itemId');
  res.status(201).send(order);
};

export const saleCount = async (req: Request, res: Response) => {
  async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const saleCount = (await Sales.find({ customerId })).length;

    res.status(200).send({ saleCount });
  };
};

export const placeOrder = async (req: Request, res: Response) => {
  const { stock, price, totalPrice } = req.body;
  const { customerId, itemId } = req.params;
  if (!req.currentUser || !req.currentUser.id) {
    throw new BadRequestError('user not login');
  }
  const item = await Item.findById(itemId);
  if (!item) {
    throw new BadRequestError('item not found');
  }
  if (!item.stock) {
    throw new BadRequestError('item stock is empty');
  }
  item.stock = item.stock - stock;
  await item.save();
  const order = Sales.build({
    customerId,
    price,
    stock,
    totalPrice,
    userId: req.currentUser.id,
    itemId,
    saleDate: Date.now(),
  });
  await order.save();
  res.status(201).send(order);
};
