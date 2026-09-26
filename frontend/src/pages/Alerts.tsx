import { useState, useEffect } from 'react';
import { alertService } from '../services/api';
import { Search, Filter, ShieldAlert, Shield, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await alertService.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to load alerts", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return <ShieldAlert className="w-5 h-5 text-critical animate-pulse" />;
      case 'HIGH': return <ShieldAlert className="w-5 h-5 text-high" />;
      case 'MEDIUM': return <Shield className="w-5 h-5 text-warning" />;
      default: return <Activity className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-critical/20 text-critical border-critical/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      case 'ACKNOWLEDGED': return 'bg-warning/20 text-warning border-warning/50';
      case 'INVESTIGATING': return 'bg-primary/20 text-primary border-primary/50';
      case 'RESOLVED': return 'bg-success/20 text-success border-success/50';
      default: return 'bg-white/10 text-textSecondary border-white/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide mb-1 flex items-center gap-3">
            <Target className="w-6 h-6 text-critical" />
            مركز التنبيهات
          </h1>
          <p className="text-primary/70 text-sm font-mono tracking-widest">ACTIVE THREAT ALERTS</p>
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-primary/10 border-b border-primary/30 text-xs text-primary font-bold tracking-widest font-mono">
                <th className="py-4 px-6 text-center w-16">الخطورة</th>
                <th className="py-4 px-6">التنبيه</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6">الأصل المتأثر</th>
                <th className="py-4 px-6">الوقت</th>
                <th className="py-4 px-6">إجراء</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono divide-y divide-primary/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-primary animate-pulse tracking-widest">
                    جاري سحب التنبيهات...
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-textSecondary">
                    النظام آمن. لا توجد تنبيهات حالية.
                  </td>
                </tr>
              ) : (
                alerts.map((alert, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    key={alert.id} className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">{getSeverityIcon(alert.severity)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white group-hover:text-primary transition-colors">{alert.title}</div>
                      <div className="text-xs text-textSecondary mt-1 line-clamp-1">{alert.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-textSecondary">{alert.asset_id ? `Asset-${alert.asset_id}` : 'Multiple'}</td>
                    <td className="py-4 px-6 text-textSecondary text-xs">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-[10px] bg-primary/20 text-primary border border-primary/50 px-3 py-1.5 rounded hover:bg-primary hover:text-black transition-colors font-bold">
                        تحقيق
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
