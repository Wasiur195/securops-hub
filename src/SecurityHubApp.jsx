import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Globe, 
  FileText, 
  Play, 
  Download, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Layers,
  Settings,
  RefreshCw,
  Clock
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_SITES = [
  {
    id: 1,
    name: 'TechCorp E-Commerce',
    url: 'https://techcorp.com',
    cms: 'WordPress 6.4.2',
    securityScore: 88,
    vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
    lastScan: '2 hours ago',
    status: 'Safe',
    pluginsOutdated: 3,
    sslValid: true,
  },
  {
    id: 2,
    name: 'Fashion Hub BD',
    url: 'https://fashionhub.com.bd',
    cms: 'WordPress 6.1.1',
    securityScore: 54,
    vulnerabilities: { critical: 2, high: 4, medium: 6, low: 2 },
    lastScan: '1 day ago',
    status: 'Vulnerable',
    pluginsOutdated: 12,
    sslValid: true,
  },
  {
    id: 3,
    name: 'FinTech Portal',
    url: 'https://fintechportal.io',
    cms: 'Custom / React',
    securityScore: 96,
    vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 },
    lastScan: '30 mins ago',
    status: 'Safe',
    pluginsOutdated: 0,
    sslValid: true,
  }
];

const SCAN_RESULTS_MOCK = [
  {
    id: 'VULN-01',
    title: 'Outdated Plugin: WooCommerce Core',
    severity: 'High',
    cve: 'CVE-2023-48771',
    description: 'Unauthenticated Remote Code Execution vulnerability found in active version 7.8.0.',
    remediation: 'Update WooCommerce plugin to version 8.2.1 or higher immediately.',
    category: 'WordPress Plugin'
  },
  {
    id: 'VULN-02',
    title: 'Missing Content Security Policy (CSP) Header',
    severity: 'Medium',
    cve: 'N/A',
    description: 'The HTTP header does not restrict resource loading, increasing XSS risks.',
    remediation: 'Configure CSP header on web server or via wp-config.php.',
    category: 'HTTP Headers'
  },
  {
    id: 'VULN-03',
    title: 'WordPress REST API User Enumeration Allowed',
    severity: 'Low',
    cve: 'N/A',
    description: 'Usernames can be listed via /wp-json/wp/v2/users route.',
    remediation: 'Disable REST API public user endpoint using security plugin or code snippet.',
    category: 'Information Disclosure'
  }
];

