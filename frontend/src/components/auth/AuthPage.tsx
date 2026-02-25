'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Wallet as WalletIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User,
  Zap
} from 'lucide-react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from '@/lib/auth/validation';
import { useWallet } from '@/providers/WalletProvider';
import { Avatar } from '@/components/ui/Avatar';

interface AuthPageProps {
  onSuccess?: () => void;
  hideHeader?: boolean;
  isLogin?: boolean;
}

export default function AuthPage({ 
  onSuccess, 
  hideHeader = false,
  isLogin: initialIsLogin = true 
}: AuthPageProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { connectStacks, hasWallet, isUnlocked, unlockWallet, deleteWallet, address, isLoading: walletLoading } = useWallet();
  
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthAttempting, setIsAuthAttempting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnlockPhase = hasWallet && !isUnlocked && sessionStatus === "authenticated";

  React.useEffect(() => {
    // Only attempt auto-login if not already authenticated and not currently attempting
    if (hasWallet && address && !walletLoading && sessionStatus === "unauthenticated" && !isAuthAttempting) {
      console.log("[Auth] Protocol detected in environment. Initiating handshake...");
      setIsAuthAttempting(true);
      signIn('credentials', { 
        address, 
        loginType: 'wallet',
        redirect: false,
        callbackUrl: '/onboarding'
      }).then((res) => {
        if (!res?.error) {
           console.log("[Auth] Handshake verified.");
           if (onSuccess) onSuccess();
           else router.push('/onboarding');
        } else {
           console.error("[Auth] Handshake refused:", res.error);
           setError("Handshake refused by protocol. Please try again manually.");
           setIsAuthAttempting(false);
        }
      });
    }
  }, [hasWallet, address, walletLoading, sessionStatus, onSuccess, router, isAuthAttempting]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<any>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: 'onChange'
  });

  const handleHardReset = async () => {
    if (confirm("WARNING: This will permanently delete your local vault and log you out. You MUST have your 12-word recovery phrase to regain access. Continue?")) {
      await deleteWallet();
      await signOut({ callbackUrl: '/' });
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isUnlockPhase) {
        const success = await unlockWallet(data.password);
        if (success) {
          if (onSuccess) onSuccess();
          else router.push('/dashboard');
        } else {
          setError('Incorrect vault password. Please try again.');
        }
        return;
      }

      if (isLogin) {
        const result = await signIn('credentials', {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid credentials. Please try again.');
        } else {
          if (onSuccess) onSuccess();
          else router.push('/onboarding');
        }
      } else {
        // Sign up flow
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const json = await res.json();

        if (res.ok) {
          // Auto sign-in after signup
          if (hasWallet) {
              await deleteWallet(); // Ensure clean vault for new user
          }

          // Important: NextAuth Credentials provider expects 'username' as the key
          // We use the email they just signed up with to log them in automatically
          const signInRes = await signIn('credentials', {
            username: data.email,
            password: data.password,
            redirect: false,
          });
          
          if (signInRes?.error) {
            setError(`Account created for ${data.email}, but auto-login failed. Please log in manually.`);
            setIsLogin(true);
            reset({ username: data.email }, { keepDefaultValues: false });
          } else {
             // Success! The router.push will happen naturally via the Onboarding check or here
             if (onSuccess) onSuccess();
             else router.push('/onboarding');
          }
        } else {
          // Enhanced error handling for common signup issues
          const errorMessage = json.error || (json.details ? "Invalid registration data." : "Signup failed.");
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("Auth submission error:", err);
      setError('A connection error occurred. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: '/onboarding' });
  };

  return (
    <div className={`min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden ${hideHeader ? 'py-0' : ''}`}>
      {/* Dynamic Ambient Background - Muted */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/2 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/2 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {!hideHeader && (
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-lg"
            >
              <Shield className="text-primary" size={28} />
            </motion.div>
            <h1 className="text-4xl font-bold font-tight text-white mb-3">
              {isUnlockPhase ? 'Vault Locked' : 'Ironclad Vault'}
            </h1>
            <p className="text-muted-silver text-lg">
              {isUnlockPhase ? 'Enter your password to access your BTC.' : 'Fintech-grade Bitcoin savings.'}
            </p>
          </div>
        )}

        <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/1 shadow-xl relative overflow-hidden group">
          {/* Subtle line indicator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-primary/20" />

          {isUnlockPhase ? (
            <div className="mb-8 text-center bg-primary/5 p-4 rounded-2xl border border-primary/20">
               <p className="text-xs text-primary font-bold uppercase tracking-widest">Signed in as {session?.user?.name || session?.user?.email}</p>
            </div>
          ) : (
            <div className="flex bg-white/5 p-1.5 rounded-2xl mb-10 border border-white/5">
              <button 
                type="button"
                onClick={() => { 
                  setIsLogin(true); 
                  setError(null); 
                  reset({}, { keepDefaultValues: false }); 
                }}
                className={`flex-1 py-3 rounded-[1.1rem] text-sm font-bold transition-all ${isLogin ? 'bg-white text-background-dark shadow-md' : 'text-slate-500 hover:text-white'}`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => { 
                  setIsLogin(false); 
                  setError(null); 
                  reset({}, { keepDefaultValues: false }); 
                }}
                className={`flex-1 py-3 rounded-[1.1rem] text-sm font-bold transition-all ${!isLogin ? 'bg-white text-background-dark shadow-md' : 'text-slate-500 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && !isUnlockPhase && (
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within/input:text-primary transition-colors">
                    <Zap size={18} />
                  </div>
                  <input 
                    {...register('username')}
                    type="text"
                    placeholder="Username (3-20 chars)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-surface-lighter outline-none focus:border-primary transition-all text-sm"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-[10px] px-4 font-bold uppercase tracking-wider mt-1">
                      {errors.username.message as string}
                    </p>
                  )}
                </div>
              )}

              {!isUnlockPhase && (
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within/input:text-primary transition-colors">
                    {isLogin ? <User size={18} /> : <Mail size={18} />}
                  </div>
                  <input 
                    {...register(isLogin ? 'username' : 'email')}
                    type="text"
                    placeholder={isLogin ? "Email or Username" : "Email Address"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-surface-lighter outline-none focus:border-primary transition-all text-sm"
                  />
                  {(isLogin ? errors.username : errors.email) && (
                    <p className="text-red-500 text-[10px] px-4 font-bold uppercase tracking-wider mt-1">
                      {(isLogin ? errors.username?.message : errors.email?.message) as string}
                    </p>
                  )}
                </div>
              )}

              {isUnlockPhase && (
                <input 
                  type="hidden" 
                  {...register('username')} 
                  value={session?.user?.email || session?.user?.name || 'vault_user'} 
                />
              )}

              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within/input:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Secret Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-surface-lighter outline-none focus:border-primary transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-silver hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] px-4 font-bold uppercase tracking-wider">{errors.password.message as string}</p>}

              {!isLogin && (
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within/input:text-primary transition-colors">
                    <CheckCircle2 size={18} />
                  </div>
                  <input 
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-surface-lighter outline-none focus:border-primary transition-all text-sm"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-[10px] px-4 font-bold uppercase tracking-wider mt-1">
                      {errors.confirmPassword.message as string}
                    </p>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
                >
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <p className="text-red-500 text-xs font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-primary hover:bg-white text-background-dark font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {isUnlockPhase ? 'Unlock Vault' : (isLogin ? 'Access Vault' : 'Create Account')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {isUnlockPhase ? (
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="button"
                  className="w-full text-center text-xs font-bold text-muted-silver hover:text-white transition-colors"
                  onClick={handleHardReset}
                >
                  Forgot password? <br/>
                  <span className="text-primary hover:underline">Reset Vault & Start Over</span>
                </button>
                <div className="h-px w-8 bg-white/10 mx-auto" />
                <button 
                  type="button"
                  className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Not you? Switch Account
                </button>
              </div>
            ) : isLogin && (
              <button 
                type="button"
                className="w-full text-center text-xs font-bold text-muted-silver hover:text-white transition-colors pt-2"
                onClick={() => router.push('/auth/reset')}
              >
                Forgot your secret phrase?
              </button>
            )}

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-[#0A0A0B] px-4 text-muted-silver">Enterprise Standard</span>
              </div>
            </div>

            {!isUnlockPhase && (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl py-4 text-sm font-bold text-white group"
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Google
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (hasWallet && address) {
                      // Manual trigger for handshake if auto failed
                      console.log("[Auth] Manual handshake requested.");
                      setIsAuthAttempting(true);
                      signIn('credentials', { 
                        address, 
                        loginType: 'wallet',
                        callbackUrl: '/onboarding'
                      });
                    } else {
                      connectStacks();
                    }
                  }}
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl py-4 text-sm font-bold text-white group disabled:opacity-50"
                  disabled={isAuthAttempting}
                >
                  <WalletIcon size={20} className={`text-white transition-transform ${isAuthAttempting ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                  {isAuthAttempting ? 'Authorizing...' : (hasWallet && address ? 'Authorize Wallet' : 'Wallet')}
                </button>
              </div>
            )}
          </form>
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-silver leading-relaxed max-w-[320px] mx-auto opacity-60">
          By continuing, you agree to the Ironclad Protocol Terms of Service and Privacy Policy. All keys are encrypted locally.
        </p>
      </motion.div>

    </div>
  );
}
