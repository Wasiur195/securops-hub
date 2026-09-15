import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Globe, 
  Play, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  RotateCw, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  ChevronDown,
  ShieldCheck,
  Clock,
  Download,
  ExternalLink,
  CheckCircle2,
  LogOut,
  X,
  Lock,
  Mail,
  User
} from 'lucide-react';

const INITIAL_SITES = [
  {
    id: 1,
    name: 'TechCorp E-Commerce',
    url: 'https://techcorp.com',
    cms: 'WordPress 6.4.2',
    securityScore: 88,
    status: 'Safe',
    pluginsOutdated: 3,
    lastScan: '2 hours ago'
  },
  {
    id: 2,
    name: 'Fashion Hub BD',
    url: 'https://fashionhub.com.bd',
    cms: 'WordPress 6.1.1',
    securityScore: 54,
    status: 'Vulnerable',
    pluginsOutdated: 12,
    lastScan: '1 day ago'
  }
];

export default function App() {
  // --- AUTH & STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || { name: 'Admin User', email: 'admin@securops.io' };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sites, setSites] = useState(() => {
    const saved = localStorage.getItem('client_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });
  const [selectedSite, setSelectedSite] = useState(INITIAL_SITES[0]);
  const [isScanning, setIsScanning] = useState(false);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({ name: '', url: '', cms: 'WordPress 6.4.2' });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('client_sites', JSON.stringify(sites));
  }, [sites]);

  // Auth Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(currentUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  // Add Client Handler
  const handleAddSite = (e) => {
    e.preventDefault();
    if (!newSite.name || !newSite.url) return;

    const createdSite = {
      id: Date.now(),
      name: newSite.name,
      url: newSite.url.startsWith('http') ? newSite.url : `https://${newSite.url}`,
      cms: newSite.cms,
      securityScore: Math.floor(Math.random() * (95 - 65 + 1)) + 65,
      status: 'Safe',
      pluginsOutdated: 1,
      lastScan: 'Just now'
    };

    setSites([createdSite, ...sites]);
    setSelectedSite(createdSite);
    setNewSite({ name: '', url: '', cms: 'WordPress 6.4.2' });
    setIsAddModalOpen(false);
  };

  // ----------------------------------------------------
  // 1. LOGIN / SIGNUP SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">SecurOps Hub</h2>
            <p className="text-xs text-slate-400">
              {authMode === 'login' ? 'Sign in to access your Security Dashboard' : 'Create an account for Client Security Audit'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    required
                    placeholder="Wasiur Rahman" 
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition shadow-lg shadow-blue-600/20">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            {authMode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-blue-400 hover:underline font-semibold">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setAuthMode('login')} className="text-blue-400 hover:underline font-semibold">Sign In</button></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. MAIN DASHBOARD & APP INTERFACE
  // ----------------------------------------------------
  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">SecurOps Hub</span>
          </div>

          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={<Globe className="w-4 h-4" />} label="Client Websites" active={activeTab === 'sites'} onClick={() => setActiveTab('sites')} />
            <NavItem icon={<Play className="w-4 h-4" />} label="Scanner Engine" active={activeTab === 'scanner'} onClick={() => setActiveTab('scanner')} />
            <NavItem icon={<FileText className="w-4 h-4" />} label="Audit Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#0b0f19]">
        
        {/* TOP BAR */}
        <header className="h-16 bg-[#111827]/80 border-b border-slate-800 px-6 flex items-center justify-between backdrop-blur sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-white capitalize">{activeTab}</h1>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" /> Add Client Site
            </button>
            
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-200">{currentUser.name}</span>
            </div>
          </div>
        </header>

        {/* CONTENT DYNAMICS */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <MetricCard title="Monitored Websites" value={sites.length} icon={<Globe className="w-5 h-5 text-blue-400" />} subText="Active client sites" />
                <MetricCard title="Avg Security Score" value="82 / 100" icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} subText="+6% overall rating" />
                <MetricCard title="Critical Issues" value="1 Alert" icon={<ShieldAlert className="w-5 h-5 text-red-400" />} subText="Action needed" />
                <MetricCard title="Scans Today" value="8 Runs" icon={<Clock className="w-5 h-5 text-amber-400" />} subText="Automated daily check" />
              </div>

              {/* CLIENT TABLE */}
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4">Client Websites List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Website Name</th>
                        <th className="p-3">Platform</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {sites.map((site) => (
                        <tr key={site.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-white">{site.name} <span className="block text-[10px] text-slate-500 font-mono">{site.url}</span></td>
                          <td className="p-3 text-slate-400">{site.cms}</td>
                          <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 rounded">{site.securityScore}/100</span></td>
                          <td className="p-3 text-emerald-400">{site.status}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => { setSelectedSite(site); setActiveTab('scanner'); }} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-xs">
                              Scan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SITES TAB */}
          {activeTab === 'sites' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sites.map((site) => (
                <div key={site.id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white">{site.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{site.url}</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">{site.cms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button onClick={() => { setSelectedSite(site); setActiveTab('scanner'); }} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                      Open Scanner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SCANNER TAB */}
          {activeTab === 'scanner' && (
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Target: {selectedSite.name} ({selectedSite.url})</h2>
              <button onClick={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 2000); }} className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2">
                <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Run Pentest Check'}
              </button>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="bg-white text-slate-900 p-8 rounded-xl max-w-3xl mx-auto space-y-4">
              <h2 className="text-xl font-bold border-b pb-2">Audit Report: {selectedSite.name}</h2>
              <p className="text-xs text-slate-600">Target URL: {selectedSite.url}</p>
              <p className="text-xs font-bold text-emerald-600">Security Rating: {selectedSite.securityScore}/100</p>
              <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white text-xs rounded-lg">Print PDF</button>
            </div>
          )}

        </div>
      </main>

      {/* ---------------------------------------------------- */}
      {/* 3. ADD NEW CLIENT SITE MODAL */}
      {/* ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Add New Client Website</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSite} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Client Business / Site Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Apex Pharma BD" 
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Website URL</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. https://apexpharma.com" 
                  value={newSite.url}
                  onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Platform / CMS</label>
                <select 
                  value={newSite.cms}
                  onChange={(e) => setNewSite({ ...newSite, cms: e.target.value })}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="WordPress 6.4.2">WordPress</option>
                  <option value="Custom / React">Custom / React</option>
                  <option value="Shopify / Laravel">Laravel / PHP</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="w-1/2 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-500"
                >
                  Add Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
        active 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MetricCard({ title, value, icon, subText }) {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-2 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className="text-[11px] text-slate-500">{subText}</p>
    </div>
  );
}