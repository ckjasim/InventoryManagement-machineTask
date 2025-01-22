import { BarChart3, DollarSign, Plus, ShoppingCart, TrendingUp } from "lucide-react";
import { DashboardCard } from "./DashboardContent";
import { useEffect, useState } from "react";
import { getAllCustomer } from "../Api/customer";
import { getAllItem } from "../Api/item";
import {  editSaleReport, placeorder, salesReport } from "../Api/sales";
const Modal: React.FC<any> = ({
    isOpen,
    onClose,
    onSubmit,
    typeOfForm,
    customerData = {},
}) => {
    const [customer, setCustomer] = useState<any>([]);
    const [item, setItem] = useState<any>([]);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getAllCustomer()
                const resItem = await getAllItem()
                console.log('the item', resItem)
                console.log('the custoemr', response)
                setItem(resItem)
                setCustomer(response)
            } catch (error) {

            }
        }
        fetchCustomers()
    }, [])
    const [selectedItemStock, setSelectedItemStock] = useState<any>(null);
    const [selectedItemPrice, setSelectedItemPrice] = useState<any>(null)
    const [stockCount, setStockCount] = useState<any>(null)
    const handleItemChange = (event:any) => {
        const selectedItemId = event.target.value;
        const selectedItem:any = item.find((item:any) => item.id === selectedItemId);
        setSelectedItemStock(selectedItem?.stock || 0); // Update stock value or set to 0 if no item is found
        setSelectedItemPrice(selectedItem?.price || 0);
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">{typeOfForm} Customer</h3>
                <form
                    onSubmit={async (e: any) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const customer = Object.fromEntries(formData.entries());
                        await onSubmit(customer, typeOfForm);
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Customer
                            </label>
                            <select

                                name="customer"

                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                {customer.length && customer.map(val => (


                                    <option value={val.id}>{val.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Item</label>
                            <select
                                name="item"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                onChange={handleItemChange} // Handle item change
                            >
                                <option value="">Select an item</option>
                                {item.length &&
                                    item.map((val) => (
                                        <option key={val.id} value={val.id}>
                                            {val.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                min={0}
                                onChange={(e) => setStockCount(e.target.value)}
                                max={selectedItemStock} // Dynamically set max value
                                defaultValue={typeOfForm === "Edit" ? customerData.stock : ""}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            {selectedItemStock !== null && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Available stock: {selectedItemStock}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Price
                            </label>
                            <input
                                type="text"
                                name="price"
                                defaultValue={typeOfForm === 'Edit' ? customerData.price : ''}
                                required
                                value={selectedItemPrice}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Total Price
                            </label>
                            <input
                                type="text"
                                name="totalPrice"
                                defaultValue={typeOfForm === 'Edit' ? customerData.price : ''}
                                required
                                value={selectedItemPrice * stockCount}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {typeOfForm === 'Edit' ? 'Save Changes' : 'Apply'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import jsPDF from "jspdf";
import "jspdf-autotable";

export const SalesContent = () => {
    const [modalType, setModalType] = useState<'Add' | 'Edit'>('Add');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredSales, setFilteredSales] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [sales, setSales] = useState<any>([])
    const getSales = async () => {
        const response = await salesReport()
        console.log(response, ':response of the sales')
        setSales(response)
        setFilteredSales(response)
    }
    const generatePDF = () => {
        const doc:any = new jsPDF();
        doc.text("Sales Report", 14, 20);

        const tableData = sales.map((sale, index) => [
            index + 1,
            sale.customerId?.name || sale.customer || "N/A",
            sale.itemId?.name || "N/A",
            `$${sale.totalPrice || 0}`,
            sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : "N/A",
        ]);

        doc.autoTable({
            head: [["#", "Customer", "Item", "Total Price", "Date"]],
            body: tableData,
            startY: 30,
        });

        doc.save("Sales_Report.pdf");
    };
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = sales.filter((sale:any) =>
            sale.customerId?.name?.toLowerCase().includes(query.toLowerCase()) ||
            sale.customer?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSales(filtered);
    };
    useEffect(() => {
        getSales()
    }, [])
    const handleAddCustomer = async (saleData: any, typeOfForm: string) => {
        console.log(saleData)
        if (typeOfForm === 'Add') {
            const response = await placeorder(saleData, saleData.customer, saleData.item);
            console.log(response, ':placeorder')
            getSales()
        }
        else if (typeOfForm === 'Edit') {
            const response = await editSaleReport(saleData, saleData.customer, saleData.item, selectedCustomer.id)
            console.log(response, 'edit sale')
            getSales()

        }
        setIsModalOpen(false);
    };

    const handleEditCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        setModalType('Edit');
        setIsModalOpen(true);
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Sales Overv</h2>
                <div className="flex space-x-4">
                <input
                        type="text"
                        placeholder="Search by Customer Name"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
                    />
                   
                    <button onClick={() => {
                        setModalType('Add');
                        setSelectedCustomer(null);
                        setIsModalOpen(true);
                    }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>New Sale</span>
                    </button>
                    <button
                        onClick={generatePDF}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                        Download Report
                    </button>
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
                headers={['ID', 'Customer', 'Items', "stock", 'Total amount', 'Date']}
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
const Table: React.FC<any> = ({
    headers,
    data,
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
         </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {data.map((sales:any, index:any) => (
                        <tr key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <td className="px-6 py-4">#{String(sales.id).slice(-4)}</td>
                            {sales.customerId && sales.customerId.name && <td className="px-6 py-4">{sales.customerId.name}</td>}
                            {sales.customer && <td className="px-6 py-4">{sales.customer}</td>}
                            {sales.itemId.name && <td className="px-6 py-4">{sales.itemId.name}</td>}
                            {sales.stock && <td className="px-6 py-4">{sales.stock}</td>}
                            {sales.totalPrice && <td className="px-6 py-4">{sales.totalPrice}</td>}
                            {sales.saleDate && <td className="px-6 py-4">{new Date(sales.saleDate).toLocaleDateString()}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};