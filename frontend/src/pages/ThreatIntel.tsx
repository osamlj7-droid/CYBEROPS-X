import { Globe, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThreatIntel() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-black text-white tracking-wide">الاستخبارات (THREAT INTEL)</h1>
      </div>
      <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl p-8 text-center shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <ShieldAlert className="w-12 h-12 text-primary/50 mx-auto mb-4 animate-[spin_3s_linear_infinite]" />
        <h2 className="text-xl font-bold text-white mb-2">جاري الاتصال بقواعد البيانات العالمية...</h2>
        <p className="text-textSecondary font-mono text-sm">سيتم جلب وتحليل مؤشرات الاختراق (IOCs) قريباً.</p>
      </div>
    </motion.div>
  );
}
