import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header - Refined for better mobile UX */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden z-30 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                <span className="font-heading font-black text-white text-xs tracking-tighter">SJ</span>
             </div>
             <span className="font-heading font-extrabold text-slate-900 tracking-tighter text-sm uppercase">Saputra Jaya</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 border border-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-auto scroll-smooth">
          <div className="mx-auto max-w-screen-2xl p-5 md:p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;