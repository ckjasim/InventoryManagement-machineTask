import React, { useEffect, useState } from "react";
import { Filter, Package, Plus, Edit2, Search } from "lucide-react";
import { DashboardCard, Table } from "./DashboardContent";
import { createItem, editItem, getAllItem } from "../Api/item";

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { generateExcel, generateItemPDF, printReport, sendEmail } from "../util/itemReport";

// Validation schema
const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be less than 200 characters')
    .trim(),
  category: Yup.string()
    .required('Category is required')
    .min(2, 'Category must be at least 2 characters')
    .max(30, 'Category must be less than 30 characters')
    .trim(),
  stock: Yup.number()
    .required('Stock is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(9999, 'Stock cannot exceed 9999 units'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .max(999999.99, 'Price cannot exceed 999,999.99')
    .test(
      'is-decimal',
      'Price cannot have more than 2 decimal places',
      (value) => !value || Number.isInteger(value * 100)
    )
});

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    category?: string;
    stock?: number;
    price?: number;
  };
}

const Modal: React.FC<ItemFormProps> = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  if (!isOpen) return null;

  const initialValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    stock: initialData?.stock || '',
    price: initialData?.price || ''
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {initialData?.id ? "Edit Item" : "Add Item"}
        </h3>
        
        <Formik
          initialValues={initialValues}
          validationSchema={ItemSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await onSubmit({
                ...values,
                id: initialData?.id || `ITM${Date.now()}`
              });
              resetForm();
              onClose();
            } catch (error) {
              console.error('Form submission error:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.name && touched.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.description && touched.description ? 'border-red-500' : ''
                  }`}
                />
                {errors.description && touched.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <Field
                  type="text"
                  name="category"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.category && touched.category ? 'border-red-500' : ''
                  }`}
                />
                {errors.category && touched.category && (
                  <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Stock
                </label>
                <Field
                  type="number"
                  name="stock"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.stock && touched.stock ? 'border-red-500' : ''
                  }`}
                />
                {errors.stock && touched.stock && (
                  <div className="text-red-500 text-sm mt-1">{errors.stock}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price
                </label>
                <Field
                  type="number"
                  name="price"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.price && touched.price ? 'border-red-500' : ''
                  }`}
                />
                {errors.price && touched.price && (
                  <div className="text-red-500 text-sm mt-1">{errors.price}</div>
                )}
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
                    : initialData?.id 
                      ? 'Update' 
                      : 'Add'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export const ItemsContent = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState();
  const [filteredItem, setFilteredItem] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState<'Add' | 'Edit'>('Add');
    const [isOpen, setIsOpen] = useState(false);
  
  const handleEditItem= (item:any)=>{
    setIsModalOpen(true)
    setCurrentItem(item)
    setModalType('Edit');
  }
useEffect(()=>{
  const fetchTheItems=async()=>{
    const response = await getAllItem()
    setItems(response)
    setFilteredItem(response)
  }
  fetchTheItems()
},[])
useEffect(() => {
  // Filter customers based on the search query
  const filtered = items.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredItem(filtered);
}, [searchQuery, items]);
  const handleAddOrEditItem = async(item:any) => {
    if(modalType=='Add'){
      const response = await createItem(item)
      if(response){
        console.log(response)
      }
    }else{
      if(!currentItem||!currentItem.id){
        return
      }
      console.log(currentItem,'jjhjhj')
      const response = await editItem(item,currentItem.id)
    
        console.log(response,'kkkkkkkkkkkkkkkkkkkkkk')
      
    }
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i: { id: any; }) => i.id === item.id);
      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = item;
        return updatedItems;
      }
      return [...prevItems, item];
    });
    setIsModalOpen(false);
  };
 const handleOptionClick = (option) => {
    setIsOpen(false);
    switch (option) {
      case "pdf":
        console.log("Generate PDF");
        generateItemPDF(items)
        break;
      case "excel":
        console.log("Generate Excel");
        generateExcel(items)
        break;
      case "email":
        console.log("Send Email");
        sendEmail({items})
        break;
      case "print":
        console.log("Print Report");
        printReport(items)
        break;
      default:
        break;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Inventory Items</h2>
        <div className="flex space-x-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Customers"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
        </div>
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
          <button
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Items"
          value="432"
          trend="up"
          trendValue="+5.8%"
          icon={Package}
        />
        <DashboardCard
          title="Low Stock Items"
          value="12"
          trend="down"
          trendValue="-2.4%"
          icon={Package}
        />
        <DashboardCard
          title="Out of Stock"
          value="3"
          trend="down"
          trendValue="-1.2%"
          icon={Package}
        />
      </div>

      <Table
  editModal={handleEditItem}
  headers={["ID", "Name", "Description", "Stock", "Price"]}
  data={filteredItem.map((item: any) => ({
    ...item,
    actions: (
      <button
        onClick={() => {
          setCurrentItem(item);
          setIsModalOpen(true);
        }}
        className="text-blue-600 hover:underline flex items-center space-x-1"
      >
        <Edit2 className="h-4 w-4" />
        <span>Edit</span>
      </button>
    ),
  }))}
/>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrEditItem}
        initialData={currentItem}
        
      />
    </div>
  );
};
