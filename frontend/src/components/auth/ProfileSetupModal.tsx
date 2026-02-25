'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Globe, 
  Coins, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Camera,
  ShieldCheck,
  Clock,
  Shield,
  CheckCircle,
  Languages,
  AlertCircle,
  ImagePlus
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { COUNTRIES, TIMEZONES, CURRENCIES, LANGUAGES, DEFAULT_AVATARS } from '@/lib/constants';

// ── Schema ──────────────────────────────────────────────────────────
const profileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, or underscores only'),
  displayName: z.string().min(2, 'Display name is too short').max(50, 'Max 50 characters'),
  bio: z.string().max(160, 'Bio too long').optional().or(z.literal('')),
  country: z.string().min(1, 'Please select a country'),
  timezone: z.string().min(1, 'Please select a timezone'),
  preferredCurrency: z.string(),
  language: z.string().default('EN'),
});

type ProfileInput = z.infer<typeof profileSchema>;




// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════
export default function ProfileSetupModal({
  userEmail,
  onComplete,
}: {
  userEmail?: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [customAvatar, setCustomAvatar] = useState<string>('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    trigger,
  } = useForm<any>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      preferredCurrency: 'USD',
      displayName: userEmail ? userEmail.split('@')[0] : '',
      username: userEmail
        ? userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
        : '',
      language: 'EN',
      country: '',
      timezone: '',
    },
  });

  // ── Fetch Existing Profile ──────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = data.profile;
            setValue('username', p.username || '');
            setValue('displayName', p.displayName || '');
            setValue('bio', p.bio || '');
            setValue('country', p.country || '');
            setValue('timezone', p.timezone || '');
            setValue('preferredCurrency', p.preferredCurrency || 'USD');
            setValue('language', p.language || 'EN');
            if (p.avatarUrl) setSelectedAvatar(p.avatarUrl);
            
            // Trigger validation for username since it's already taken by self
            if (p.username) {
                setUsernameAvailable(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial profile", err);
      }
    };
    fetchProfile();
  }, [setValue]);

  const watchAll = watch();
  const currentAvatar = customAvatar || selectedAvatar;

  // ── Username availability check (debounced) ──────────────────────
  const checkUsername = async (val: string) => {
    if (!val || val.length < 3) { setUsernameAvailable(null); return; }
    try {
      const res = await fetch(`/api/profile/check-username?username=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setUsernameAvailable(data.available);
      }
    } catch { setUsernameAvailable(null); }
  };

  // ── File upload handler ──────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setCustomAvatar(result);
      setSelectedAvatar('');
      setShowAvatarPicker(false);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // ── Step navigation ──────────────────────────────────────────────
  const goNext = async () => {
    if (step === 1) {
      const valid = await trigger(['username', 'displayName']);
      if (!valid) return;
    }
    if (step === 2) {
      const valid = await trigger(['country', 'timezone']);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // ── Submit ───────────────────────────────────────────────────────
  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    setError('');
    try {
      const payload = {
        ...data,
        avatarUrl: currentAvatar || '',
        notifications: { weeklySummary: true, securityAlerts: true },
      };

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onComplete();
      } else {
        const json = await res.json();
        setError(json.error || 'Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Profile submit error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Steps Meta ───────────────────────────────────────────────────
  const STEPS = [
    { id: 1, label: 'Identity', icon: User },
    { id: 2, label: 'Preferences', icon: Globe },
    { id: 3, label: 'Confirm', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center bg-[#060808] text-gray-300 overflow-y-auto px-4 py-6">
      {/* Background Effects - Muted */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/2 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-white/2 rounded-full blur-[100px]" />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Card */}
      <main className="relative w-full max-w-[500px] shrink-0 my-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#0c1210]/90 backdrop-blur-xl">
        {/* Progress Bar - Simplified */}
        <div className="w-full h-1 bg-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="absolute top-0 left-0 h-full bg-primary/40"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 pt-6 px-4">
          {STEPS.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = step === s.id;
            const isComplete = step > s.id;
            return (
              <React.Fragment key={s.id}>
                {idx > 0 && (
                  <div className={`hidden sm:block w-8 h-px ${isComplete ? 'bg-primary' : 'bg-white/10'}`} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isComplete
                        ? 'bg-primary text-black'
                        : isActive
                        ? 'bg-primary/20 text-primary ring-2 ring-primary/40'
                        : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {isComplete ? <Check size={14} /> : <StepIcon size={14} />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:block ${
                      isActive ? 'text-primary' : isComplete ? 'text-white/60' : 'text-white/20'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {step === 1 ? 'Create Your Identity' : step === 2 ? 'Set Preferences' : 'Review & Confirm'}
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              {step === 1
                ? 'Choose your avatar and set your public profile.'
                : step === 2
                ? 'Customize your regional and display preferences.'
                : 'Everything looks good? Finalize your profile.'}
            </p>
          </div>

          {/* ─── STEP 1: IDENTITY ─────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                >
                    <Avatar 
                      src={currentAvatar} 
                      name={watchAll.displayName || '?'} 
                      size={112} 
                      className="border-primary/30" 
                    />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Camera size={12} />
                  </div>
                </div>

                {/* Avatar Picker Dropdown - Muted */}
                {showAvatarPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full bg-background-dark/95 border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl z-20"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Choose an Avatar</p>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-lg"
                      >
                        <ImagePlus size={12} />
                        Upload
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {DEFAULT_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(url);
                            setCustomAvatar('');
                            setShowAvatarPicker(false);
                          }}
                          className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                            selectedAvatar === url
                              ? 'border-primary'
                              : 'border-transparent hover:border-white/20'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                  Display Name *
                </label>
                <input
                  {...register('displayName')}
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                />
                {errors.displayName && (
                  <p className="text-red-400 text-[10px] px-1 font-medium">{errors.displayName.message as string}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-medium text-sm">@</span>
                  <input
                    {...register('username', {
                      onChange: (e) => checkUsername(e.target.value),
                    })}
                    type="text"
                    placeholder="your_username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-12 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  />
                  {watchAll.username?.length > 2 && usernameAvailable !== null && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {usernameAvailable ? (
                        <CheckCircle size={18} className="text-green-400" />
                      ) : (
                        <AlertCircle size={18} className="text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {errors.username && (
                  <p className="text-red-400 text-[10px] px-1 font-medium">{errors.username.message as string}</p>
                )}
                {usernameAvailable === false && !errors.username && (
                  <p className="text-red-400 text-[10px] px-1 font-medium">Username is already taken</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest">Bio</label>
                  <span className="text-[10px] font-medium text-white/20">{watchAll.bio?.length || 0}/160</span>
                </div>
                <textarea
                  {...register('bio')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none"
                  placeholder="Tell us about yourself... (optional)"
                  rows={3}
                />
              </div>

              {/* Next Button - Simplified */}
              <button
                type="button"
                onClick={goNext}
                disabled={!!errors.username || !!errors.displayName || usernameAvailable === false}
                className="w-full bg-primary hover:bg-white text-background-dark font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 2: PREFERENCES ──────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4">
                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <MapPin size={12} className="text-primary/60" /> Country *
                  </label>
                  <div className="relative">
                    <select
                      {...register('country')}
                      className="w-full pl-4 pr-8 py-3 bg-[#0c1210] border border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all appearance-none text-white cursor-pointer"
                    >
                      <option value="" className="bg-[#0c1210]">Select country...</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0c1210]">{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                        <ArrowRight size={12} className="rotate-90" />
                    </div>
                  </div>
                  {errors.country && (
                    <p className="text-red-400 text-[10px] px-1 font-medium">{errors.country.message as string}</p>
                  )}
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Clock size={12} className="text-primary/60" /> Timezone *
                  </label>
                  <div className="relative">
                    <select
                      {...register('timezone')}
                      className="w-full pl-4 pr-8 py-3 bg-[#0c1210] border border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all appearance-none text-white cursor-pointer"
                    >
                      <option value="" className="bg-[#0c1210]">Select timezone...</option>
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value} className="bg-[#0c1210]">{tz.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                        <ArrowRight size={12} className="rotate-90" />
                    </div>
                  </div>
                  {errors.timezone && (
                    <p className="text-red-400 text-[10px] px-1 font-medium">{errors.timezone.message as string}</p>
                  )}
                </div>

                {/* Currency */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Coins size={12} className="text-primary/60" /> Display Currency
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setValue('preferredCurrency', curr)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          watchAll.preferredCurrency === curr
                            ? 'bg-primary text-background-dark shadow-md'
                            : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Languages size={12} className="text-primary/60" /> Language
                  </label>
                  <div className="relative">
                    <select
                      {...register('language')}
                      className="w-full pl-4 pr-8 py-3 bg-[#0c1210] border border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all appearance-none text-white cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-[#0c1210]">{lang.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                        <ArrowRight size={12} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Toggles - Interactive */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest">Notifications</p>
                
                {/* Weekly Summary Toggle */}
                <div 
                  onClick={() => setValue('notifications.weeklySummary', !watchAll.notifications?.weeklySummary, { shouldDirty: true })}
                  className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <Mail className="text-primary/50 shrink-0" size={16} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white">Weekly Summary</p>
                      <p className="text-[10px] text-white/30 hidden sm:block">Performance reports every Monday.</p>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${watchAll.notifications?.weeklySummary ? 'bg-primary/20' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${watchAll.notifications?.weeklySummary ? 'right-0.5 bg-primary' : 'left-0.5 bg-white/30'}`} />
                  </div>
                </div>

                {/* Security Alerts Toggle */}
                <div 
                   onClick={() => setValue('notifications.securityAlerts', !watchAll.notifications?.securityAlerts, { shouldDirty: true })}
                   className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <ShieldCheck className="text-primary/50 shrink-0" size={16} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white">Security Alerts</p>
                      <p className="text-[10px] text-white/30 hidden sm:block">Login attempts and withdrawal notices.</p>
                    </div>
                  </div>
                   <div className={`w-10 h-5 rounded-full relative transition-colors ${watchAll.notifications?.securityAlerts ? 'bg-primary/20' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${watchAll.notifications?.securityAlerts ? 'right-0.5 bg-primary' : 'left-0.5 bg-white/30'}`} />
                  </div>
                </div>
              </div>

              {/* Nav Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-5 py-3 text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!!errors.country || !!errors.timezone}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center gap-2 group disabled:opacity-40"
                >
                  Continue
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: CONFIRM ──────────────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Profile Preview Card */}
              <div className="flex flex-col items-center text-center mb-2">
                  <Avatar 
                    src={currentAvatar} 
                    name={watchAll.displayName || ''} 
                    size={96} 
                    className="border-primary/30" 
                  />
                <h2 className="text-lg sm:text-xl font-bold text-white">{watchAll.displayName || 'Your Name'}</h2>
                <p className="text-primary text-sm font-mono">@{watchAll.username || 'username'}</p>
                {watchAll.bio && <p className="text-white/40 text-xs mt-1 max-w-xs">{watchAll.bio}</p>}
              </div>

              {/* Details Grid */}
              <div className="bg-white/3 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 space-y-0">
                {[
                  { label: 'Country', value: COUNTRIES.find(c => c.code === watchAll.country)?.name || watchAll.country },
                  { label: 'Timezone', value: TIMEZONES.find(tz => tz.value === watchAll.timezone)?.label || watchAll.timezone },
                  { label: 'Currency', value: watchAll.preferredCurrency },
                  { label: 'Language', value: LANGUAGES.find(l => l.code === watchAll.language)?.name || watchAll.language },
                ].map((item, idx, arr) => (
                  <div
                    key={item.label}
                    className={`flex justify-between items-center py-3 ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-white/40 tracking-wider">{item.label}</span>
                    <span className="text-white text-xs sm:text-sm font-medium">{item.value || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="text-red-400 shrink-0" size={16} />
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-5 py-3 text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary hover:bg-white text-black font-bold rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Finalize Setup
                      <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-6 opacity-20 pointer-events-none w-full justify-center">
        <div className="flex items-center gap-1.5">
          <Shield className="text-primary" size={12} />
          <span className="text-[9px] text-white uppercase tracking-wider font-semibold">AES-256 Encrypted</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <ShieldCheck className="text-primary" size={12} />
          <span className="text-[9px] text-white uppercase tracking-wider font-semibold">Non-Custodial</span>
        </div>
      </div>
    </div>
  );
}
