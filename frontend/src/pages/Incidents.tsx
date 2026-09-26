import { useState, useEffect } from 'react';
import { incidentService } from '../services/api';
import { Crosshair, ShieldAlert, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await incidentService.getIncidents();
        setIncidents(data);
      } catch (error) {
        console.error("Failed to load incidents", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-critical/20 text-critical border-critical/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      case 'INVESTIGATING': return 'bg-warning/20 text-warning border-warning/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
      case 'CONTAINED': return 'bg-primary/20 text-primary border-primary/50';
      case 'RESOLVED': return 'bg-success/20 text-success border-success/50';
      default: return 'bg-white/10 text-textSecondary border-white/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide mb-1 flex items-center gap-3">
            <Crosshair className="w-6 h-6 text-warning" />
            إدارة الحوادث
          </h1>
          <p className="text-primary/70 text-sm font-mono tracking-widest">INCIDENT RESPONSE CENTER</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="bg-black/60 border border-primary/20 rounded-xl p-8 text-center text-primary animate-pulse font-mono tracking-widest">
            جاري سحب بيانات الحوادث...
          </div>
        ) : incidents.length === 0 ? (
          <div className="bg-black/60 border border-primary/20 rounded-xl p-8 text-center text-textSecondary font-mono">
            لا توجد حوادث أمنية نشطة.
          </div>
        ) : (
          incidents.map((incident, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
              key={incident.id} 
              className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl p-6 shadow-[0_0_15px_rgba(0,255,65,0.02)] hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] hover:border-primary/50 transition-all group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                    <span className="text-xs font-mono text-textSecondary">INC-{1000 + incident.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{incident.title}</h2>
                  <p className="text-sm text-textSecondary line-clamp-2">{incident.description}</p>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 min-w-[200px] justify-between lg:justify-center border-t lg:border-t-0 lg:border-r border-white/10 pt-4 lg:pt-0 lg:pr-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-textSecondary uppercase tracking-widest mb-1">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-white/5 rounded-full h-2 max-w-[100px]">
                        <div className="bg-critical h-2 rounded-full" style={{ width: `${incident.risk_score}%` }}></div>
                      </div>
                      <span className="text-critical font-bold font-mono">{incident.risk_score}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-textSecondary font-mono">
                      <Clock className="w-3 h-3 text-primary" />
                      {new Date(incident.created_at).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-textSecondary font-mono">
                      <User className="w-3 h-3 text-primary" />
                      {incident.assigned_to_id ? `Analyst-${incident.assigned_to_id}` : 'Unassigned'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                   <button className="w-full lg:w-auto bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-black font-bold py-2 px-6 rounded-lg transition-colors tracking-widest text-sm">
                     فتح غرفة العمليات
                   </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
