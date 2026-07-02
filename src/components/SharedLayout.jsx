import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function SharedLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed);
  }, [isCollapsed]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0e12] flex flex-col md:flex-row transition-colors duration-300 font-sans antialiased text-slate-800 dark:text-[#e8eaf0] relative">
      {/* Sidebar navigation */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 ${
        isCollapsed ? 'md:pl-0' : 'md:pl-64'
      }`}>
        <div className="max-w-6xl mx-auto w-full relative">
          {/* Fixed Floating toggle button to open sidebar when collapsed on desktop */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden md:flex fixed left-5 top-5 z-30 items-center justify-center w-10 h-10 bg-white dark:bg-[#13151c] border border-slate-200 dark:border-[#1e2130] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 text-emerald-500 dark:text-emerald-400 cursor-pointer"
              title="Show Sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Spacer to prevent title text from colliding with the floating button when collapsed */}
          <div className={`${isCollapsed ? 'md:pl-12' : ''} transition-all duration-350`}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
