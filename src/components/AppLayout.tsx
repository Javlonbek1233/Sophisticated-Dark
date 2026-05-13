import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout, User, Code2, MessageSquare, Award, FolderKanban, LogOut, Search, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex text-gray-100 selection:bg-neon-cyan selection:text-black">
      <div className="neon-gradient-bg" />
      <div className="neon-orb w-[500px] h-[500px] bg-neon-cyan -top-48 -left-48" />
      <div className="neon-orb w-[400px] h-[400px] bg-neon-purple -bottom-48 -right-48" />

      {/* Sidebar */}
      <aside className="w-64 glass-card h-[calc(100vh-2rem)] sticky top-4 left-4 ml-4 my-4 flex flex-col p-6 gap-8 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center border border-neon-cyan/50">
            <Code2 className="text-neon-cyan" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tighter neon-text-glow">DEVCONNECT</span>
        </Link>

        <nav className="flex flex-col gap-2">
          <NavItem to="/" icon={<Layout size={20} />} label="Feed" active={location.pathname === '/'} />
          <NavItem to="/profile" icon={<User size={20} />} label="Profile" active={location.pathname === '/profile'} />
          <NavItem to="/ranking" icon={<Award size={20} />} label="Ranking" active={location.pathname === '/ranking'} />
          <NavItem to="/projects" icon={<FolderKanban size={20} />} label="Showcase" active={location.pathname === '/projects'} />
          <NavItem to="/chat" icon={<MessageSquare size={20} />} label="Chat" active={location.pathname === '/chat'} />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
            <img 
              src={profile?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev"} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-neon-cyan/50"
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm truncate">{profile?.username || "Developer"}</span>
              <span className="text-[10px] text-neon-cyan font-mono">{profile?.rankingPoints || 0} pts</span>
            </div>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 p-2 text-gray-400 hover:text-neon-pink transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span className="text-sm font-mono tracking-widest uppercase">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 p-4 min-h-screen">
        <header className="h-16 glass-card flex items-center justify-between px-8 z-40 sticky top-4 mb-4">
          <div className="flex items-center gap-4 bg-black/40 rounded-full px-4 py-2 border border-white/5 min-w-[300px]">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Searching the matrix..." 
              className="bg-transparent border-none outline-none text-sm w-full font-mono placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-neon-cyan transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_8px_#FF00E5]" />
            </button>
            <button className="neon-button">UPLOAD PROJECT</button>
          </div>
        </header>

        <div className="flex-1 max-w-[1200px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, active = false }: { to: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 4 }}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
          active 
          ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        {icon}
        <span className="font-mono text-xs tracking-widest uppercase">{label}</span>
        {active && (
          <motion.div 
            layoutId="active-pill"
            className="ml-auto w-1 h-4 bg-neon-cyan rounded-full shadow-[0_0_10px_#00F5FF]" 
          />
        )}
      </motion.div>
    </Link>
  );
}
