'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Shield, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { emailRegex } from '@/lib/auth/validation';

const resetSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
});

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const json = await res.json();
        setError(json.error || 'Failed to send reset email.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <button 
          onClick={() => router.push('/auth')}
          className="flex items-center gap-2 text-muted-silver hover:text-white transition-colors mb-8 group text-sm font-bold"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6 glow-node">
              <Mail className="text-primary" size={28} />
            </div>
            <h1 className="text-3xl font-bold font-tight text-white mb-3">Reset Secret</h1>
            <p className="text-muted-silver text-sm">We'll send a secure link to your verified email.</p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
              >
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    {...register('email')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-surface-lighter outline-none focus:border-primary transition-all text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] px-4 font-bold uppercase tracking-wider">{errors.email.message as string}</p>}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-red-500 text-xs font-medium">{error}</p>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-primary hover:bg-white text-black font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Send Reset Link"}
                  {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-white">Check Your Inbox</h2>
                <p className="text-muted-silver text-sm leading-relaxed">
                  If an account exists for that email, we've sent instructions to reset your secret phrase.
                </p>
                <button 
                  onClick={() => router.push('/auth')}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Return to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
