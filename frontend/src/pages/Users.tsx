import { Users as UsersIcon, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Users() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <UsersIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-black text-white tracking-wide">المستخدمين (USERS)</h1>
      </div>
      <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl p-8 text-center shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <Shield className="w-12 h-12 text-primary/50 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-white mb-2">تهيئة نظام الهويات...</h2>
        <p className="text-textSecondary font-mono text-sm">سيتم عرض قائمة المحللين والمستخدمين وصلاحياتهم قريباً.</p>
      </div>
    </motion.div>
  );
}
