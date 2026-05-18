/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faYoutube, 
} from '@fortawesome/free-brands-svg-icons';
import {
    faLightbulb,
    faMusic,
    faBullseye,
    faRocket,
    faSignInAlt,
    faSignOutAlt,
    faDatabase
} from '@fortawesome/free-solid-svg-icons';
import { auth, signInWithGoogle, logout } from './lib/firebase';
import { SearchBar } from './components/SearchBar';
import { TipsSection } from './components/TipsSection';
import { AssetsSection } from './components/AssetsSection';
import { NichePicker } from './components/NichePicker';
import { StarterGuide } from './components/StarterGuide';
import { AdminPanel } from './components/AdminPanel';
import { cn } from './lib/utils';

type Section = 'starter' | 'tips' | 'assets' | 'niche';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('starter');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(auth.currentUser);

  const isAdmin = user?.email === 'vanguardskaguya@gmail.com';

  useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  const navItems = [
    { id: 'tips', label: 'Tips & Strategy', icon: faLightbulb },
    { id: 'assets', label: 'Sound Drive', icon: faMusic },
    { id: 'starter', label: 'Starter Guide', icon: faRocket },
    { id: 'niche', label: 'Niche Explorer', icon: faBullseye },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-slate-200 font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl flex-col z-20 shrink-0">
        <div className="p-8 text-3xl font-display italic text-white tracking-tighter">
          Fluid<span className="text-red-500 font-sans font-bold not-italic ml-1 text-2xl">Vault</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 ml-4">Main Resources</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border",
                activeSection === item.id 
                  ? "bg-white/5 border-white/10 text-white shadow-lg" 
                  : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <FontAwesomeIcon icon={item.icon} className={cn("transition-colors w-5", activeSection === item.id ? "text-red-500" : "opacity-60")} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl">
            <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">Human Content Only</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Our community is strictly 100% no-AI automation strategies.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col z-10 overflow-hidden bg-slate-950/20">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 backdrop-blur-sm sticky top-0 bg-black/20 lg:bg-transparent">
          <div className="flex-1 max-w-xl">
             <div className="flex items-center gap-4 lg:hidden">
                <div className="text-2xl font-display italic text-white tracking-tighter">
                  Fluid<span className="text-red-500 font-sans font-bold not-italic ml-1 text-xl">Vault</span>
                </div>
             </div>
             <div className="hidden md:block w-full">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Community Member</p>
                  <p className="text-sm font-semibold">{user.displayName}</p>
                </div>
                <div className="group relative">
                  <img src={user.photoURL || ''} alt="avatar" className="w-10 h-10 rounded-full border border-white/10 cursor-pointer" />
                  <button 
                    onClick={logout}
                    className="absolute right-0 top-full mt-2 hidden group-hover:block glass-button text-[10px] py-1 px-3 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="glass-button text-xs py-2 px-6 font-bold uppercase tracking-widest bg-red-500/10 border-red-500/20 text-red-100">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Community Login
              </button>
            )}
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12 pb-24 lg:pb-12">
            <div className="md:hidden">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'starter' && <StarterGuide />}
                {activeSection === 'tips' && <TipsSection searchQuery={searchQuery} />}
                {activeSection === 'assets' && <AssetsSection searchQuery={searchQuery} />}
                {activeSection === 'niche' && <NichePicker />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {isAdmin && <AdminPanel />}

      {/* Mobile Nav */}
      <div className="fixed bottom-6 left-6 right-6 lg:hidden z-50">
        <div className="glass rounded-full flex items-center justify-around p-2 border-white/10 shadow-2xl backdrop-blur-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={cn(
                "p-4 rounded-full transition-all",
                activeSection === item.id ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "text-white/40"
              )}
            >
              <FontAwesomeIcon icon={item.icon} size="lg" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
