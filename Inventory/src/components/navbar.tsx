import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { currentUser, logout } from '../Api/user';

const InventoryNavbar:React.FC = () => {
const navigate = useNavigate()  
    const handlelogout = async()=>{
    const response = await logout()
    console.log(response)
    window.location.href='/login'
    }
  
  return (
    <nav className="bg-gray-800 text-white w-64 h-screen flex flex-col justify-between">
      <ul className="mt-4 space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 rounded-lg bg-gray-900'
                : 'block px-4 py-2 rounded-lg hover:bg-gray-900'
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 rounded-lg bg-gray-900'
                : 'block px-4 py-2 rounded-lg hover:bg-gray-900'
            }
          >
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sales"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 rounded-lg bg-gray-900'
                : 'block px-4 py-2 rounded-lg hover:bg-gray-900'
            }
          >
            Sales
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive
                ? 'block px-4 py-2 rounded-lg bg-gray-900'
                : 'block px-4 py-2 rounded-lg hover:bg-gray-900'
            }
          >
            Items
          </NavLink>
        </li>
      </ul>
      <div className="mb-4">
        <button
          className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg"
          onClick={handlelogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default InventoryNavbar;
