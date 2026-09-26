import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { 
  ShieldAlert, LayoutDashboard, Activity, AlertTriangle, 
  Crosshair, Server, Users, Settings, LogOut, Menu, Bell,
  Search, Terminal, Database, ChevronRight, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import MatrixBackground from '../components/MatrixBackground';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navGroups = [
    {
      title: 'المراقبة',
      items: [
        { name: 'مركز القيادة', path: '/', icon: LayoutDashboard },
        { name: 'الأحداث الحية', path: '/events', icon: Activity },
      ]
    },
    {
      title: 'الاستكشاف',
      items: [
        { name: 'التنبيهات', path: '/alerts', icon: AlertTriangle },
        { name: 'الاستخبارات', path: '/threat-intelligence', icon: Globe },
      ]
    },
    {
      title: 'الاستجابة',
      items: [
        { name: 'إدارة الحوادث', path: '/incidents', icon: Crosshair },
      ]
    },
    {
      title: 'الإدارة',
      items: [
        { name: 'الأصول', path: '/assets', icon: Server },
        { name: 'المستخدمين', path: '/users', icon: Users },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex text-textPrimary font-sans overflow-hidden" dir="rtl" translate="no">
      
      {/* Premium Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-surface/90 backdrop-blur-3xl border-l border-white/[0.05] flex flex-col relative z-20 shadow-2xl shadow-black"
      >
        <div className="h-20 flex items-center px-6 border-b border-white/[0.05] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
          <ShieldAlert className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="font-black text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400 mr-4"
              >
                CYBEROPS X
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              {isSidebarOpen && (
                <div className="px-8 mb-2 text-xs font-bold tracking-widest text-textSecondary uppercase">
                  {group.title}
                </div>
              )}
              <div className="space-y-1 px-4">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                        isActive 
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]' 
                          : 'text-textSecondary hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {isActive && <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-l-full shadow-[0_0_10px_rgba(0,212,255,1)]"></div>}
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_5px_rgba(0,212,255,0.8)]' : 'group-hover:scale-110'}`} />
                      {isSidebarOpen && (
                        <span className="font-medium whitespace-nowrap">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.05] bg-background/50">
          <div className={`flex items-center gap-3 px-2 py-3 rounded-xl ${!isSidebarOpen && 'justify-center'}`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-surfaceHighlight to-surface border border-white/10 flex items-center justify-center text-primary font-bold shadow-lg shadow-black/50">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{user?.username}</div>
                <div className="text-xs text-primary truncate font-mono">{user?.roles[0]?.name || 'Analyst'}</div>
              </div>
            )}
            {isSidebarOpen && (
              <button onClick={logout} className="p-2 text-textSecondary hover:text-critical transition-colors rounded-lg hover:bg-white/5">
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Global animated background */}
        <MatrixBackground />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,65,0.05),transparent_50%)] pointer-events-none z-0"></div>

        {/* Topbar */}
        <header className="h-20 bg-surface/40 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-textSecondary hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center bg-black/40 border border-white/[0.05] rounded-lg px-4 py-2 w-96 group focus-within:border-primary/50 transition-colors shadow-inner">
              <Search className="w-4 h-4 text-textSecondary mr-3" />
              <input type="text" placeholder="البحث المتقدم (Ctrl+K)..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-textSecondary/50 font-mono" />
              <div className="px-2 py-0.5 bg-surfaceHighlight rounded text-[10px] text-textSecondary font-mono ml-2 border border-white/5">⌘K</div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs font-bold text-success font-mono uppercase tracking-widest">System Operational</span>
            </div>
            
            <div className="w-px h-8 bg-white/[0.05] mx-2"></div>
            
            <button className="relative p-2 text-textSecondary hover:text-white transition-colors">
              <Terminal className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-textSecondary hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,1)]"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Needed for AnimatePresence to work correctly in the sidebar
import { AnimatePresence as FramerAnimatePresence } from 'framer-motion';
const AnimatePresence = FramerAnimatePresence;
