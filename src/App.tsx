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
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('schoolName') || 'MTS DARUL HUDA');
  const [asesorUtama, setAsesorUtama] = useState(() => localStorage.getItem('asesorUtama') || 'BPK. ABDUL LATIF ANWAR, S.Ag');
  const [asesorPendamping, setAsesorPendamping] = useState(() => localStorage.getItem('asesorPendamping') || 'BPK. MOHAMMAD ROZIM, M.Pd.I');
  const [photoUtama, setPhotoUtama] = useState(() => localStorage.getItem('photoUtama') || '');
  const [photoPendamping, setPhotoPendamping] = useState(() => localStorage.getItem('photoPendamping') || '');

  // Temporary states for form
  const [tempSchool, setTempSchool] = useState(schoolName);
  const [tempAsesor1, setTempAsesor1] = useState(asesorUtama);
  const [tempAsesor2, setTempAsesor2] = useState(asesorPendamping);
  const [tempPhoto1, setTempPhoto1] = useState(photoUtama);
  const [tempPhoto2, setTempPhoto2] = useState(photoPendamping);

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
      setTempSchool(schoolName);
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
    setSchoolName(tempSchool);
    setAsesorUtama(tempAsesor1);
    setAsesorPendamping(tempAsesor2);
    setPhotoUtama(tempPhoto1);
    setPhotoPendamping(tempPhoto2);
    localStorage.setItem('schoolName', tempSchool);
    localStorage.setItem('asesorUtama', tempAsesor1);
    localStorage.setItem('asesorPendamping', tempAsesor2);
    localStorage.setItem('photoUtama', tempPhoto1);
    localStorage.setItem('photoPendamping', tempPhoto2);
    setIsSettingsOpen(false);
    setSequenceKey(prev => prev + 1); // Reset animation to show changes
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-bg font-serif select-none"
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
    >
      {/* Invisible Hold Progress Indicator */}
      <AnimatePresence>
        {isHolding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-1 z-[60] bg-primary/10"
          >
            <motion.div 
              className="h-full bg-primary shadow-[0_0_10px_#e8b931]"
              style={{ width: `${holdProgress}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2 font-sans font-bold">Nama Madrasah</label>
                  <input 
                    type="text" 
                    value={tempSchool} 
                    onChange={(e) => setTempSchool(e.target.value.toUpperCase())}
                    className="w-full bg-bg/50 border border-primary/20 rounded-sm p-3 text-sm focus:outline-none focus:border-primary/50 transition-colors uppercase text-[#f0e6d3]"
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
              >
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a12]">
        {/* Background Visuals */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="orb-gold w-[500px] h-[500px] -top-[10%] -left-[10%]" />
          <div className="orb-purple w-[600px] h-[600px] -bottom-[10%] -right-[10%]" style={{ animationDelay: '-5s' }} />
        </div>

        {/* Cinematic Frame */}
        <div className="absolute inset-8 border border-primary/20 pointer-events-none z-10">
          <Corner orientation="top-left" />
          <Corner orientation="top-right" />
          <Corner orientation="bottom-left" />
          <Corner orientation="bottom-right" />
        </div>

        <main className="relative z-20 text-center flex flex-col items-center max-w-4xl px-6" key={sequenceKey}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs uppercase tracking-[0.6em] text-primary/80 mb-6 font-sans font-semibold"
          >
            Selamat Datang Di
          </motion.span>
          
          <motion.h1 
            className="hero-gradient-text font-display font-black text-4xl md:text-6xl mb-8 tracking-tight leading-tight flex flex-wrap justify-center overflow-hidden"
          >
            {schoolName.split("").map((char, index) => (
              <motion.span
                key={`${index}-${sequenceKey}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.4 + (index * 0.05),
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
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
            transition={{ delay: 0.8, duration: 1 }}
            className="flex items-center w-full max-w-lg mb-8 gap-6"
          >
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="text-primary text-2xl">◈</div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-2xl uppercase tracking-[0.2em] font-sans font-bold text-secondary mb-12"
          >
            Tim Asesor Akreditasi
            <span className="block text-xs md:text-sm tracking-[0.4em] mt-2 text-[#f0e6d3]/60">Tahun Akademik 2026</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <NameCard 
              name={asesorUtama} 
              role="Asesor Utama"
              photo={photoUtama}
              delay={1.4} 
            />
            <NameCard 
              name={asesorPendamping} 
              role="Asesor Pendamping"
              photo={photoPendamping}
              delay={1.8} 
            />
          </div>

          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2.4 }}
            className="mt-16 text-[10px] uppercase tracking-[0.3em] font-sans"
          >
            Professionalism • Integrity • Excellence
          </motion.footer>
        </main>

        <div className="absolute bottom-0 left-0 w-full h-[6px] flex">
          <div className="h-full w-1/4 bg-primary" />
          <div className="h-full w-1/4 bg-secondary" />
          <div className="h-full w-1/4 bg-accent-blue" />
          <div className="h-full w-1/4 bg-primary" />
        </div>
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

function NameCard({ name, role, photo, delay }: { name: string; role: string; photo?: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface/60 backdrop-blur-md border border-primary/20 p-8 rounded-lg flex flex-col items-center shadow-2xl relative overflow-hidden group min-w-[280px]"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary/20 transition-all overflow-hidden relative">
        {photo ? (
          <img src={photo} className="w-full h-full object-cover" alt={name} />
        ) : (
          <Award className="text-primary w-10 h-10" />
        )}
      </div>

      <p className="text-xl font-bold font-serif tracking-wide text-center">
        {name}
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mt-2 font-sans font-bold">
        {role}
      </p>

      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

function Corner({ orientation }: { orientation: string }) {
  const styles: Record<string, string> = {
    'top-left': 'top-0 left-0 border-t-2 border-l-2',
    'top-right': 'top-0 right-0 border-t-2 border-r-2',
    'bottom-left': 'bottom-0 left-0 border-b-2 border-l-2',
    'bottom-right': 'bottom-0 right-0 border-b-2 border-r-2',
  };

  return (
    <div className={`absolute w-16 h-16 border-primary/60 ${styles[orientation]}`} />
  );
}
