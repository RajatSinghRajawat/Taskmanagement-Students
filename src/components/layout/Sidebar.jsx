import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  MdSpaceDashboard, 
  MdTaskAlt, 
  MdInsertChartOutlined, 
  MdOutlineFolderZip,
  MdNotificationsNone,
  MdOutlinePersonOutline,
  MdMenuOpen,
  MdMenu,
  MdClose,
  MdLogout
} from 'react-icons/md';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mock user for student
    setUser({ name: "Alex Johnson", email: "alex.j@student.edu" });
  }, []);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsOpen(true); // Always fully open when in mobile overlay mode
      } else {
        setIsMobile(false);
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Navigate back to home or login
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <MdSpaceDashboard size={24} /> },
    { name: "My Tasks", path: "/tasks", icon: <MdTaskAlt size={24} /> },
    { name: "Materials", path: "/materials", icon: <MdOutlineFolderZip size={24} /> },
    { name: "My Report", path: "/report", icon: <MdInsertChartOutlined size={24} /> },
    { name: "Notifications", path: "/notifications", icon: <MdNotificationsNone size={24} /> },
    { name: "Profile", path: "/profile", icon: <MdOutlinePersonOutline size={24} /> },
  ];

  const sidebarClasses = `
    ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative z-20'}
    h-screen bg-white/90 backdrop-blur-2xl text-slate-700 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-200/50
    ${isMobile ? (isMobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]') : (isOpen ? 'w-[280px]' : 'w-[88px]')}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 h-20 shrink-0">
          <div className={`font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 overflow-hidden transition-all duration-400 flex-1 whitespace-nowrap bg-[length:200%_auto] animate-gradient ${(!isMobile && !isOpen) ? 'opacity-0 -translate-x-full w-0 hidden' : 'opacity-100 translate-x-0'}`}>
            Task<span className="font-light text-slate-400">Flow</span>
          </div>
          
          {/* Mobile Close Button or Desktop Toggle */}
          {isMobile ? (
            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all active:scale-95 flex-shrink-0 border border-transparent hover:border-rose-100"
            >
              <MdClose size={22} />
            </button>
          ) : (
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95 flex-shrink-0 border border-slate-100 hover:border-indigo-100 shadow-sm"
            >
              {isOpen ? <MdMenuOpen size={22} /> : <MdMenu size={22} />}
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
                if (isMobile) setIsMobileOpen(false);
              }}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3.5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold shadow-sm border border-indigo-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-500 font-medium border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  )}
                  
                  <div className={`transition-transform duration-300 group-hover:scale-110 flex-shrink-0 relative z-10 ${(!isMobile && !isOpen) ? 'mx-auto' : ''}`}>
                    {item.icon}
                  </div>
                  
                  <span className={`tracking-wide whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10 ${(!isMobile && !isOpen) ? 'opacity-0 -translate-x-4 w-0 hidden' : 'opacity-100 translate-x-0'}`}>
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed state (Desktop only) */}
                  {!isMobile && !isOpen && (
                    <div className="absolute left-[70px] bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0 flex items-center">
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Info & Logout (Bottom) */}
        <div className="p-4 border-t border-slate-200/50 bg-slate-50/50 m-4 rounded-2xl">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-400 ${(!isMobile && !isOpen) ? 'justify-center flex-col' : 'justify-between px-1'}`}>
            <Link to="/profile" onClick={() => { if (isMobile) setIsMobileOpen(false); }} className="flex items-center gap-3 hover:bg-slate-100/50 p-1.5 rounded-xl transition-colors cursor-pointer w-full overflow-hidden">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md ring-2 ring-white/50 relative overflow-hidden group">
                <img src="https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff&bold=true" alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className={`transition-all duration-400 whitespace-nowrap flex-1 ${(!isMobile && !isOpen) ? 'hidden' : 'block'}`}>
                <p className="text-[13px] font-bold text-slate-700 leading-tight truncate w-[110px]">Alex Johnson</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-semibold truncate w-[110px]">alex.j@student.edu</p>
              </div>
            </Link>
            
            <button 
              onClick={handleLogout}
              title="Logout"
              className={`p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 ${(!isMobile && !isOpen) ? 'mt-1 bg-slate-50' : 'bg-white shadow-sm border border-slate-100 hover:border-rose-100'}`}
            >
              <MdLogout size={20} className={(!isMobile && !isOpen) ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
