import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { Shield, Lock, User, Fingerprint, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
      const response = await axios.post(`${apiUrl}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // Artificial delay for luxurious animation effect
      setTimeout(async () => {
        try {
          await login(response.data.access_token);
        } catch (e) {
          setIsAuthenticating(false);
          setError('فشل في جلب بيانات المستخدم بعد تسجيل الدخول.');
        }
      }, 800);
      
    } catch (err) {
      setTimeout(() => {
        setIsAuthenticating(false);
        setError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4 font-sans" dir="rtl" translate="no">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="radar-sweep opacity-40"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface/80 backdrop-blur-xl border border-surfaceHighlight/50 rounded-2xl shadow-2xl p-8 shadow-primary/10 relative overflow-hidden">
          
          {/* Top glowing line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

          <div className="flex flex-col items-center mb-10 mt-2">
            <motion.div 
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-surfaceHighlight/50 border border-primary/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 relative"
            >
              <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse"></div>
              <Shield className="text-primary w-10 h-10" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wide mb-2">
              سايبر أوبس إكس
            </h1>
            <p className="text-primary/80 text-sm tracking-widest uppercase font-mono">
              منصة العمليات الأمنية الموحدة
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-critical/10 border border-critical/30 text-critical px-4 py-3 rounded-xl mb-6 flex items-center text-sm"
            >
              <Lock className="w-4 h-4 ml-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">اسم المستخدم</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  dir="ltr"
                  className="w-full bg-background/50 border border-surfaceHighlight rounded-xl pl-4 pr-11 py-3 text-textPrimary text-left focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={isAuthenticating}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  dir="ltr"
                  className="w-full bg-background/50 border border-surfaceHighlight rounded-xl pl-4 pr-11 py-3 text-textPrimary text-left focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isAuthenticating}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isAuthenticating}
              className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-lg py-3.5 rounded-xl transition-all shadow-lg shadow-primary/25 mt-8 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isAuthenticating ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-3"></div>
                  جارٍ المصادقة...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  دخول آمن
                  <ChevronLeft className="w-5 h-5 mr-2 opacity-70 group-hover:-translate-x-1 transition-transform" />
                </div>
              )}
            </motion.button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-surfaceHighlight/30 text-center">
            <p className="text-textSecondary/70 text-xs font-mono">
              <span className="text-primary/70">حساب الإدارة:</span> admin / admin123<br/>
              <span className="text-success/70">حساب المحلل:</span> analyst1 / analyst123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
