import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { Search, Filter, Download, Activity, ShieldAlert, Shield, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents(0, 50);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return <ShieldAlert className="w-4 h-4 text-critical" />;
      case 'HIGH': return <ShieldAlert className="w-4 h-4 text-high" />;
      case 'MEDIUM': return <Shield className="w-4 h-4 text-warning" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-critical/20 text-critical border-critical/50';
      case 'HIGH': return 'bg-high/20 text-high border-high/50';
      case 'MEDIUM': return 'bg-warning/20 text-warning border-warning/50';
      default: return 'bg-primary/20 text-primary border-primary/50';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide mb-1 flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            سجل الأحداث الأمنية
          </h1>
          <p className="text-primary/70 text-sm font-mono tracking-widest">LIVE SECURITY EVENTS STREAM</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-primary/50 absolute top-1/2 -translate-y-1/2 right-3" />
            <input 
              type="text" 
              placeholder="البحث في الأحداث..." 
              className="w-full bg-black/40 border border-primary/30 rounded-lg pr-9 pl-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono transition-colors"
            />
          </div>
          <button className="bg-black/40 border border-primary/30 hover:bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> فلاتر
          </button>
          <button className="bg-black/40 border border-primary/30 hover:bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-primary/10 border-b border-primary/30 text-xs text-primary font-bold tracking-widest font-mono">
                <th className="py-4 px-6 text-center w-16">الحالة</th>
                <th className="py-4 px-6">الحدث</th>
                <th className="py-4 px-6">المصدر</th>
                <th className="py-4 px-6">الوجهة</th>
                <th className="py-4 px-6">المستخدم</th>
                <th className="py-4 px-6">الوقت</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono divide-y divide-primary/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-primary animate-pulse tracking-widest">
                    جاري سحب البيانات من الخادم...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-textSecondary">
                    لا توجد أحداث مسجلة في قاعدة البيانات.
                  </td>
                </tr>
              ) : (
                events.map((event, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={event.id} 
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-6 text-center">
                      <div className={`inline-flex items-center justify-center p-1.5 rounded border ${getSeverityColor(event.severity)}`}>
                        {getSeverityIcon(event.severity)}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-bold text-white group-hover:text-primary transition-colors">{event.name}</div>
                      <div className="text-xs text-textSecondary mt-0.5">{event.event_type}</div>
                    </td>
                    <td className="py-3 px-6 text-textSecondary">{event.source_ip || '---'}</td>
                    <td className="py-3 px-6 text-textSecondary">{event.destination_ip || '---'}</td>
                    <td className="py-3 px-6 text-textSecondary">{event.user_id ? `User-${event.user_id}` : 'System'}</td>
                    <td className="py-3 px-6 text-textSecondary text-xs">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-black/40 border-t border-primary/20 p-4 flex items-center justify-between text-xs text-textSecondary font-mono">
          <div>يعرض {events.length} من الأحداث (الـ 24 ساعة الماضية)</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-black border border-primary/30 hover:text-primary hover:border-primary disabled:opacity-50" disabled>السابق</button>
            <button className="px-3 py-1 rounded bg-black border border-primary/30 hover:text-primary hover:border-primary">التالي</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
