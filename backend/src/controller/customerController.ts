import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { BadRequestError } from '../errors/bad-request-error';
import { HttpStatus } from '../constants/enum';

export const editCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { name, email } = req.body;
  console.log('entered name', name);
  const customer = await Customer.findOne({ _id: customerId });
  if (!customer) {
    throw new BadRequestError('Customer not found');
  }
  customer.name = name || customer.name;
  customer.email = email || customer.email;
  await customer.save();
  res.status(HttpStatus.CREATED).send(customer);
};
export const getAllCustomers = async (req: Request, res: Response) => {
  if (!req.currentUser || !req.currentUser.id) {
    throw new BadRequestError('User information is missing');
  }
  const { id } = req.currentUser;

  const customers = await Customer.find({ userId: id });
  res.status(200).send(customers);
};

export const createCustomer = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  // console.log(curr)
  const existingCustomer = await Customer.findOne({
    userId: req.currentUser?.id,
    email,
  });
  if (!req.currentUser || !req.currentUser.id) {
    throw new BadRequestError('User information is missing');
  } else if (existingCustomer) {
    throw new BadRequestError('Customer exist with email Id');
  } else {
    const { id } = req.currentUser;
    const customer = Customer.build({ name, userId: id, email });
    await customer.save();
    res.status(HttpStatus.CREATED).send(customer);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const customer = await Customer.findOneAndDelete({ _id: customerId });
  if (!customer) {
    throw new BadRequestError('Customer not found');
  }
  res.status(HttpStatus.SUCCESS).send(customer);
};
