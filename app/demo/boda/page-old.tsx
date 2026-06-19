"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Heart, MapPin, Clock, Calendar, Music, ChevronDown, Send } from "lucide-react";
import { motion } from "framer-motion";
import { RSVPForm } from "@/components/rsvp/rsvp-form";
import type { RSVPConfig } from "@/lib/rsvp/types";
import { supabase } from "@/lib/supabase/client";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";

const bodaRSVPConfig: RSVPConfig = {
  eventId: 'demo-boda-elena-mateo',
  eventName: 'Boda de Elena & Mateo',
  fields: [
    { name: 'name', type: 'text', label: 'Tu nombre completo', placeholder: 'María García López', required: true },
    { name: 'guests', type: 'select', label: 'Número de asistentes', required: true, options: [
      { value: '1', label: 'Solo yo' },
      { value: '2', label: 'Yo + 1 asistente' },
      { value: '3', label: 'Yo + 2 asistentes' },
      { value: '4', label: 'Yo + 3 asistentes' },
    ]},
    { name: 'attendance', type: 'radio', label: '¿Podrás asistir?', required: true, options: [
      { value: 'yes', label: '¡Sí, asistiré!' },
      { value: 'no', label: 'No podré asistir' },
    ]},
  ],
  adapter: {
    type: 'both',
    googleScriptUrl: 'https://script.google.com/macros/s/AKfycbwC9KWNugCSqYoftsRvPdkIUKOLirdFupkgcD0MszMVgw7i-sJJkseS1yJ7lLBayf1fnw/exec',
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
    supabaseTable: 'rsvps',
  },
  theme: {
    primaryColor: 'primary',
    accentColor: 'mint',
    buttonClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    radioActiveClass: 'border-primary bg-primary text-primary-foreground',
    radioInactiveClass: 'border-border bg-background text-foreground hover:border-primary/50',
    successIconClass: 'bg-mint',
  },
  labels: {
    title: 'Confirma tu Asistencia',
    subtitle: 'Nos encantaría contar contigo en nuestro día especial',
    submitButton: 'Enviar confirmación',
    successTitle: '¡Gracias por confirmar!',
    successMessage: 'Nos vemos el 15 de Junio. ¡No podemos esperar para celebrar juntos!',
    declineTitle: 'Gracias por avisarnos',
    declineMessage: 'Lamentamos que no puedas acompañarnos. ¡Te echaremos de menos!',
  },
};

// ── Wishes ──────────────────────────────────────────────────────────────────
interface Wish { id: string; name: string; message: string; emoji: string }

const MOCK_WISHES: Wish[] = [
  { id: 'm1', name: 'Abuela Carmen',  message: '¡Qué felicidad tan grande! Os deseo todo el amor del mundo. Cuídense mucho, mis niños. 💕',         emoji: '🌹' },
  { id: 'm2', name: 'Carlos & Lucía', message: 'Por una vida llena de risas, aventuras y café compartido. ¡Sois la pareja más bonita que conozco!',   emoji: '💍' },
  { id: 'm3', name: 'Papá de Elena',  message: 'Mi niña, hoy eres más feliz que nunca. Mateo, cuídala como se merece. ¡Os quiero enormemente! 🥂',   emoji: '🥂' },
  { id: 'm4', name: 'Tía Rosa',       message: '¡Que la vida os regale tantos años juntos como risas habéis compartido! Felicidades a los dos. ✨',    emoji: '✨' },
];

const WISH_EMOJIS = ['🌹', '💍', '💕', '🥂', '✨', '🎊', '💐', '🕊️'];
const WISH_COLORS = ['from-rose-50 to-pink-50 border-rose-200', 'from-purple-50 to-lilac-50 border-purple-200', 'from-emerald-50 to-teal-50 border-emerald-200', 'from-amber-50 to-yellow-50 border-amber-200'];

// ── Petals ───────────────────────────────────────────────────────────────────
const PETAL_COLORS = ['#fda4af', '#fb7185', '#f9a8d4', '#e879f9', '#fbbf24'];

