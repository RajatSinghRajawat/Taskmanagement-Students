import React from 'react';
import { MdSearch, MdNotificationsNone, MdMenu } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Topbar = ({ setIsMobileOpen }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-all shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-all active:scale-95 border border-slate-100"
        >
          <MdMenu size={24} />
        </button>

        {/* Search Bar - Hidden on small mobile screens */}
        <div className="hidden sm:flex items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all max-w-md w-[300px] lg:w-[400px]">
          <MdSearch className="text-slate-400 mr-2" size={22} />
          <input 
            type="text" 
            placeholder="Search tasks, materials..." 
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Date / Time / Welcome */}
        <div className="hidden md:block text-right mr-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome back!
          </p>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 active:scale-95 group border border-slate-200 hover:border-indigo-100">
          <MdNotificationsNone size={22} className="group-hover:animate-pulse" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>

        {/* Profile Avatar */}
        <Link 
          to="/profile"
          className="block h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div className="h-full w-full rounded-[14px] border-2 border-white flex items-center justify-center text-white font-bold overflow-hidden bg-white">
            <img 
              src="https://ui-avatars.com/api/?name=Student&background=6366f1&color=fff&rounded=true&bold=true" 
              alt="User" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
