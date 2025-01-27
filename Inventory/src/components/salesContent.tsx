import { DollarSign, Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import { DashboardCard } from './DashboardContent';
import { getAllCustomer } from '../Api/customer';
import { getAllItem } from '../Api/item';
import { editSaleReport, placeorder, salesReport } from '../Api/sales';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { generateExcel, generatePDF, printReport, sendEmail, } from '../util/report';
import { sendEmailApi } from '../Api/user';

// Validation Schema
const SalesSchema = Yup.object().shape({
  customer: Yup.string().required('Please select a customer'),
  item: Yup.string().required('Please select an item'),
  stock: Yup.number()
    .required('Stock quantity is required')
    .positive('Stock must be a positive number')
    .integer('Stock must be a whole number')
    .test('max-stock', 'Quantity exceeds available stock', function (value) {
      const { selectedItemStock } = this.parent;
      return !value || value <= selectedItemStock;
    }),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  totalPrice: Yup.number()
    .required('Total price is required')
    .positive('Total price must be positive')
    .test(
      'valid-total',
      'Total price must match quantity × price',
      function (value) {
        const { stock, price } = this.parent;
        return value === stock * price;
      }
    ),
});

const Modal: React.FC<any> = ({
  isOpen,
  onClose,
  onSubmit,
  typeOfForm,
  customerData = {},
}) => {
  const [customers, setCustomers] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [selectedItemStock, setSelectedItemStock] = useState<number>(0);
  const [selectedItemPrice, setSelectedItemPrice] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerResponse, itemResponse] = await Promise.all([
          getAllCustomer(),
          getAllItem(),
        ]);
        setCustomers(customerResponse);
        setItems(itemResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (!isOpen) return null;

  const initialValues = {
    customer: customerData?.customerId?.id || '',
    item: customerData?.itemId?.id || '',
    stock: customerData?.stock || '',
    price: customerData?.price || '',
    totalPrice: customerData?.totalPrice || '',
    selectedItemStock: 0,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{typeOfForm} Sale</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={SalesSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await onSubmit(values, typeOfForm);
              resetForm();
              onClose();
            } catch (error) {
              console.error('Form submission error:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Customer
                </label>
                <Field
                  as="select"
                  name="customer"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.customer && touched.customer ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </Field>
                {errors.customer && touched.customer && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.customer}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Item
                </label>
                <Field
                  as="select"
                  name="item"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.item && touched.item ? 'border-red-500' : ''
                  }`}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedItem = items.find(
                      (item: any) => item.id === e.target.value
                    );
                    setFieldValue('item', e.target.value);
                    setFieldValue('price', selectedItem?.price || 0);
                    setFieldValue(
                      'selectedItemStock',
                      selectedItem?.stock || 0
                    );
                    setSelectedItemStock(selectedItem?.stock || 0);
                    setSelectedItemPrice(selectedItem?.price || 0);
                  }}
                >
                  <option value="">Select an item</option>
                  {items.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Field>
                {errors.item && touched.item && (
                  <div className="text-red-500 text-sm mt-1">{errors.item}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Stock
                </label>
                <Field
                  type="number"
                  name="stock"
                  min={1}
                  max={selectedItemStock}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.stock && touched.stock ? 'border-red-500' : ''
                  }`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const quantity = parseInt(e.target.value);
                    setFieldValue('stock', quantity);
                    setFieldValue('totalPrice', quantity * selectedItemPrice);
                  }}
                />
                {selectedItemStock > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Available stock: {selectedItemStock}
                  </p>
                )}
                {errors.stock && touched.stock && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.stock}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price
                </label>
                <Field
                  type="number"
                  name="price"
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  value={selectedItemPrice}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Total Price
                </label>
                <Field
                  type="number"
                  name="totalPrice"
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  value={values.stock * selectedItemPrice}
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : typeOfForm === 'Edit'
                    ? 'Save Changes'
                    : 'Create Sale'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};


export const SalesContent = () => {
  const [modalType, setModalType] = useState<'Add' | 'Edit'>('Add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredSales, setFilteredSales] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [sales, setSales] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const getSales = async () => {
    const response = await salesReport();
    console.log(response, ':response of the sales');
    setSales(response);
    setFilteredSales(response);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = sales.filter(
      (sale: any) =>
        sale.customerId?.name?.toLowerCase().includes(query.toLowerCase()) ||
        sale.customer?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSales(filtered);
  };
  useEffect(() => {
    getSales();
  }, []);
  const handleAddCustomer = async (saleData: any, typeOfForm: string) => {
    console.log(saleData);
    if (typeOfForm === 'Add') {
      const response = await placeorder(
        saleData,
        saleData.customer,
        saleData.item
      );
      console.log(response, ':placeorder');
      getSales();
    } else if (typeOfForm === 'Edit') {
      const response = await editSaleReport(
        saleData,
        saleData.customer,
        saleData.item,
        selectedCustomer.id
      );
      console.log(response, 'edit sale');
      getSales();
    }
    setIsModalOpen(false);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setModalType('Edit');
    setIsModalOpen(true);
  };


    const handleOptionClick = (option) => {
      setIsOpen(false);
      switch (option) {
        case "pdf":
          console.log("Generate PDF");
          generatePDF(sales)
          break;
        case "excel":
          console.log("Generate Excel");
          generateExcel(sales)
          break;
        case "email":
          console.log("Send Email");
          sendEmail({sales})
          break;
        case "print":
          console.log("Print Report");
          printReport(sales)
          break;
        default:
          break;
      }
    };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sales Overview</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Customer Name"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
          />

          <button
            onClick={() => {
              setModalType('Add');
              setSelectedCustomer(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Sale</span>
          </button>
          <div className="relative inline-block text-left">
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Download Report
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1">
            <li
              onClick={() => handleOptionClick("pdf")}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              PDF
            </li>
            <li
              onClick={() => handleOptionClick("excel")}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              Excel
            </li>
            <li
              onClick={() => handleOptionClick("email")}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              Email
            </li>
            <li
              onClick={() => handleOptionClick("print")}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              Print
            </li>
          </ul>
        </div>
      )}
    </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Sales"
          value="$54,235"
          trend="up"
          trendValue="+14.5%"
          icon={DollarSign}
        />
        <DashboardCard
          title="Average Order Value"
          value="$285"
          trend="up"
          trendValue="+5.2%"
          icon={TrendingUp}
        />
        <DashboardCard
          title="Orders"
          value="854"
          trend="up"
          trendValue="+8.2%"
          icon={ShoppingCart}
        />
      </div>

      <Table
        headers={['ID', 'Customer', 'Items', 'stock', 'Total amount', 'Date']}
        data={filteredSales}
        editModal={handleEditCustomer}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCustomer}
        typeOfForm={modalType}
        customerData={selectedCustomer}
      />
    </div>
  );
};
const Table: React.FC<any> = ({ headers, data }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-700">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((sales: any, index: any) => (
            <tr
              key={index}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
            >
              <td className="px-6 py-4">#{String(sales.id).slice(-4)}</td>
              {sales.customerId && sales.customerId.name && (
                <td className="px-6 py-4">{sales.customerId.name}</td>
              )}
              {sales.customer && (
                <td className="px-6 py-4">{sales.customer}</td>
              )}
              {sales.itemId.name && (
                <td className="px-6 py-4">{sales.itemId.name}</td>
              )}
              {sales.stock && <td className="px-6 py-4">{sales.stock}</td>}
              {sales.totalPrice && (
                <td className="px-6 py-4">{sales.totalPrice}</td>
              )}
              {sales.saleDate && (
                <td className="px-6 py-4">
                  {new Date(sales.saleDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
