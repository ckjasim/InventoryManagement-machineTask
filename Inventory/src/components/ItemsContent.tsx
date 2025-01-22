import React, { useEffect, useState } from "react";
import { Filter, Package, Plus, Edit2, Search } from "lucide-react";
import { DashboardCard, Table } from "./DashboardContent";
import { createItem, editItem, getAllItem } from "../Api/item";

const Modal:React.FC<any> = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  if (!isOpen) return null;

  // Use optional chaining and default values to handle null/undefined `initialData`
  const { id = "", name = "", category = "", stock = "", price = "",description="" } = initialData || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{id ? "Edit Item" : "Add Item"}</h3>
        <form
          onSubmit={(e:any) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const item = Object.fromEntries(formData.entries());
            onSubmit({ ...item, id: id || `ITM${Date.now()}` });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={name}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={description}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={category}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                defaultValue={stock}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="text"
                name="price"
                defaultValue={price}
                required
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
              {id ? "Update" : "Add"}
            </button>
          </div>
        </form>
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
      const response = await editItem(item,currentItem.id)
      if(response){
        console.log(response)
      }
    }
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = item;
        return updatedItems;
      }
      return [...prevItems, item];
    });
    setIsModalOpen(false);
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
