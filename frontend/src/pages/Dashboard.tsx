import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Database, Zap, Terminal, Globe, Crosshair } from 'lucide-react';
import { dashboardService } from '../services/api';
import { useAuth } from '../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThreatMap from '../components/ThreatMap';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  
  // Fake data for the matrix stream
  const [codeLines, setCodeLines] = useState<string[]>([
    "INIT SYSTEM KERNEL... OK",
    "ESTABLISHING SECURE CONNECTION...",
    "NODE [Alpha-7] ONLINE"
  ]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchSummary();

    // Matrix Code Stream Effect
    const interval = setInterval(() => {
      setCodeLines(prev => {
        const ips = ["192.168.1.105", "10.0.0.4", "172.16.0.8", "45.33.22.11", "8.8.8.8"];
        const actions = ["SCANNING", "BLOCKED", "BYPASSED", "ANALYZING", "DECRYPTING"];
        const newCode = `[${new Date().toISOString().split('T')[1].substring(0,8)}] ${actions[Math.floor(Math.random()*actions.length)]} ${ips[Math.floor(Math.random()*ips.length)]} : SYS_OP_${Math.floor(Math.random()*9999)}`;
        return [...prev.slice(-8), newCode]; // Keep last 9 lines
      });
    }, 800);

    return () => clearInterval(interval);
  }, [token]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <div className="text-primary font-mono tracking-widest animate-pulse">INITIALIZING CYBERSPACE...</div>
      </div>
    );
  }

  const kpis = [
    { name: 'الأحداث المراقبة', value: summary?.events_today?.toLocaleString() || '0', icon: Activity, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
    { name: 'تنبيهات حرجة', value: summary?.critical_alerts?.toString().padStart(2, '0') || '00', icon: AlertTriangle, color: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/30' },
    { name: 'حوادث نشطة', value: summary?.open_incidents?.toString().padStart(2, '0') || '00', icon: ShieldCheck, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
    { name: 'الأصول المحمية', value: summary?.monitored_assets?.toString() || '0', icon: Database, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Top Counters HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((stat, idx) => (
          <div key={stat.name} className={`bg-surface/40 backdrop-blur-md border ${stat.border} rounded-lg p-4 flex items-center justify-between relative overflow-hidden group`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]`}></div>
            <div>
              <div className="text-textSecondary text-[10px] font-bold uppercase tracking-widest mb-1">{stat.name}</div>
              <div className="text-2xl font-black text-white font-mono">{stat.value}</div>
            </div>
            <div className={`p-2 rounded ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        
        {/* Dynamic Threat Map Panel */}
        <div className="lg:col-span-2 bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl p-1 relative overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,255,65,0.05)]">
          <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-black/20 z-20 relative">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-widest uppercase">
              <Globe className="w-4 h-4 text-primary" /> GLOBAL THREAT INTELLIGENCE MAP
            </h2>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-critical animate-ping"></span>
              <span className="text-[10px] text-critical font-mono">LIVE TRACKING</span>
            </div>
          </div>
          
          <div className="flex-1 relative bg-black overflow-hidden">
             <ThreatMap />
          </div>
        </div>

        {/* Matrix Code Stream & Radar */}
        <div className="flex flex-col gap-4">
          
          {/* Radar / Target Scanner */}
          <div className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-1/2">
            <h2 className="absolute top-3 left-4 text-[10px] font-bold text-textSecondary flex items-center gap-2">
              <Crosshair className="w-3 h-3 text-warning" /> SCANNER ACTIVE
            </h2>
            <div className="w-32 h-32 rounded-full border border-primary/30 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping"></div>
              <div className="absolute w-full h-1 bg-primary/50 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(0,212,255,1)] animate-[spin_2s_linear_infinite]"></div>
              <div className="absolute w-1 h-full bg-primary/50 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(0,212,255,1)]"></div>
              <Activity className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>

          {/* Terminal Stream */}
          <div className="bg-[#050810] border border-white/10 rounded-xl p-4 flex flex-col h-1/2 relative overflow-hidden">
            <h2 className="text-[10px] font-bold text-success flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
              <Terminal className="w-3 h-3" /> SYSTEM TELEMETRY
            </h2>
            <div className="flex-1 overflow-hidden flex flex-col justify-end font-mono text-[10px] space-y-1">
              <AnimatePresence>
                {codeLines.map((line, i) => (
                  <motion.div
                    key={i + line}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${line.includes('BLOCKED') ? 'text-critical' : line.includes('SCANNING') ? 'text-warning' : 'text-primary'}`}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Terminal Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-50"></div>
          </div>

        </div>
      </div>
      
    </motion.div>
  );
}
