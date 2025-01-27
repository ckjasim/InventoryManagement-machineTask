import React, { useEffect, useState } from 'react';
import { DashboardCard, Table } from './DashboardContent';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Plus, Users, TrendingUp, Search } from 'lucide-react';
import { createCustomer, editCustomer, getAllCustomer } from '../Api/customer';
import toast from 'react-hot-toast';

// Validation Schema
const CustomerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .trim()
});

const Modal: React.FC<any> = ({
  isOpen,
  onClose,
  onSubmit,
  typeOfForm,
  customerData = {},
}) => {
  if (!isOpen) return null;

  const initialValues = {
    name: typeOfForm === 'Edit' ? customerData.name : '',
    email: typeOfForm === 'Edit' ? customerData.email : ''
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{typeOfForm} Customer</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={CustomerSchema}
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
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors.email && touched.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
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
                    ? 'Submitting...' 
                    : typeOfForm === 'Edit' 
                      ? 'Save Changes' 
                      : 'Add Customer'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Rest of the CustomersContent component remains the same
export const CustomersContent = () => {
  const [customers, setCustomers] = useState<any>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Add' | 'Edit'>('Add');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await getAllCustomer();
      setCustomers(response);
      setFilteredCustomers(response);
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer: any) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleAddCustomer = async (customer: any, typeOfForm: string) => {
    try {
      if (typeOfForm === 'Add') {
        const response = await createCustomer(customer);
        setCustomers((prev: any) => [...prev, response]);
        toast.success('Customer added successfully');
      } else if (typeOfForm === 'Edit') {
        const response = await editCustomer(customer, selectedCustomer.id);
        if (response) {
          toast.success('Customer updated successfully');
          setIsModalOpen(false);
          const res = await getAllCustomer();
          setCustomers(res);
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.errors[0]?.message);
    }
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setModalType('Edit');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Customers</h2>
        <div className="flex space-x-4 items-center">
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
          <button
            onClick={() => {
              setModalType('Add');
              setSelectedCustomer(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Customers"
          value={customers.length.toString()}
          trend="up"
          trendValue="+12.5%"
          icon={Users}
        />
        <DashboardCard
          title="Active Customers"
          value="1,180"
          trend="up"
          trendValue="+8.2%"
          icon={Users}
        />
        <DashboardCard
          title="Customer Growth"
          value="+24.5%"
          trend="up"
          trendValue="+2.4%"
          icon={TrendingUp}
        />
      </div>

      <Table
        headers={['ID', 'Name', 'Email']}
        data={filteredCustomers}
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
