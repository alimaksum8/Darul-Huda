/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Settings, X, Save } from 'lucide-react';

const EXPLOSION_COLORS = ['#e8b931', '#c75dab', '#ffffff'];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
}

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
  surface: string;
  heroGradient: string;
  orbColors: [string, string];
  transition: any;
}

const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Classic Gold',
    primary: '#e8b931',
    secondary: '#c75dab',
    bg: '#0a0a12',
    surface: '#16162a',
    heroGradient: 'linear-gradient(to bottom, #fff5d4 0%, #e8b931 100%)',
    orbColors: ['#e8b931', '#c75dab'],
    transition: { type: 'spring', damping: 10, stiffness: 100 }
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    primary: '#60a5fa',
    secondary: '#3b82f6',
    bg: '#020617',
    surface: '#0f172a',
    heroGradient: 'linear-gradient(to bottom, #bfDBfe 0%, #60a5fa 100%)',
    orbColors: ['#3b82f6', '#1e40af'],
    transition: { duration: 0.8, ease: "circOut" }
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    primary: '#10b981',
    secondary: '#059669',
    bg: '#064e3b',
    surface: '#065f46',
    heroGradient: 'linear-gradient(to bottom, #d1fae5 0%, #10b981 100%)',
    orbColors: ['#10b981', '#065f46'],
    transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#fb923c',
    secondary: '#f97316',
    bg: '#451a03',
    surface: '#78350f',
    heroGradient: 'linear-gradient(to bottom, #ffedd5 0%, #fb923c 100%)',
    orbColors: ['#fb923c', '#ea580c'],
    transition: { type: 'spring', bounce: 0.6 }
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    primary: '#a78bfa',
    secondary: '#8b5cf6',
    bg: '#2e1065',
    surface: '#4c1d95',
    heroGradient: 'linear-gradient(to bottom, #ede9fe 0%, #a78bfa 100%)',
    orbColors: ['#a78bfa', '#7c3aed'],
    transition: { duration: 1.2, ease: "anticipate" }
  },
  {
    id: 'sakura',
    name: 'Sakura Pink',
    primary: '#f472b6',
    secondary: '#ec4899',
    bg: '#500724',
    surface: '#831843',
    heroGradient: 'linear-gradient(to bottom, #fdf2f8 0%, #f472b6 100%)',
    orbColors: ['#f472b6', '#db2777'],
    transition: { duration: 0.6, ease: "backOut" }
  },
  {
    id: 'cyber',
    name: 'Cyberpunk',
    primary: '#22d3ee',
    secondary: '#f43f5e',
    bg: '#0f172a',
    surface: '#1e293b',
    heroGradient: 'linear-gradient(to bottom, #ccfbf1 0%, #22d3ee 100%)',
    orbColors: ['#22d3ee', '#f43f5e'],
    transition: { duration: 0.3, ease: "linear" }
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    primary: '#475569',
    secondary: '#94a3b8',
    bg: '#f8fafc',
    surface: '#ffffff',
    heroGradient: 'linear-gradient(to bottom, #334155 0%, #475569 100%)',
    orbColors: ['#cbd5e1', '#94a3b8'],
    transition: { duration: 1.5, ease: "easeInOut" }
  },
  {
    id: 'autumn',
    name: 'Autumn Gold',
    primary: '#d97706',
    secondary: '#b45309',
    bg: '#451a03',
    surface: '#78350f',
    heroGradient: 'linear-gradient(to bottom, #fde68a 0%, #d97706 100%)',
    orbColors: ['#d97706', '#92400e'],
    transition: { duration: 2, ease: "circIn" }
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    primary: '#c084fc',
    secondary: '#a855f7',
    bg: '#1e1b4b',
    surface: '#312e81',
    heroGradient: 'linear-gradient(to bottom, #f5f3ff 0%, #c084fc 100%)',
    orbColors: ['#c084fc', '#9333ea'],
    transition: { type: 'spring', mass: 2 }
  },
  {
    id: 'slate',
    name: 'Slate Stone',
    primary: '#94a3b8',
    secondary: '#64748b',
    bg: '#0f172a',
    surface: '#1e293b',
    heroGradient: 'linear-gradient(to bottom, #f1f5f9 0%, #94a3b8 100%)',
    orbColors: ['#64748b', '#475569'],
    transition: { duration: 0.5, ease: "easeOut" }
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    primary: '#f87171',
    secondary: '#ef4444',
    bg: '#450a0a',
    surface: '#7f1d1d',
    heroGradient: 'linear-gradient(to bottom, #fee2e2 0%, #f87171 100%)',
    orbColors: ['#f87171', '#dc2626'],
    transition: { duration: 0.8, ease: "backInOut" }
  },
  {
    id: 'teal',
    name: 'Teal Dream',
    primary: '#2dd4bf',
    secondary: '#14b8a6',
    bg: '#042f2e',
    surface: '#0d9488',
    heroGradient: 'linear-gradient(to bottom, #f0fdfa 0%, #2dd4bf 100%)',
    orbColors: ['#2dd4bf', '#0f766e'],
    transition: { type: 'keyframes', times: [0, 0.5, 1], duration: 1.2 }
  },
  {
    id: 'sand',
    name: 'Sandstone',
    primary: '#a8a29e',
    secondary: '#78716c',
    bg: '#1c1917',
    surface: '#44403c',
    heroGradient: 'linear-gradient(to bottom, #fafaf9 0%, #a8a29e 100%)',
    orbColors: ['#a8a29e', '#57534e'],
    transition: { duration: 1.5, ease: "anticipate" }
  },
  {
    id: 'olive',
    name: 'Olive Garden',
    primary: '#a3e635',
    secondary: '#84cc16',
    bg: '#1a2e05',
    surface: '#365314',
    heroGradient: 'linear-gradient(to bottom, #f7fee7 0%, #a3e635 100%)',
    orbColors: ['#a3e635', '#65a30d'],
    transition: { type: 'spring', mass: 0.5 }
  },
  {
    id: 'space',
    name: 'Deep Space',
    primary: '#818cf8',
    secondary: '#6366f1',
    bg: '#030617',
    surface: '#1e1b4b',
    heroGradient: 'linear-gradient(to bottom, #e0e7ff 0%, #818cf8 100%)',
    orbColors: ['#4f46e5', '#312e81'],
    transition: { duration: 3, ease: "linear" }
  },
  {
    id: 'neon',
    name: 'Neon Jungle',
    primary: '#4ade80',
    secondary: '#22c55e',
    bg: '#052e16',
    surface: '#064e3b',
    heroGradient: 'linear-gradient(to bottom, #f0fdf4 0%, #4ade80 100%)',
    orbColors: ['#4ade80', '#15803d'],
    transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] }
  },
  {
    id: 'pastel',
    name: 'Pastel Sky',
    primary: '#7dd3fc',
    secondary: '#38bdf8',
    bg: '#0c4a6e',
    surface: '#075985',
    heroGradient: 'linear-gradient(to bottom, #f0f9ff 0%, #7dd3fc 100%)',
    orbColors: ['#38bdf8', '#0369a1'],
    transition: { duration: 1.2, bounce: 0.5 }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#d1d5db',
    secondary: '#9ca3af',
    bg: '#111827',
    surface: '#1f2937',
    heroGradient: 'linear-gradient(to bottom, #f9fafb 0%, #d1d5db 100%)',
    orbColors: ['#9ca3af', '#4b5563'],
    transition: { duration: 1, ease: 'easeIn' }
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    primary: '#fda4af',
    secondary: '#fb7185',
    bg: '#4c0519',
    surface: '#881337',
    heroGradient: 'linear-gradient(to bottom, #fff1f2 0%, #fda4af 100%)',
    orbColors: ['#fb7185', '#be123c'],
    transition: { type: 'spring', velocity: 2 }
  }
];

