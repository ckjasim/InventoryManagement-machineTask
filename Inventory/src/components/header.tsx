
import { Search, Plus, Bell } from 'lucide-react';

const InventoryHeader = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-lg border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Inventory Manager</h1>
        <div className="hidden md:flex items-center space-x-4 ml-8">
          <button className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            Dashboard
          </button>
          <button className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            Reports
          </button>
          <button className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            Settings
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search inventory..."
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none w-64 placeholder-gray-400"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Quick Add</span>
        </button>

        <button className="p-2 hover:bg-gray-700 rounded-lg relative transition-colors">
          <Bell className="h-6 w-6 text-gray-300" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium">JD</span>
        </div>
      </div>
    </header>
  );
};

export default InventoryHeader;