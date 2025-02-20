import { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { HttpStatus } from '../constants/enum';
import { User } from '../models/user';
import jwt from 'jsonwebtoken'
import { Password } from '../service/password';
import { sendEmail } from '../util/nodeMailerService';


export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({email});

  if(existingUser){
     throw new BadRequestError('Email in use')

  }
  const user = User.build({email,password})
  await user.save()

  const userJWt =jwt.sign({
      id:user._id,
      email:user.email
  },process.env.JWT_KEY!)

  //Store it on session object
  req.session={
      jwt:userJWt
  }
   res.status(HttpStatus.CREATED).send(user); 
};


export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
     const existingUser = await User.findOne({ email })
     if (!existingUser) {
         throw new BadRequestError('Invalid credentials');
     }
     const passwordsMatch = await Password.compare(
         existingUser.password,
         password
     )
     if (!passwordsMatch) {
         throw new BadRequestError('Invalid credentials')
     }
     const userJWt = jwt.sign({
         id: existingUser.id,
         email: existingUser.email
     }, process.env.JWT_KEY!)
     req.session = { jwt: userJWt };
     res.status(HttpStatus.SUCCESS).send(existingUser);
};

export const signOut = async (req: Request, res: Response) => {
  req.session=null;
  res.send({message:'you are logout'})
};
export const currentUserInfo = async (req: Request, res: Response) => {
  res.send({currentUser:req.currentUser||null})

};

const generateSalesHTML = (sales: any[]): string => {
  const rows = sales.map((sale, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${sale.customerId?.name || sale.customer || 'N/A'}</td>
      <td>${sale.itemId?.name || 'N/A'}</td>
      <td>$${sale.totalPrice || 0}</td>
      <td>${sale.saleDate
        ? new Date(sale.saleDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'N/A'}</td>
    </tr>
  `).join('');

  return `
    <html>
      <body>
        <h1>Sales Report</h1>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

// Function to generate Items HTML
const generateItemsHTML = (items: any[]): string => {
  const rows = items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name || 'N/A'}</td>
      <td>${item.description || 'N/A'}</td>
      <td>${item.category || 'N/A'}</td>
      <td>${item.stock || 0}</td>
      <td>$${item.price || 0}</td>
    </tr>
  `).join('');

  return `
    <html>
      <body>
        <h1>Inventory Report</h1>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};
export const sendEmailToUser = async (req: Request, res: Response) => {
 const { sales, items } = req.body;

  if (!sales && !items) {
    throw new BadRequestError('No data provided');
  }

  let emailHTML: string;

  if (sales && Array.isArray(sales)) {
    emailHTML = generateSalesHTML(sales);
  } else if (items && Array.isArray(items)) {
    emailHTML = generateItemsHTML(items);
  } else {
    throw new BadRequestError('Invalid data format');
  }

  // Send the email with the appropriate HTML content
  await sendEmail(
    req.currentUser?.email,
    sales ? 'Sales Report' : 'Inventory Report',
    emailHTML
  );

  res.status(HttpStatus.SUCCESS).send({ message: `${sales ? 'Sales' : 'Inventory'} report email sent successfully!` });
}

