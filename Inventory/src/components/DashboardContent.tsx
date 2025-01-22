import React, { useState } from 'react';
import {
  Users, Package, TrendingUp, DollarSign, ShoppingCart, Plus, BarChart3, ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
interface DashboardCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
interface TableProps {
  headers: string[]; // Array of table headers
  data: Array<Record<string, string | number>>; // Array of records with string or number values
  actions?: boolean; // Optional boolean for showing actions
  editModal:any; // Function with specified type
}
// Dashboard Card Component
export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, trend, icon: Icon, trendValue }) => (
  <div className="bg-gray-800 p-6 rounded-xl">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-gray-700 rounded-lg">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>
    </div>
    <div className="flex items-center mt-4">
      {trend === 'up' ? (
        <ArrowUpRight className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowDownRight className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trendValue}
      </span>
      <span className="text-gray-400 text-sm ml-2">vs last month</span>
    </div>
  </div>
);

// Table Component
export const Table: React.FC<TableProps> = ({
  headers,
  data,
  actions = true,
  editModal,
}) => {
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
            {actions && <th className="px-6 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((customer, index) => (
            <tr key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
               <td className="px-6 py-4">#{String(customer.id).slice(-4)}</td>
               
              {customer.name&&<td className="px-6 py-4">{customer.name}</td>}
              {customer.description&&<td className="px-6 py-4">{customer.description}</td>}
              {customer.stock&&<td className='px-6 py-4'>{customer.stock}</td>}
              {customer.price&&<td className='px-6 py-4'>{customer.price}</td>}
              {customer.customer&&<td className="px-6 py-4">{customer.customer}</td>}
              {customer.items&&<td className="px-6 py-4">{customer.items}</td>}
              {customer.total&&<td className="px-6 py-4">{customer.total}</td>}
              {customer.date&&<td className="px-6 py-4">{customer.date}</td>}
              {customer.email&&<td className="px-6 py-4">{customer.email}</td>}
              {actions && (<>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => editModal(customer)}
                    className="text-blue-400 hover:text-blue-300 mx-2"
                    >
                    Edit
                  </button>
                </td>
              
                    </>
                
              )}
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// Home Component
export const HomeContent = () => {
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Sales"
          value="$54,235"
          trend="up"
          trendValue="+14.5%"
          icon={DollarSign}
        />
        <DashboardCard
          title="Total Orders"
          value="854"
          trend="up"
          trendValue="+8.2%"
          icon={ShoppingCart}
        />
        <DashboardCard
          title="Total Customers"
          value="1,254"
          trend="down"
          trendValue="-2.4%"
          icon={Users}
        />
        <DashboardCard
          title="Total Items"
          value="432"
          trend="up"
          trendValue="+4.7%"
          icon={Package}
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Sales Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Sales Component


// Customers Component

// Items Component


export default {
  HomeContent,
  


};