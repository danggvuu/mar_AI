'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'login' | 'register' | 'forgot';

interface FormState {
  loading: boolean;
  error: string;
  success: string;
}

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('login');
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
    success: '',
  });

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Forgot form
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.tab) setTab(detail.tab as Tab);
      setOpen(true);
      setFormState({ loading: false, error: '', success: '' });
    };
    const handleOpenTab = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.tab) setTab(detail.tab as Tab);
      setOpen(true);
      setFormState({ loading: false, error: '', success: '' });
    };

    window.addEventListener('open-auth', handleOpen);
    window.addEventListener('open-auth-tab', handleOpenTab);
    return () => {
      window.removeEventListener('open-auth', handleOpen);
      window.removeEventListener('open-auth-tab', handleOpenTab);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const resetForm = () =>
    setFormState({ loading: false, error: '', success: '' });

  const handleTabChange = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ loading: true, error: '', success: '' });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      if (data.token) localStorage.setItem('acc_token', data.token);
      setFormState({ loading: false, error: '', success: 'Đăng nhập thành công!' });
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      setFormState({
        loading: false,
        error: err instanceof Error ? err.message : 'Có lỗi xảy ra',
        success: '',
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setFormState({ loading: false, error: 'Mật khẩu xác nhận không khớp', success: '' });
      return;
    }
    setFormState({ loading: true, error: '', success: '' });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regName,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      if (data.token) localStorage.setItem('acc_token', data.token);
      setFormState({ loading: false, error: '', success: 'Đăng ký thành công! Đang chuyển hướng...' });
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1200);
    } catch (err: unknown) {
      setFormState({
        loading: false,
        error: err instanceof Error ? err.message : 'Có lỗi xảy ra',
        success: '',
      });
    }
  };

  const inputCls =
    'w-full bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#ee8722] transition-colors';
  const labelCls = 'block text-xs font-medium text-[#94a3b8] mb-1.5';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl border border-[#334155] overflow-hidden"
          >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span className="font-bold text-[#ee8722]">AccStore</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-6 mt-4 border-b border-[#334155]">
          {(
            [
              { key: 'login', label: 'Đăng nhập' },
              { key: 'register', label: 'Đăng ký' },
              { key: 'forgot', label: 'Quên mật khẩu' },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === t.key
                  ? 'border-[#ee8722] text-[#ee8722]'
                  : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Alerts */}
          {formState.error && (
            <div className="mb-4 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm">
              {formState.error}
            </div>
          )}
          {formState.success && (
            <div className="mb-4 p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm">
              {formState.success}
            </div>
          )}

          {/* Login */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={formState.loading}
                className="w-full bg-[#ee8722] hover:bg-[#f5a23f] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {formState.loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>
              <p className="text-center text-[#94a3b8] text-sm">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="text-[#ee8722] hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* Register */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={labelCls}>Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={formState.loading}
                className="w-full bg-[#ee8722] hover:bg-[#f5a23f] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {formState.loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Tạo tài khoản'
                )}
              </button>
            </form>
          )}

          {/* Forgot */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Email của bạn</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="p-4 rounded-lg bg-[#ee8722]/10 border border-[#ee8722]/30 text-[#ee8722] text-sm text-center">
                ⏳ Chức năng sắp có — Vui lòng liên hệ hotline{' '}
                <a href="tel:0963973205" className="font-semibold underline">
                  0963 973 205
                </a>{' '}
                để được hỗ trợ.
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
