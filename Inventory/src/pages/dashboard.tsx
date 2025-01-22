import { Route, Routes } from "react-router-dom";
import {  HomeContent } from "../components/DashboardContent";

import InventoryNavbar from "../components/navbar";
import InventoryHeader from "../components/header";
import { CustomersContent } from "../components/CustomersContent";
import { ItemsContent } from "../components/ItemsContent";
import { SalesContent } from "../components/salesContent";

const dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900"> 
      <InventoryHeader /> 
      <div className="flex flex-1"> 
        <InventoryNavbar /> 
        <div className="flex-1 p-6"> 
          <main> 
            {/* Use your router here, for example: */}
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/sales" element={<SalesContent />} />
              <Route path="/customers" element={<CustomersContent />} />
              <Route path="/items" element={<ItemsContent />} />
            </Routes>
          </main> 
        </div> 
      </div> 
    </div> 
  );
};
export default dashboard