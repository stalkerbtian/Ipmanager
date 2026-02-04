
import React, { useState, useCallback, useMemo } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Search, 
  BarChart3, 
  Globe, 
  Download, 
  AlertTriangle,
  RefreshCw,
  Cpu,
  Brain,
  ShieldCheck,
  Server,
  Activity,
  Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IP2ProxyResult, SecurityInsight } from './types';
import { lookupIp } from './services/mockIpService';
import { analyzeRiskyIps } from './services/geminiService';
import { StatsCard } from './components/StatsCard';
import { IpResultsTable } from './components/IpResultsTable';

const App: React.FC = () => {
  const [ipInput, setIpInput] = useState<string>('8.8.8.8\n1.1.1.1\n185.156.172.1');
  const [results, setResults] = useState<IP2ProxyResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<SecurityInsight[]>([]);

  const handleProcess = useCallback(async () => {
    setIsProcessing(true);
    setInsights([]);
    const ips = ipInput.split(/[\n, ]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    const newResults: IP2ProxyResult[] = [];
    for (const ip of ips) {
      const res = await lookupIp(ip);
      newResults.push(res);
    }
    
    setResults(newResults);
    setIsProcessing(false);
  }, [ipInput]);

  const handleAiAnalysis = useCallback(async () => {
    const risky = results.filter(r => r.isProxy > 0);
    if (risky.length === 0) return;

    setIsAnalyzing(true);
    try {
      const aiInsights = await analyzeRiskyIps(risky);
      setInsights(aiInsights);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [results]);

  const stats = useMemo(() => {
    const total = results.length;
    const clean = results.filter(r => r.isProxy === 0).length;
    const proxies = results.filter(r => r.isProxy === 1).length;
    const vpnDch = results.filter(r => r.isProxy === 2).length;
    const risky = proxies + vpnDch;
    const riskPercentage = total > 0 ? ((risky / total) * 100).toFixed(1) : '0';

    return { total, clean, proxies, vpnDch, risky, riskPercentage };
  }, [results]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    results.forEach(r => {
      counts[r.countryShort] = (counts[r.countryShort] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [results]);

  const exportCsv = () => {
    if (results.length === 0) return;
    const headers = [
      "ipAddress", "isProxy", "proxyType", "countryShort", "countryLong", 
      "region", "city", "isp", "domain", "usageType", "asn", "as", 
      "lastSeen", "threat", "provider", "fraudScore"
    ];
    const csvRows = results.map(r => [
      r.ipAddress, r.isProxy, r.proxyType, r.countryShort, r.countryLong,
      r.region, r.city, r.isp, r.domain, r.usageType, r.asn, r.asName,
      r.lastSeen, r.threat, r.provider, r.fraudScore
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    
    const blob = new Blob([[headers.join(','), ...csvRows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip2proxy_intelligence_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <ShieldAlert size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              IP2Proxy Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportCsv}
              disabled={results.length === 0}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-700 transition-colors text-sm font-medium"
            >
              <Download size={16} />
              Export CSV
            </button>
            <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block"></div>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">PX12 DB v3.0.0</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <Terminal size={18} />
                <h2 className="font-semibold">IP Input Terminal</h2>
              </div>
              <textarea
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="Enter IP addresses (one per line)..."
                className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
              <button
                onClick={handleProcess}
                disabled={isProcessing || !ipInput.trim()}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                {isProcessing ? 'Processing Batch...' : 'Analyze IPs'}
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatsCard label="Total Scanned" value={stats.total} icon={<Activity size={18} />} />
              <StatsCard label="Risky IPs" value={stats.risky} icon={<AlertTriangle size={18} />} color={stats.risky > 0 ? "bg-red-500/5 border-red-500/20" : "bg-slate-800"} />
              <StatsCard label="Clean IPs" value={stats.clean} icon={<ShieldCheck size={18} />} />
              <StatsCard label="Risk Rate" value={`${stats.riskPercentage}%`} icon={<BarChart3 size={18} />} />
            </div>

            {/* Geographical Distribution Chart */}
            {results.length > 0 && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-6 text-emerald-400">
                  <Globe size={18} />
                  <h2 className="font-semibold">Top Locations</h2>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#f1f5f9' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#4f46e5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Results & AI Analysis */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Layers size={16} />
                  <span>Real-time PX12 Database Analysis</span>
                </div>
              </div>
              <button 
                onClick={handleAiAnalysis}
                disabled={isAnalyzing || results.filter(r => r.isProxy > 0).length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <Brain size={16} />}
                Generate Security Insights
              </button>
            </div>

            {/* AI Insights Section */}
            {insights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {insights.map((insight, idx) => (
                  <div key={idx} className="bg-slate-900 border-l-4 border-l-indigo-500 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShieldCheck size={48} className="text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Insight for</span>
                      <span className="mono text-sm bg-slate-800 px-2 py-1 rounded">{insight.ip}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded font-bold ${
                        insight.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        insight.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {insight.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3 leading-relaxed">{insight.summary}</p>
                    <div className="pt-3 border-t border-slate-800">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Cpu size={12} /> Recommendation
                      </h4>
                      <p className="text-sm text-slate-400 italic">{insight.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Results Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={18} className="text-slate-400" />
                  <h3 className="font-semibold">Analysis Results</h3>
                </div>
                <span className="text-xs text-slate-500 italic">Showing {results.length} records</span>
              </div>
              <IpResultsTable results={results} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-xs">
          Powered by IP2Proxy PX12 BIN Database & Google Gemini AI Core
        </p>
      </footer>
    </div>
  );
};

export default App;