export default function BodaDemo() {
  const [isVisible, setIsVisible]   = useState(false);
  const [isPlaying, setIsPlaying]   = useState(false);
  const audioRef                     = useRef<HTMLAudioElement>(null);

  // Countdown
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Wishes
  const [wishes,        setWishes]        = useState<Wish[]>(MOCK_WISHES);
  const [wishName,      setWishName]      = useState('');
  const [wishMsg,       setWishMsg]       = useState('');
  const [wishEmoji,     setWishEmoji]     = useState('💕');
  const [wishSending,   setWishSending]   = useState(false);
  const [wishSent,      setWishSent]      = useState(false);

  // Petals — generated once, stable reference
  const petals = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id:       i,
    left:     Math.random() * 100,
    delay:    Math.random() * 12,
    duration: 9 + Math.random() * 9,
    size:     10 + Math.random() * 14,
    color:    PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    sway:     (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40),
    rot:      Math.random() * 360,
  })), []);

  useEffect(() => {
    setIsVisible(true);

    // Load extra wishes from localStorage
    try {
      const stored = localStorage.getItem('boda-wishes');
      if (stored) {
        const extra: Wish[] = JSON.parse(stored);
        setWishes(prev => [...prev, ...extra]);
      }
    } catch {}

    // Countdown ticker
    const WEDDING = new Date('2026-06-15T17:00:00+02:00').getTime();
    const tick = () => {
      const diff = WEDDING - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1_000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(p => !p);
  };

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMsg.trim()) return;
    setWishSending(true);

    const newWish: Wish = {
      id:      `u-${Date.now()}`,
      name:    wishName.trim(),
      message: wishMsg.trim(),
      emoji:   wishEmoji,
    };

    // Persist locally
    try {
      const stored: Wish[] = JSON.parse(localStorage.getItem('boda-wishes') ?? '[]');
      stored.push(newWish);
      localStorage.setItem('boda-wishes', JSON.stringify(stored));
    } catch {}

    // Best-effort Supabase insert
    try {
      await supabase.from('rsvps').insert({
        event_id: 'demo-boda-deseos',
        data: { name: newWish.name, message: newWish.message, emoji: newWish.emoji },
      });
    } catch {}

    setWishes(prev => [...prev, newWish]);
    setWishName('');
    setWishMsg('');
    setWishEmoji('💕');
    setWishSending(false);
    setWishSent(true);
    setTimeout(() => setWishSent(false), 3000);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <main className="relative bg-background overflow-x-hidden">
      <audio ref={audioRef} loop>
        <source src="/demo/audio/romantic-piano.mp3" type="audio/mpeg" />
      </audio>

      {/* ── Falling petals (fixed, full screen) ── */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
        {petals.map(p => (
          <div
            key={p.id}
            className="petal absolute"
            style={{
              left: `${p.left}%`,
              width:  `${p.size}px`,
              height: `${p.size * 1.5}px`,
              background: `linear-gradient(135deg, ${p.color}cc, ${p.color}88)`,
              borderRadius: '0 100% 0 100%',
              transform: `rotate(${p.rot}deg)`,
              animationDuration: `${p.duration}s`,
              animationDelay:    `${p.delay}s`,
              '--sway': `${p.sway}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Music button */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        <Music className={`w-6 h-6 text-primary-foreground ${isPlaying ? 'animate-pulse' : ''}`} />
      </button>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-lilac-light rounded-full blur-3xl transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-mint-light rounded-full blur-3xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-40' : 'opacity-0'}`} />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className={`space-y-10 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            {/* Animated rings SVG */}
            <div className="flex justify-center">
              <svg width="88" height="52" viewBox="0 0 88 52" className="drop-shadow-md">
                <circle cx="30" cy="26" r="20" fill="none" stroke="#c084fc" strokeWidth="5" className="ring-left" />
                <circle cx="58" cy="26" r="20" fill="none" stroke="#a8a29e" strokeWidth="5" className="ring-right" />
                <circle cx="44" cy="26" r="6" fill="#c084fc" opacity="0.6" />
              </svg>
            </div>

            {/* Names */}
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-primary">
                Elena & Mateo
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-widest uppercase text-sm">
                se casan el
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-foreground">
                15 de Junio, 2026 · Sevilla
              </p>
            </div>

            {/* ── Countdown ── */}
            <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-sm md:max-w-md mx-auto">
              {[
                { v: countdown.days,    l: 'Días' },
                { v: countdown.hours,   l: 'Horas' },
                { v: countdown.minutes, l: 'Min' },
                { v: countdown.seconds, l: 'Seg' },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center gap-1 p-3 md:p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary/20 shadow-sm">
                  <span className="text-3xl md:text-4xl font-black text-primary tabular-nums leading-none">
                    {pad(v)}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {l}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 animate-bounce">
              <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Nuestra <span className="font-serif text-primary">Historia</span>
            </h2>
            <p className="text-muted-foreground text-lg">Un viaje de amor que comenzó hace 5 años</p>
          </motion.div>

          <div className="space-y-16">
            {[
              {
                year: '2021 · El Primer Encuentro',
                title: 'Una tarde de café ☕',
                text: 'Nuestros caminos se cruzaron en una pequeña cafetería de Madrid. Elena pidió un capuchino, Mateo un café solo. Ambos llevaban el mismo libro. La conversación fluyó como si nos conociéramos de toda la vida.',
                bg: 'from-rose-100 to-pink-50',
                icon: '☕',
                flip: false,
              },
              {
                year: '2022 · Nuestro Primer Viaje',
                title: 'Lisboa bajo la lluvia 🌧️',
                text: 'Escapada de fin de semana que se convirtió en una aventura inolvidable. Bailamos bajo la lluvia en el Mirador de Santa Lucía. Fue ahí donde Mateo supo que Elena era "la indicada".',
                bg: 'from-emerald-100 to-teal-50',
                icon: '🌧️',
                flip: true,
              },
              {
                year: '2025 · La Propuesta',
                title: '¿Quieres casarte conmigo? 💍',
                text: 'En la misma cafetería donde todo comenzó, con las mismas tazas y el mismo libro. Mateo se arrodilló. Elena dijo "sí" antes de que pudiera terminar la pregunta. Los aplausos de los desconocidos aún resuenan en nuestra memoria.',
                bg: 'from-purple-100 to-lilac-50',
                icon: '💍',
                flip: false,
              },
            ].map(({ year, title, text, bg, icon, flip }, i) => (
              <div key={year} className={`flex flex-col ${flip ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                <motion.div
                  className="md:w-1/2 space-y-4"
                  initial={{ opacity: 0, x: flip ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
                >
                  <div className="inline-block px-4 py-2 bg-lilac-light rounded-full text-primary font-semibold text-sm">
                    {year}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </motion.div>
                <motion.div
                  className="md:w-1/2"
                  initial={{ opacity: 0, x: flip ? -60 : 60, scale: 0.92 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 0.22 }}
                >
                  <div className={`aspect-square rounded-3xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-inner`}>
                    <span className="text-7xl drop-shadow-sm">{icon}</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event details ── */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Detalles del <span className="font-serif text-primary">Evento</span>
            </h2>
            <p className="text-muted-foreground text-lg">Todo lo que necesitas saber para celebrar con nosotros</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="p-8 rounded-3xl bg-gradient-to-br from-lilac-light/50 to-background border-2 border-border space-y-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ceremonia</h3>
                <p className="text-muted-foreground">Capilla de San Juan, Sevilla</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground"><Clock   className="w-5 h-5 text-primary" /><span>17:00h</span></div>
                <div className="flex items-center gap-3 text-foreground"><MapPin  className="w-5 h-5 text-primary" /><span>Calle Real de la Alhambra, 23</span></div>
                <div className="flex items-center gap-3 text-foreground"><Calendar className="w-5 h-5 text-primary" /><span>15 de Junio, 2026</span></div>
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-3xl bg-gradient-to-br from-mint-light/50 to-background border-2 border-border space-y-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-mint flex items-center justify-center">
                <Heart className="w-8 h-8 text-mint-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Celebración</h3>
                <p className="text-muted-foreground">Cortijo Los Olivos</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground"><Clock   className="w-5 h-5 text-mint" /><span>19:30h – 02:00h</span></div>
                <div className="flex items-center gap-3 text-foreground"><MapPin  className="w-5 h-5 text-mint" /><span>Carretera de Carmona, km 7</span></div>
                <div className="flex items-center gap-3 text-foreground"><Calendar className="w-5 h-5 text-mint" /><span>15 de Junio, 2026</span></div>
              </div>
            </motion.div>
          </div>

          {/* Dress code — visual palette */}
          <div className="mt-12 p-8 rounded-3xl bg-muted/40 text-center space-y-5">
            <h3 className="text-xl font-semibold text-foreground">Código de vestimenta</h3>
            <p className="text-muted-foreground">Elegante · Colores claros · Disfruta del sol de Sevilla</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { color: '#fdf6e3', label: 'Crema'      },
                { color: '#f3e5d8', label: 'Nude'       },
                { color: '#d4e8d8', label: 'Sage'       },
                { color: '#dce8f5', label: 'Celeste'    },
                { color: '#ead5e8', label: 'Lavanda'    },
              ].map(({ color, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1 opacity-40">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-white relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-lg">🚫</div>
                </div>
                <span className="text-xs text-muted-foreground">Blanco novia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Libro de deseos ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Libro de <span className="font-serif text-primary">Deseos</span>
            </h2>
            <p className="text-muted-foreground text-lg">Déjales un mensaje que recordarán para siempre</p>
          </div>

          {/* Wishes grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {wishes.map((w, i) => (
              <div
                key={w.id}
                className={`p-5 rounded-2xl border bg-gradient-to-br ${WISH_COLORS[i % WISH_COLORS.length]} space-y-2 shadow-sm`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{w.emoji}</span>
                  <span className="font-bold text-foreground">{w.name}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{w.message}</p>
              </div>
            ))}
          </div>

          {/* Wish form */}
          <div className="bg-white/80 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 shadow-lg max-w-xl mx-auto">
            {wishSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-5xl animate-bounce">💌</div>
                <h3 className="text-xl font-bold text-foreground">¡Gracias por tu mensaje!</h3>
                <p className="text-muted-foreground">Elena & Mateo lo leerán con mucho amor.</p>
              </div>
            ) : (
              <form onSubmit={submitWish} className="space-y-5">
                <h3 className="text-lg font-bold text-foreground text-center">¡Deja tu deseo! 💌</h3>

                <input
                  type="text"
                  value={wishName}
                  onChange={e => setWishName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />

                <textarea
                  value={wishMsg}
                  onChange={e => setWishMsg(e.target.value)}
                  placeholder="Escribe tu mensaje para los novios…"
                  required
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                />

                {/* Emoji picker */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Elige un emoji:</p>
                  <div className="flex gap-2 flex-wrap">
                    {WISH_EMOJIS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setWishEmoji(e)}
                        className={`text-2xl p-2 rounded-xl transition-all ${wishEmoji === e ? 'bg-primary/15 scale-110 ring-2 ring-primary/40' : 'hover:bg-muted'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={wishSending || !wishName.trim() || !wishMsg.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-3 rounded-xl transition-all"
                >
                  <Send className="w-4 h-4" />
                  {wishSending ? 'Enviando…' : 'Enviar deseo'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Confirma tu <span className="font-serif text-primary">Asistencia</span>
            </h2>
            <p className="text-muted-foreground text-lg">Nos encantaría contar contigo en nuestro día especial</p>
          </div>
          <RSVPForm config={bodaRSVPConfig} />
        </div>
      </section>

      {/* ── Footer ── */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground mb-4">Esta es una demo de invitación web creada por</p>
          <a href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors">
            ← Volver a Momento Wow
          </a>
        </div>
      </section>

      <style jsx>{`
        @keyframes petal-fall {
          0%   { transform: translateY(-40px) translateX(0px) rotate(0deg);             opacity: 0; }
          8%   { opacity: 0.75; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(105vh) translateX(var(--sway)) rotate(540deg);   opacity: 0; }
        }
        .petal {
          animation: petal-fall linear infinite;
          will-change: transform;
        }
        .ring-left  { animation: ring-spin 6s ease-in-out infinite alternate; transform-origin: center; }
        .ring-right { animation: ring-spin 6s ease-in-out infinite alternate-reverse; transform-origin: center; }
        @keyframes ring-spin {
          0%   { transform: rotate(-4deg) scale(1); }
          100% { transform: rotate(4deg)  scale(1.04); }
        }
      `}</style>
    </main>
  );
}