export default function App() {
  const [sequenceKey, setSequenceKey] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Long press states
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom Data States with LocalStorage persistence
  const [currentThemeId, setCurrentThemeId] = useState(() => localStorage.getItem('themeId') || 'classic');
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('schoolName') || 'MTS DARUL HUDA');
  const [welcomeText, setWelcomeText] = useState(() => localStorage.getItem('welcomeText') || 'Selamat Datang Di');
  const [academicYear, setAcademicYear] = useState(() => localStorage.getItem('academicYear') || 'Tahun Akademik 2026');
  const [footerText, setFooterText] = useState(() => localStorage.getItem('footerText') || 'Professionalism • Integrity • Excellence');
  const [asesorUtama, setAsesorUtama] = useState(() => localStorage.getItem('asesorUtama') || 'BPK. ABDUL LATIF ANWAR, S.Ag');
  const [asesorPendamping, setAsesorPendamping] = useState(() => localStorage.getItem('asesorPendamping') || 'BPK. MOHAMMAD ROZIM, M.Pd.I');
  const [photoUtama, setPhotoUtama] = useState(() => localStorage.getItem('photoUtama') || '');
  const [photoPendamping, setPhotoPendamping] = useState(() => localStorage.getItem('photoPendamping') || '');

  // Temporary states for form
  const [tempThemeId, setTempThemeId] = useState(currentThemeId);
  const [tempSchool, setTempSchool] = useState(schoolName);
  const [tempWelcome, setTempWelcome] = useState(welcomeText);
  const [tempYear, setTempYear] = useState(academicYear);
  const [tempFooter, setTempFooter] = useState(footerText);
  const [tempAsesor1, setTempAsesor1] = useState(asesorUtama);
  const [tempAsesor2, setTempAsesor2] = useState(asesorPendamping);
  const [tempPhoto1, setTempPhoto1] = useState(photoUtama);
  const [tempPhoto2, setTempPhoto2] = useState(photoPendamping);

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  // LONG PRESS LOGIC
  const startHold = () => {
    if (isSettingsOpen) return;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setHoldProgress(progress);
      
      if (progress >= 100) {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      setTempThemeId(currentThemeId);
      setTempSchool(schoolName);
      setTempWelcome(welcomeText);
      setTempYear(academicYear);
      setTempFooter(footerText);
      setTempAsesor1(asesorUtama);
      setTempAsesor2(asesorPendamping);
      setTempPhoto1(photoUtama);
      setTempPhoto2(photoPendamping);
      setIsSettingsOpen(true);
      endHold();
    }, duration);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  // Trigger sequence loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSequenceKey(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Firework logic
  const createExplosion = (x: number, y: number) => {
    const count = 15;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const velocity = 2 + Math.random() * 3;
      newParticles.push({
        id: Math.random(),
        x,
        y,
        color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
        tx: Math.cos(angle) * velocity * 40,
        ty: Math.sin(angle) * velocity * 40,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createExplosion(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight * 0.5
          );
        }, i * 1200);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [sequenceKey]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    setCurrentThemeId(tempThemeId);
    setSchoolName(tempSchool);
    setWelcomeText(tempWelcome);
    setAcademicYear(tempYear);
    setFooterText(tempFooter);
    setAsesorUtama(tempAsesor1);
    setAsesorPendamping(tempAsesor2);
    setPhotoUtama(tempPhoto1);
    setPhotoPendamping(tempPhoto2);
    localStorage.setItem('themeId', tempThemeId);
    localStorage.setItem('schoolName', tempSchool);
    localStorage.setItem('welcomeText', tempWelcome);
    localStorage.setItem('academicYear', tempYear);
    localStorage.setItem('footerText', tempFooter);
    localStorage.setItem('asesorUtama', tempAsesor1);
    localStorage.setItem('asesorPendamping', tempAsesor2);
    localStorage.setItem('photoUtama', tempPhoto1);
    localStorage.setItem('photoPendamping', tempPhoto2);
    setIsSettingsOpen(false);
    setSequenceKey(prev => prev + 1); // Reset animation to show changes
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-bg font-serif select-none transition-colors duration-1000"
      style={{ 
        '--color-primary': currentTheme.primary,
        '--color-secondary': currentTheme.secondary,
        '--color-bg': currentTheme.bg,
        '--color-surface': currentTheme.surface,
        backgroundColor: currentTheme.bg,
        color: currentTheme.id === 'minimal' ? '#334155' : '#f0e6d3'
      } as React.CSSProperties}
    >
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg/95 flex items-center justify-center p-6 backdrop-blur-xl overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface/80 border border-primary/20 p-8 rounded-lg w-full max-w-lg shadow-2xl relative my-8"
              style={{ backgroundColor: currentTheme.surface, borderColor: `${currentTheme.primary}40` }}
            >
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Pengaturan Data
              </h3>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Theme Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-3 font-sans font-bold">Pilih Tema</label>
                  <div className="grid grid-cols-4 gap-2">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setTempThemeId(theme.id)}
                        className={`group relative p-2 rounded-sm border transition-all ${
                          tempThemeId === theme.id ? 'border-primary' : 'border-primary/10'
                        }`}
                        title={theme.name}
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-full h-8 rounded-sm" style={{ backgroundColor: theme.bg }} />
                          <div className="w-full h-8 rounded-sm" style={{ backgroundColor: theme.primary }} />
                        </div>
                        <span className="text-[8px] truncate block opacity-60 group-hover:opacity-100">{theme.name}</span>
                        {tempThemeId === theme.id && <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_var(--color-primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2 font-sans font-bold">Teks Sambutan</label>
                    <input 
                      type="text" 
                      value={tempWelcome} 
                      onChange={(e) => setTempWelcome(e.target.value)}
                      className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-[#f0e6d3]"
                      style={{ backgroundColor: `${currentTheme.bg}80`, borderColor: `${currentTheme.primary}30` }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2 font-sans font-bold">Nama Madrasah</label>
                    <input 
                      type="text" 
                      value={tempSchool} 
                      onChange={(e) => setTempSchool(e.target.value.toUpperCase())}
                      className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors uppercase text-[#f0e6d3]"
                      style={{ backgroundColor: `${currentTheme.bg}80`, borderColor: `${currentTheme.primary}30` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2 font-sans font-bold">Tahun Akademik</label>
                  <input 
                    type="text" 
                    value={tempYear} 
                    onChange={(e) => setTempYear(e.target.value)}
                    className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-[#f0e6d3]"
                    style={{ backgroundColor: `${currentTheme.bg}80`, borderColor: `${currentTheme.primary}30` }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2 font-sans font-bold">Teks Footer (Slogan)</label>
                  <input 
                    type="text" 
                    value={tempFooter} 
                    onChange={(e) => setTempFooter(e.target.value)}
                    className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-[#f0e6d3]"
                    style={{ backgroundColor: `${currentTheme.bg}80`, borderColor: `${currentTheme.primary}30` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-sans font-bold">Asesor Utama</label>
                    <input 
                      type="text" 
                      value={tempAsesor1} 
                      placeholder="Nama Asesor Utama"
                      onChange={(e) => setTempAsesor1(e.target.value)}
                      className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-[#f0e6d3]"
                      style={{ backgroundColor: `${currentTheme.bg}80`, borderColor: `${currentTheme.primary}30` }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      {tempPhoto1 && <img src={tempPhoto1} className="w-20 h-20 rounded-full object-cover border border-primary/30" alt="Preview 1" />}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, setTempPhoto1)}
                        className="text-[10px] text-primary/60 file:bg-primary/10 file:border-primary/20 file:text-primary file:rounded-sm file:px-2 file:py-1 file:mr-2 cursor-pointer"
                      />
                      {tempPhoto1 && (
                        <button onClick={() => setTempPhoto1('')} className="text-[10px] text-red-400 hover:underline">Hapus Foto</button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-sans font-bold">Asesor Pendamping</label>
                    <input 
                      type="text" 
                      value={tempAsesor2} 
                      placeholder="Nama Asesor Pendamping"
                      onChange={(e) => setTempAsesor2(e.target.value)}
                      className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-[#f0e6d3]"
                      style={{ backgroundColor: `${currentTheme.bg}80`, borderColor: `${currentTheme.primary}30` }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      {tempPhoto2 && <img src={tempPhoto2} className="w-20 h-20 rounded-full object-cover border border-primary/30" alt="Preview 2" />}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, setTempPhoto2)}
                        className="text-[10px] text-primary/60 file:bg-primary/10 file:border-primary/20 file:text-primary file:rounded-sm file:px-2 file:py-1 file:mr-2 cursor-pointer"
                      />
                      {tempPhoto2 && (
                        <button onClick={() => setTempPhoto2('')} className="text-[10px] text-red-400 hover:underline">Hapus Foto</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={saveSettings}
                className="w-full mt-8 bg-primary text-bg font-sans font-bold py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer shadow-lg"
                style={{ backgroundColor: currentTheme.primary, color: currentTheme.bg }}
              >
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center transition-colors duration-1000 overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
        {/* Background Visuals */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="orb-gold w-[500px] h-[500px] -top-[10%] -left-[10%]" style={{ backgroundColor: currentTheme.orbColors[0] }} />
          <div className="orb-purple w-[600px] h-[600px] -bottom-[10%] -right-[10%]" style={{ animationDelay: '-5s', backgroundColor: currentTheme.orbColors[1] }} />
        </div>

        {/* Cinematic Frame */}
        <div className="absolute inset-8 border border-primary/20 pointer-events-none z-10" style={{ borderColor: `${currentTheme.primary}33` }}>
          <div 
            className="pointer-events-auto cursor-default absolute top-0 left-0"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
          >
            <Corner orientation="top-left" color={currentTheme.primary} />
          </div>
          <Corner orientation="top-right" color={currentTheme.primary} />
          <Corner orientation="bottom-left" color={currentTheme.primary} />
          <Corner orientation="bottom-right" color={currentTheme.primary} />
        </div>

        <main className="relative z-20 text-center flex flex-col items-center max-w-4xl px-6" key={sequenceKey}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ ...currentTheme.transition, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.6em] text-primary/80 mb-6 font-sans font-semibold"
            style={{ color: `${currentTheme.primary}cc` }}
          >
            {welcomeText}
          </motion.span>
          
          <motion.h1 
            className="hero-gradient-text font-display font-black text-4xl md:text-6xl mb-8 tracking-tight leading-tight flex flex-wrap justify-center overflow-hidden"
            style={{ backgroundImage: currentTheme.heroGradient }}
          >
            {schoolName.split("").map((char, index) => (
              <motion.span
                key={`${index}-${sequenceKey}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  ...currentTheme.transition,
                  delay: 0.4 + (index * 0.05),
                }}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...currentTheme.transition, delay: 0.8 }}
            className="flex items-center w-full max-w-lg mb-8 gap-6"
          >
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-primary/40 to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${currentTheme.primary}66, transparent)` }} />
            <div className="text-primary text-2xl" style={{ color: currentTheme.primary }}>◈</div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-primary/40 to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${currentTheme.primary}66, transparent)` }} />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...currentTheme.transition, delay: 1 }}
            className="text-xl md:text-2xl uppercase tracking-[0.2em] font-sans font-bold text-secondary mb-12"
            style={{ color: currentTheme.secondary }}
          >
            Tim Asesor Akreditasi
            <span className="block text-xs md:text-sm tracking-[0.4em] mt-2 text-[#f0e6d3]/60" style={{ color: currentTheme.id === 'minimal' ? '#334155a0' : '#f0e6d399' }}>{academicYear}</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <NameCard 
              name={asesorUtama} 
              role="Asesor Utama"
              photo={photoUtama}
              delay={1.4} 
              theme={currentTheme}
            />
            <NameCard 
              name={asesorPendamping} 
              role="Asesor Pendamping"
              photo={photoPendamping}
              delay={1.8} 
              theme={currentTheme}
            />
          </div>

          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ ...currentTheme.transition, delay: 2.4 }}
            className="mt-16 text-[10px] uppercase tracking-[0.3em] font-sans"
            style={{ color: currentTheme.id === 'minimal' ? '#334155' : '#f0e6d3' }}
          >
            {footerText}
          </motion.footer>
        </main>
      </div>

      {/* Particles Layer */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
          animate={{ x: p.x + p.tx, y: p.y + p.ty, scale: 0, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute w-1 h-1 rounded-full pointer-events-none z-30"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function NameCard({ name, role, photo, delay, theme }: { name: string; role: string; photo?: string; delay: number; theme: Theme }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...theme.transition, delay }}
      className="bg-surface/60 backdrop-blur-md border border-primary/20 p-8 rounded-lg flex flex-col items-center shadow-2xl relative overflow-hidden group min-w-[280px]"
      style={{ backgroundColor: `${theme.surface}99`, borderColor: `${theme.primary}33` }}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.primary}66, transparent)` }} />
      
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/20 transition-all overflow-hidden relative" style={{ backgroundColor: `${theme.primary}1a`, borderColor: `${theme.primary}4d` }}>
        {photo ? (
          <img src={photo} className="w-full h-full object-cover" alt={name} />
        ) : (
          <Award className="text-primary w-10 h-10" style={{ color: theme.primary }} />
        )}
      </div>

      <p className="text-xl font-bold font-serif tracking-wide text-center" style={{ color: theme.id === 'minimal' ? '#334155' : '#f0e6d3' }}>
        {name}
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mt-2 font-sans font-bold" style={{ color: `${theme.primary}99` }}>
        {role}
      </p>

      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ backgroundColor: `${theme.primary}0d` }} />
    </motion.div>
  );
}

function Corner({ orientation, color }: { orientation: string; color?: string }) {
  const styles: Record<string, string> = {
    'top-left': 'top-0 left-0 border-t-2 border-l-2',
    'top-right': 'top-0 right-0 border-t-2 border-r-2',
    'bottom-left': 'bottom-0 left-0 border-b-2 border-l-2',
    'bottom-right': 'bottom-0 right-0 border-b-2 border-r-2',
  };

  return (
    <div className={`absolute w-16 h-16 border-primary/60 ${styles[orientation]}`} style={{ borderColor: `${color}99` }} />
  );
}