export default function SecurityHubApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sites, setSites] = useState(INITIAL_SITES);
  const [selectedSite, setSelectedSite] = useState(INITIAL_SITES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Trigger Scanner Simulation
  const handleStartScan = (site) => {
    setSelectedSite(site);
    setActiveTab('scanner');
    setIsScanning(true);
    setScanProgress(10);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">SecurOps Hub</h1>
              <p className="text-xs text-slate-400">Pentest & Audit SaaS</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <SidebarItem 
              icon={<Layers className="w-5 h-5"/>} 
              label="Overview Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={<Globe className="w-5 h-5"/>} 
              label="Client Websites" 
              active={activeTab === 'sites'} 
              onClick={() => setActiveTab('sites')} 
            />
            <SidebarItem 
              icon={<Play className="w-5 h-5"/>} 
              label="Scanner Engine" 
              active={activeTab === 'scanner'} 
              onClick={() => setActiveTab('scanner')} 
            />
            <SidebarItem 
              icon={<FileText className="w-5 h-5"/>} 
              label="Audit Reports" 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')} 
            />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <SidebarItem 
            icon={<Settings className="w-5 h-5"/>} 
            label="Settings & API" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Client Site
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
              WR
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT VIEWS */}
        <div className="p-8 space-y-6">

          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard 
                  title="Monitored Websites" 
                  value={sites.length} 
                  icon={<Globe className="w-6 h-6 text-indigo-400" />} 
                  subText="All active client contracts"
                />
                <MetricCard 
                  title="Average Security Score" 
                  value="79 / 100" 
                  icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />} 
                  subText="+4% from last week"
                />
                <MetricCard 
                  title="Critical Vulnerabilities" 
                  value="2 Detected" 
                  icon={<ShieldAlert className="w-6 h-6 text-rose-500" />} 
                  subText="Action required in 1 site"
                />
                <MetricCard 
                  title="Scans Done Today" 
                  value="14" 
                  icon={<Clock className="w-6 h-6 text-amber-400" />} 
                  subText="Automated CRON active"
                />
              </div>

              {/* SITES QUICK STATUS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Client Websites Status</h3>
                  <button onClick={() => setActiveTab('sites')} className="text-sm text-indigo-400 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="p-3">Website</th>
                        <th className="p-3">Platform</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Last Scan</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {sites.map((site) => (
                        <tr key={site.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-medium text-white flex items-center gap-2">
                            {site.name}
                            <a href={site.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                          <td className="p-3 text-slate-400">{site.cms}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              site.securityScore > 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              site.securityScore > 60 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}>
                              {site.securityScore} / 100
                            </span>
                          </td>
                          <td className="p-3">
                            {site.status === 'Safe' ? (
                              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4"/> Safe
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
                                <AlertTriangle className="w-4 h-4"/> Vulnerable
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400">{site.lastScan}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleStartScan(site)}
                              className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-xs transition"
                            >
                              Run Scan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: SITES MANAGER */}
          {activeTab === 'sites' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search client sites..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sites.map((site) => (
                  <div key={site.id} className="p-5 border border-slate-800 rounded-xl bg-slate-950/50 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">{site.name}</h4>
                        <p className="text-xs text-slate-400">{site.url}</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-full text-slate-300 border border-slate-700">
                        {site.cms}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block">Outdated Plugins:</span>
                        <span className="font-semibold text-slate-200">{site.pluginsOutdated} Plugins</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">SSL Certificate:</span>
                        <span className="font-semibold text-emerald-400">Valid (240 Days left)</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Critical Issues:</span>
                        <span className="text-xs font-bold text-rose-400">{site.vulnerabilities.critical}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedSite(site); setActiveTab('reports'); }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition"
                        >
                          Report
                        </button>
                        <button 
                          onClick={() => handleStartScan(site)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition flex items-center gap-1"
                        >
                          <Play className="w-3 h-3"/> Scan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: VULNERABILITY SCANNER ENGINE */}
          {activeTab === 'scanner' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Automated Pentest & Security Audit Engine</h3>
                    <p className="text-xs text-slate-400">Target: <span className="text-indigo-400 font-mono">{selectedSite.url}</span></p>
                  </div>
                  <button 
                    onClick={() => handleStartScan(selectedSite)} 
                    disabled={isScanning}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-sm rounded-lg transition flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning Target...' : 'Re-Run Automated Scan'}
                  </button>
                </div>

                {/* PROGRESS BAR */}
                {isScanning && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Scanning WP Core, CVE Database, Headers & SSL...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* DETECTED VULNERABILITIES LIST */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h4 className="text-md font-semibold text-white mb-4">Audit Results & Vulnerability Findings</h4>
                <div className="space-y-4">
                  {SCAN_RESULTS_MOCK.map((vuln) => (
                    <div key={vuln.id} className="p-4 border border-slate-800 bg-slate-950/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            vuln.severity === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            vuln.severity === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {vuln.severity}
                          </span>
                          <h5 className="font-semibold text-white text-sm">{vuln.title}</h5>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{vuln.cve}</span>
                      </div>
                      <p className="text-xs text-slate-300">{vuln.description}</p>
                      <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg text-xs text-emerald-400 font-mono">
                        <span className="text-slate-500 block font-sans font-semibold mb-1">Recommended Action / Remediation:</span>
                        {vuln.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: CLIENT-READY AUDIT REPORT GENERATOR */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-xl">
                <div>
                  <h3 className="font-bold text-white">Client Audit Report Generator</h3>
                  <p className="text-xs text-slate-400">Export white-label security report for {selectedSite.name}</p>
                </div>
                <button 
                  onClick={() => window.print()} 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export PDF Report
                </button>
              </div>

              {/* REPORT PREVIEW (PRINTABLE WHITE-LABEL LAYOUT) */}
              <div className="bg-white text-slate-900 p-10 rounded-xl shadow-2xl space-y-8 max-w-4xl mx-auto border border-slate-200">
                {/* REPORT HEADER */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Website Security Audit Report</h1>
                    <p className="text-sm text-slate-500">Prepared by: SecurOps Managed Cyber Security</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Date Generated</span>
                    <span className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* EXECUTIVE SUMMARY */}
                <div className="space-y-3">
                  <h3 className="text-md font-bold text-slate-800 border-l-4 border-indigo-600 pl-3">Executive Summary</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This security assessment was performed for <strong className="text-slate-900">{selectedSite.name}</strong> ({selectedSite.url}). 
                    Our automated scanning engine and pentesting vulnerability checks evaluated core system integrity, outdated components, security headers, and known CVE database vectors.
                  </p>
                </div>

                {/* AUDIT METRICS */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Security Score</span>
                    <p className="text-2xl font-black text-indigo-600">{selectedSite.securityScore} / 100</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Target Platform</span>
                    <p className="text-lg font-bold text-slate-800">{selectedSite.cms}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Total Issues Found</span>
                    <p className="text-2xl font-black text-rose-600">{SCAN_RESULTS_MOCK.length}</p>
                  </div>
                </div>

                {/* FINDINGS TABLE */}
                <div className="space-y-4">
                  <h3 className="text-md font-bold text-slate-800 border-l-4 border-indigo-600 pl-3">Vulnerability Assessment Findings</h3>
                  <div className="space-y-3">
                    {SCAN_RESULTS_MOCK.map((item, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-1 bg-slate-50/50">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-slate-800">{idx + 1}. {item.title}</span>
                          <span className={`text-xs px-2 py-0.5 font-bold rounded ${
                            item.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.severity} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{item.description}</p>
                        <div className="mt-2 text-xs text-slate-700 font-semibold bg-white p-2 rounded border border-slate-200">
                          Fix: {item.remediation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
                  Confidential Document — Generated for {selectedSite.name} © {new Date().getFullYear()}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        active 
          ? 'bg-indigo-600 text-white' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MetricCard({ title, value, icon, subText }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <p className="text-xs text-slate-500">{subText}</p>
    </div>
  );
}