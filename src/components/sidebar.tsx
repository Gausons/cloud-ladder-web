"use client";

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Cloud Ladder</h1>
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Overview
        </Link>
        <Link href="/dashboard/accounts" className="hover:bg-gray-700 p-2 rounded">
          Accounts
        </Link>
        <Link href="/dashboard/tasks" className="hover:bg-gray-700 p-2 rounded">
          Tasks
        </Link>
        <Link href="/dashboard/settings" className="hover:bg-gray-700 p-2 rounded">
          Settings
        </Link>
      </nav>
      <div className="mt-auto">
         <button 
           onClick={() => {
             localStorage.removeItem('token');
             window.location.href = '/login';
           }}
           className="text-red-400 hover:text-red-300 w-full text-left p-2"
         >
           Logout
         </button>
      </div>
    </div>
  );
};

export default Sidebar;
