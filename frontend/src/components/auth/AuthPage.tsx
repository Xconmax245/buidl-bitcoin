'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Shield, 
  ShieldCheck,
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
  const { data: session, status: sessionStatus, update } = useSession();
  const { connectStacks, hasWallet, isUnlocked, unlockWallet, deleteWallet, address, isLoading: walletLoading } = useWallet();
  
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthAttempting, setIsAuthAttempting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnlockPhase = hasWallet && !isUnlocked && sessionStatus === "authenticated";

  const handshakeAttempted = React.useRef(false);

  React.useEffect(() => {
    // Check for explicit triggers in the URL (from WalletProvider onFinish)
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const urlAddress = params.get('address');
    const trigger = params.get('auth_trigger');
    const storedAddress = localStorage.getItem('ironclad_handshake_address');
    
    if (trigger === 'wallet' && urlAddress) {
      console.log("[Auth] Handshake trigger detected from URL. Principal:", urlAddress);
    }

    const effectiveAddress = address || urlAddress || storedAddress;
    
    if (effectiveAddress && !handshakeAttempted.current) {
        console.log("[Auth] Checking compatibility for handshake. Address:", effectiveAddress, "WalletLoading:", walletLoading, "SessionStatus:", sessionStatus, "IsAuthAttempting:", isAuthAttempting);
    }

    // Only attempt auto-login if not already authenticated and not currently attempting
    if (effectiveAddress && !walletLoading && sessionStatus === "unauthenticated" && !isAuthAttempting && !handshakeAttempted.current) {
      console.log("[Auth] Handshake sequence triggered. Address:", effectiveAddress, "Source:", address ? "WalletState" : "URL");
      handshakeAttempted.current = true;
      setIsAuthAttempting(true);
      
      signIn('credentials', { 
        username: effectiveAddress, // Hijack username for address to avoid param dropping
        password: 'wallet_login_magic_string', 
        address: effectiveAddress, 
        loginType: 'wallet',
        redirect: false
      }).then((res) => {
        if (!res?.error) {
           console.log("[Auth] Identity verified successfully. Finalizing redirect...");
           
           // Clean up the URL parameters so they don't trigger the handshake again if they revisit auth
           if (typeof window !== 'undefined') {
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete('auth_trigger');
              newUrl.searchParams.delete('address');
              newUrl.searchParams.delete('v');
              window.history.replaceState({}, '', newUrl.toString());
              localStorage.removeItem('ironclad_handshake_address');
           }

           // Force the NextAuth session Provider to refetch the session from the server
           update().then(() => {
               // Only push if we came from AuthPage directly, otherwise allow Onboarding page to inherently pick up the session!
               if (window.location.pathname !== '/onboarding') {
                  window.location.assign(window.location.origin + '/onboarding');
               } else {
                  // If we're already on /onboarding, just let the state refresh naturally via session
                  if (onSuccess) onSuccess();
               }
           });
        } else {
           console.error("[Auth] Identity verification failed:", res.error);
           setError(`Verification error: ${res.error}`);
           setIsAuthAttempting(false);
           handshakeAttempted.current = false;
        }
      }).catch(err => {
         console.error("[Auth] Handshake fatal error:", err);
         setError("Connection to identity provider lost. Please try again.");
         setIsAuthAttempting(false);
         handshakeAttempted.current = false;
      });
    }
  }, [hasWallet, address, walletLoading, sessionStatus, isAuthAttempting, onSuccess, update]);

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
          let errName = result.error;
          if (errName === "CredentialsSignin") errName = "Invalid username or password.";
          if (errName === "CallbackRouteError") errName = "Network port mismatch or invalid session token. Please reload the page.";
          setError(`Sign in blocked: ${errName}`);
        } else {
          update().then(() => {
             if (onSuccess) onSuccess();
             else router.push('/onboarding');
          });
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
             update().then(() => {
                if (onSuccess) onSuccess();
                else router.push('/onboarding');
             });
          }
        } else {
          // Enhanced error handling for common signup issues
          let errorMessage = json.error || "Signup failed.";
          
          if (json.details && json.details.fieldErrors) {
             const key = Object.keys(json.details.fieldErrors)[0];
             errorMessage = `${key}: ${json.details.fieldErrors[key][0]}`;
          }

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
      <div className="absolute inset-0 bg-[#060608] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence>
        {isAuthAttempting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background-dark/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Establishing protocol handshake</h2>
            <p className="text-muted-silver text-xs font-bold uppercase tracking-widest animate-pulse">Syncing identity with decentralized settlements...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {!hideHeader && (
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-2xl relative group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Shield className="text-primary relative z-10" size={32} />
            </motion.div>
            <h1 className="text-4xl font-black font-tight text-white mb-2 tracking-tighter uppercase">
              {isUnlockPhase ? 'Vault Locked' : 'Ironclad Protocol'}
            </h1>
            <p className="text-muted-silver text-sm uppercase tracking-[0.2em] font-bold opacity-60">
              Authorized Access Only
            </p>
          </div>
        )}

        <div className="glass-panel p-1 rounded-[2.5rem] bg-linear-to-b from-white/10 to-transparent shadow-2xl">
          <div className="p-8 sm:p-10 rounded-[2.3rem] bg-[#0A0A0B] border border-white/5 overflow-hidden relative">
            
            {/* 1. PRIMARY: PROTOCOL ACCESS (Wallet) */}
            {!isUnlockPhase && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Protocol Auth</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <button 
                  type="button"
                  disabled={isAuthAttempting}
                  onClick={async () => {
                    if (hasWallet && address) {
                      setIsAuthAttempting(true);
                      const result = await signIn('credentials', { 
                        username: address, // Hijack standard parameter
                        password: 'wallet_login_magic_string',
                        address, 
                        loginType: 'wallet',
                        redirect: false
                      });
                      
                      if (result?.error) {
                         setIsAuthAttempting(false);
                         let errName = result.error;
                         if (errName === "CredentialsSignin") errName = "Missing wallet authorization keys.";
                         if (errName === "CallbackRouteError") errName = "Network origin mismatch. Reload page and try again on localhost.";
                         setError(`Wallet authorization failed: ${errName}`);
                      } else {
                         update().then(() => {
                            if (window.location.pathname !== '/onboarding') {
                               window.location.assign(window.location.origin + '/onboarding');
                            } else {
                               if (onSuccess) onSuccess();
                            }
                         });
                      }
                    } else {
                      connectStacks();
                    }
                  }}
                  className="w-full group bg-primary hover:bg-white text-background-dark py-6 rounded-2xl transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <WalletIcon size={24} className={`${isAuthAttempting ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className="text-lg font-black uppercase tracking-tight">
                      {isAuthAttempting ? 'Synchronizing...' : (address ? 'Verify & Enter' : 'Connect Protocol Wallet')}
                    </span>
                  </div>
                  {address && !isAuthAttempting && (
                    <span className="text-[10px] font-bold opacity-60 tracking-wider font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)} Detected
                    </span>
                  )}
                </button>
                
                <p className="mt-4 text-center text-[10px] text-muted-silver/60 font-bold uppercase tracking-widest">
                  Secure L2 Settlement via Stacks & Bitcoin
                </p>
              </div>
            )}

            {/* 2. SECONDARY: LEGACY / GOOGLE ACCESS */}
            <div className="mb-8">
               <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-black text-muted-silver/40 uppercase tracking-widest">Credential Access</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {!isUnlockPhase && (
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <button 
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl py-4 text-xs font-black text-white uppercase tracking-widest group"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              )}

              {/* Collapsible / Simple Login Form */}
              <div className="bg-white/2 rounded-3xl p-1 border border-white/5">
                {!isUnlockPhase && (
                  <button 
                    onClick={() => setShowEmailAuth(!showEmailAuth)}
                    className="w-full py-4 text-[10px] font-black text-muted-silver/60 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    {showEmailAuth ? 'Hide Legacy Email Auth' : 'Use Legacy Email Access'}
                  </button>
                )}
                
                <AnimatePresence>
                  {(showEmailAuth || isUnlockPhase) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 pt-2">
                        {!isUnlockPhase && (
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <button
                              type="button"
                              onClick={() => { setIsLogin(true); reset(); setError(null); }}
                              className={`text-xs font-bold uppercase tracking-widest ${isLogin ? 'text-primary' : 'text-muted-silver hover:text-white'}`}
                            >
                              Login
                            </button>
                            <span className="text-white/20">|</span>
                            <button
                              type="button"
                              onClick={() => { setIsLogin(false); reset(); setError(null); }}
                              className={`text-xs font-bold uppercase tracking-widest ${!isLogin ? 'text-primary' : 'text-muted-silver hover:text-white'}`}
                            >
                              Register
                            </button>
                          </div>
                        )}

                        <div className="space-y-6">
                          {!isUnlockPhase && !isLogin && (
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver" size={16} />
                              <input 
                                {...register('email')}
                                placeholder="Email Address *"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-surface-lighter outline-none focus:border-primary/50 transition-all text-sm"
                              />
                              {errors.email && (
                                <p className="text-red-400 text-[10px] px-1 font-medium mt-1 absolute -bottom-5">{errors.email.message as string}</p>
                              )}
                            </div>
                          )}

                          {!isUnlockPhase && (
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver" size={16} />
                              <input 
                                {...register('username')}
                                placeholder={isLogin ? "Email or Username" : "Username *"}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-surface-lighter outline-none focus:border-primary/50 transition-all text-sm"
                              />
                              {errors.username && (
                                <p className="text-red-400 text-[10px] px-1 font-medium mt-1 absolute -bottom-5">{errors.username.message as string}</p>
                              )}
                            </div>
                          )}

                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver" size={16} />
                            <input 
                              {...register('password')}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={!isLogin && !isUnlockPhase ? "Password (Min 8, A-Z, 0-9, @$!%*?&)" : "Secret Password"}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-surface-lighter outline-none focus:border-primary/50 transition-all text-sm"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-silver hover:text-white"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {errors.password && (
                               <p className="text-red-400 text-[10px] px-1 font-medium mt-1 absolute -bottom-5 truncate w-full">{errors.password.message as string}</p>
                            )}
                          </div>

                          {!isUnlockPhase && !isLogin && (
                            <div className="relative">
                              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver" size={16} />
                              <input 
                                {...register('confirmPassword')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password *"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-surface-lighter outline-none focus:border-primary/50 transition-all text-sm"
                              />
                              {errors.confirmPassword && (
                                 <p className="text-red-400 text-[10px] px-1 font-medium mt-1 absolute -bottom-5">{errors.confirmPassword.message as string}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {error && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 mt-4">
                            <AlertCircle className="text-red-500 shrink-0" size={14} />
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{error}</p>
                          </div>
                        )}

                        <button 
                          disabled={isLoading}
                          type="submit"
                          className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10 uppercase tracking-widest text-xs"
                        >
                          {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (isUnlockPhase ? 'Initialize Unlock' : 'Access Vault')}
                        </button>

                        {isUnlockPhase && (
                          <button 
                            type="button"
                            onClick={handleHardReset}
                            className="w-full text-center text-[9px] font-black text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-widest pt-2"
                          >
                            Lost Access? Factory Reset Vault
                          </button>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-center text-[9px] text-muted-silver leading-relaxed opacity-40 uppercase font-black tracking-widest">
              Sovereign Keys • Zero-Trust • Bitcoin Finality
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-primary" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">AES-256</span>
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck size={12} className="text-primary" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Non-Custodial</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
