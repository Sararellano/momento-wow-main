"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { Heart, Gift, Calendar, MapPin, Clock, Music, Star, Baby, Sparkles, Send, Check, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RSVPForm } from "@/components/rsvp/rsvp-form"
import type { RSVPConfig } from "@/lib/rsvp/types"
import { supabase } from "@/lib/supabase/client"
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config"

// ── Config ───────────────────────────────────────────────────────────────────
const EVENT_DATE = new Date("2026-09-20T16:00:00+02:00")

const babyShowerRSVPConfig: RSVPConfig = {
  eventId: "demo-baby-shower-sofia",
  eventName: "Baby Shower de Sofía",
  fields: [
    { name: "name", type: "text", label: "Tu nombre", placeholder: "¿Cómo te llamas?", required: true },
    { name: "attendance", type: "radio", label: "¿Podrás asistir?", required: true, options: [
      { value: "yes", label: "Sí, allí estaré" },
      { value: "no", label: "No podré ir" },
    ]},
    { name: "message", type: "textarea", label: "Mensaje para los papás (opcional)", placeholder: "Escribe tu mensaje de cariño..." },
  ],
  adapter: {
    type: "both",
    googleScriptUrl: "https://script.google.com/macros/s/AKfycbwC9KWNugCSqYoftsRvPdkIUKOLirdFupkgcD0MszMVgw7i-sJJkseS1yJ7lLBayf1fnw/exec",
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
    supabaseTable: "rsvps",
  },
  theme: {
    primaryColor: "pink-400",
    accentColor: "mint",
    labelClass: "text-pink-400",
    cardClass: "bg-white/90 backdrop-blur-sm border-0 shadow-none",
    buttonClass: "bg-gradient-to-r from-pink-400 to-pink-300 hover:from-pink-500 hover:to-pink-400 text-white shadow-lg shadow-pink-200/50 rounded-2xl",
    radioActiveClass: "border-pink-400 bg-pink-400 text-white",
    radioInactiveClass: "border-pink-100 bg-white/80 text-pink-300 hover:border-pink-300",
    successIconClass: "bg-mint-100",
  },
  labels: {
    title: "Confirma tu asistencia",
    subtitle: "Tu presencia hará este día más especial",
    submitButton: "Confirmar asistencia",
    successTitle: "Gracias por confirmar",
    successMessage: "Te esperamos con mucha ilusión",
    declineTitle: "Gracias por avisarnos",
    declineMessage: "Te echaremos de menos",
  },
}

// ── Gift list ────────────────────────────────────────────────────────────────
interface GiftItem { id: string; emoji: string; name: string; price: string; reserved: boolean; reservedBy: string }

const DEFAULT_GIFTS: GiftItem[] = [
  { id: "g1", emoji: "🍼", name: "Kit de biberones",        price: "20–30€",   reserved: false,  reservedBy: "" },
  { id: "g2", emoji: "🛁", name: "Bañera portátil",         price: "30–50€",   reserved: false,  reservedBy: "" },
  { id: "g3", emoji: "🧸", name: "Peluche gigante",          price: "25–40€",   reserved: true,   reservedBy: "Abuela Carmen" },
  { id: "g4", emoji: "👗", name: "Pack ropa 0–3 meses",     price: "30–50€",   reserved: false,  reservedBy: "" },
  { id: "g5", emoji: "🌙", name: "Proyector de estrellas",  price: "40–60€",   reserved: false,  reservedBy: "" },
  { id: "g6", emoji: "🎵", name: "Caja musical",            price: "25–35€",   reserved: true,   reservedBy: "Tía Rosa" },
  { id: "g7", emoji: "🚗", name: "Sillita de paseo",        price: "150–200€", reserved: false,  reservedBy: "" },
  { id: "g8", emoji: "💊", name: "Set salud del bebé",      price: "20–30€",   reserved: false,  reservedBy: "" },
]

// ── Confetti colors ──────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#fda4af","#fb7185","#f9a8d4","#fce7f3","#ffffff","#ff80ab","#ffb3c6","#ffd6e0","#c084fc","#f472b6"]

// ── Balloon SVG ──────────────────────────────────────────────────────────────
function BalloonSVG({ color, size = 44 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 44 66" aria-hidden="true">
      <ellipse cx="22" cy="22" rx="18" ry="20" fill={color} />
      <ellipse cx="15" cy="13" rx="5" ry="6" fill="white" opacity="0.28" transform="rotate(-25 15 13)" />
      <path d="M22 42 Q20 48 22 53 Q24 48 22 42" fill={color} />
      <path d="M16 53 Q22 58 28 53" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Countdown unit ───────────────────────────────────────────────────────────
function CountdownUnit({ value, label }: { value: number; label: string }) {
  const prev = useRef(value)
  const [flip, setFlip] = useState(false)
  useEffect(() => {
    if (prev.current !== value) {
      setFlip(true)
      const t = setTimeout(() => setFlip(false), 300)
      prev.current = value
      return () => clearTimeout(t)
    }
  }, [value])
  return (
    <div className="flex flex-col items-center">
      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-lg border-2 border-pink-100 flex items-center justify-center transition-transform duration-300 ${flip ? "scale-95" : "scale-100"}`}>
        <span className={`text-3xl sm:text-4xl font-bold text-pink-400 transition-all duration-300 ${flip ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-3 text-sm text-pink-300 font-medium tracking-wide uppercase">{label}</span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BabyShowerDemo() {
  // Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1_000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Gender reveal
  const [revealed,   setRevealed]   = useState(false)
  const [showBurst,  setShowBurst]  = useState(false)

  const confettiPieces = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    x:   (Math.random() - 0.5) * 220,
    y:   -(30 + Math.random() * 90),
    rot: Math.random() * 720,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.4,
    dur:  1.4 + Math.random() * 0.8,
    size: 8 + Math.random() * 7,
  })), [])

  const handleReveal = () => {
    setRevealed(true)
    setShowBurst(true)
    setTimeout(() => setShowBurst(false), 2400)
  }

  // Baby guesses
  const [guessName,      setGuessName]      = useState("")
  const [guessBabyName,  setGuessBabyName]  = useState("")
  const [guessDate,      setGuessDate]      = useState("")
  const [guessWeight,    setGuessWeight]    = useState("")
  const [guessTime,      setGuessTime]      = useState("")
  const [guessSending,   setGuessSending]   = useState(false)
  const [guessDone,      setGuessDone]      = useState(false)
  const [guessCount,     setGuessCount]     = useState(7) // seed with plausible count

  // Gift list
  const [gifts,        setGifts]        = useState<GiftItem[]>(DEFAULT_GIFTS)
  const [reservingId,  setReservingId]  = useState<string | null>(null)
  const [reserverName, setReserverName] = useState("")

  useEffect(() => {
    // Load persisted gift reservations
    try {
      const saved = localStorage.getItem("bs-gifts")
      if (saved) setGifts(JSON.parse(saved))
    } catch {}
    // Load guess count
    try {
      const n = localStorage.getItem("bs-guess-count")
      if (n) setGuessCount(Number(n))
    } catch {}
  }, [])

  // Balloons — stable random values
  const balloons = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    size: 32 + Math.random() * 20,
    dur:  5  + Math.random() * 6,
    delay: Math.random() * 4,
    color: ["#fda4af","#f9a8d4","#86efac","#c084fc","#fcd34d"][i % 5],
  })), [])

  const [isPlaying, setIsPlaying] = useState(false)

  // Submit guess
  const submitGuess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guessName.trim()) return
    setGuessSending(true)

    const next = guessCount + 1
    setGuessCount(next)
    try { localStorage.setItem("bs-guess-count", String(next)) } catch {}

    supabase.from("rsvps").insert({
      event_id: "demo-baby-shower-apuestas",
      data: { name: guessName, babyName: guessBabyName, date: guessDate, weight: guessWeight, time: guessTime },
    }).then(() => {}).catch(() => {})

    setGuessSending(false)
    setGuessDone(true)
  }

  // Reserve gift
  const confirmReservation = (giftId: string) => {
    if (!reserverName.trim()) return
    const updated = gifts.map(g =>
      g.id === giftId ? { ...g, reserved: true, reservedBy: reserverName.trim() } : g
    )
    setGifts(updated)
    try { localStorage.setItem("bs-gifts", JSON.stringify(updated)) } catch {}

    supabase.from("rsvps").insert({
      event_id: "demo-baby-shower-regalos",
      data: { giftId, giftName: gifts.find(g => g.id === giftId)?.name, reservedBy: reserverName.trim() },
    }).then(() => {}).catch(() => {})

    setReservingId(null)
    setReserverName("")
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 as const },
    transition: { duration: 0.55, ease: "easeOut" as const, delay },
  })

  const eventDetails = {
    babyName: "Sofía",
    parents:  "María y Carlos",
    date:     "Domingo 20 de Septiembre, 2026",
    time:     "16:00",
    location: "Jardín de Eventos La Rosa",
    address:  "Calle de las Flores 123, Madrid",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-mint-50 overflow-x-hidden">

      {/* ── Floating balloons ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {balloons.map(b => (
          <div
            key={b.id}
            className="balloon absolute bottom-0"
            style={{
              left: `${b.left}%`,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
            }}
          >
            <BalloonSVG color={b.color} size={b.size} />
          </div>
        ))}
      </div>

      {/* ── Confetti burst (gender reveal) ── */}
      {showBurst && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          {confettiPieces.map((p, i) => (
            <div
              key={i}
              className="confetti-piece absolute"
              style={{
                left: "50%",
                top: "35%",
                width:  `${p.size}px`,
                height: `${Math.round(p.size * 0.55)}px`,
                background: p.color,
                borderRadius: "2px",
                "--tx": `${p.x}vw`,
                "--ty": `${p.y}vh`,
                "--rot": `${p.rot}deg`,
                animationDuration: `${p.dur}s`,
                animationDelay:    `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* ── Hero ── */}
      <header className="relative pt-12 pb-16 px-4 z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp(0)} className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center shadow-lg shadow-pink-100">
                <Baby className="w-12 h-12 text-pink-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-mint-200 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-400" />
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="space-y-3">
            <p className="text-pink-300 text-sm uppercase tracking-widest">Estás invitado/a al</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-pink-400 leading-tight">
              Baby Shower
            </h1>
            <p className="text-2xl sm:text-3xl font-serif text-mint-500">
              de {eventDetails.babyName}
            </p>
            <p className="text-lg text-pink-300 max-w-md mx-auto leading-relaxed">
              {eventDetails.parents} te invitan a celebrar la próxima llegada de su pequeña princesa
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 shadow-md text-pink-400 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
              <span className="text-sm">{isPlaying ? "Pausar música" : "Reproducir música"}</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* ── Gender reveal ── */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-lg mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
              {!revealed ? (
                <div className="p-10 bg-gradient-to-br from-pink-50 to-purple-50 space-y-6">
                  <div className="text-6xl">🎀</div>
                  <h2 className="text-2xl font-serif text-pink-400">¿Niño o niña?</h2>
                  <p className="text-pink-300">María y Carlos llevan meses guardando el secreto…</p>
                  <button
                    onClick={handleReveal}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-400 via-pink-300 to-purple-300 hover:from-pink-500 hover:via-pink-400 hover:to-purple-400 text-white font-black text-xl shadow-lg shadow-pink-200 hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    🎀 ¡Descubre el sexo del bebé!
                  </button>
                </div>
              ) : (
                <div className="p-10 bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-50 space-y-5">
                  <div className="text-7xl animate-bounce">👧</div>
                  <h2 className="text-4xl font-black text-pink-500">¡Es una niña!</h2>
                  <p className="text-pink-400 text-lg font-semibold">Sofía está en camino 💕</p>
                  <div className="flex justify-center gap-2 text-3xl">
                    {["🌸","💕","🎀","✨","🌷"].map((e, i) => (
                      <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Countdown ── */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <h2 className="text-2xl font-serif text-pink-400 mb-2">Cuenta regresiva</h2>
            <p className="text-pink-300">para conocer a {eventDetails.babyName}</p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="flex justify-center gap-4 sm:gap-6">
            <CountdownUnit value={timeLeft.days}    label="Días" />
            <CountdownUnit value={timeLeft.hours}   label="Horas" />
            <CountdownUnit value={timeLeft.minutes} label="Min" />
            <CountdownUnit value={timeLeft.seconds} label="Seg" />
          </motion.div>
        </div>
      </section>

      {/* ── Event details ── */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp(0)}>
            <Card className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl shadow-pink-100/50 border-0 overflow-hidden">
              <div className="p-8 sm:p-10">
                <h2 className="text-2xl font-serif text-pink-400 text-center mb-8">Detalles del evento</h2>
                <div className="space-y-4">
                  {[
                    { icon: Calendar, label: "Fecha",  text: eventDetails.date,     bg: "bg-pink-50" },
                    { icon: Clock,    label: "Hora",   text: `${eventDetails.time} hrs`, bg: "bg-mint-50" },
                    { icon: MapPin,   label: "Lugar",  text: eventDetails.location,  sub: eventDetails.address, bg: "bg-pink-50" },
                  ].map(({ icon: Icon, label, text, sub, bg }) => (
                    <div key={label} className={`flex items-start gap-4 p-4 rounded-2xl ${bg}/50 hover:${bg} transition-colors`}>
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-pink-400 mb-0.5">{label}</h3>
                        <p className="text-pink-300 capitalize">{text}</p>
                        {sub && <p className="text-pink-200 text-sm mt-0.5">{sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6 rounded-2xl border-pink-200 text-pink-400 hover:bg-pink-50 hover:text-pink-500 py-6 bg-transparent">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver en Google Maps
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Baby guesses ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-purple-50/40 to-transparent relative z-10">
        <div className="max-w-xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-8">
            <h2 className="text-2xl font-serif text-pink-400 mb-2">Adivina el bebé 🔮</h2>
            <p className="text-pink-300">¿Cuándo llegará Sofía? ¡Haz tus apuestas!</p>
            <p className="mt-2 text-sm font-semibold text-purple-400">
              Ya hay <span className="text-purple-600 text-base">{guessCount}</span> personas que han apostado ✨
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <Card className="rounded-3xl border-0 shadow-xl shadow-pink-100/50 bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="p-8">
                {guessDone ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="text-5xl animate-bounce">🔮</div>
                    <h3 className="text-xl font-bold text-pink-400">¡Apuesta enviada!</h3>
                    <p className="text-pink-300">María y Carlos verán todas las predicciones después del parto 🎉</p>
                  </div>
                ) : (
                  <form onSubmit={submitGuess} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-pink-400 mb-1.5">Tu nombre *</label>
                      <input value={guessName} onChange={e => setGuessName(e.target.value)} required placeholder="¿Quién hace la apuesta?"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm placeholder:text-pink-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pink-400 mb-1.5">Nombre favorito para el bebé</label>
                      <input value={guessBabyName} onChange={e => setGuessBabyName(e.target.value)} placeholder="Sofía, Emma, Lucía…"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm placeholder:text-pink-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pink-400 mb-1.5">Fecha de nacimiento estimada</label>
                      <input type="date" value={guessDate} onChange={e => setGuessDate(e.target.value)}
                        min="2026-08-01" max="2026-11-30"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pink-400 mb-1.5">Peso estimado</label>
                        <select value={guessWeight} onChange={e => setGuessWeight(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-pink-400">
                          <option value="">Elige…</option>
                          <option>Menos de 3 kg</option>
                          <option>3.0 – 3.4 kg</option>
                          <option>3.5 – 3.9 kg</option>
                          <option>Más de 4 kg</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pink-400 mb-1.5">Hora de llegada</label>
                        <select value={guessTime} onChange={e => setGuessTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-pink-400">
                          <option value="">Elige…</option>
                          <option>Madrugada (0–6h)</option>
                          <option>Mañana (6–12h)</option>
                          <option>Tarde (12–18h)</option>
                          <option>Noche (18–24h)</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={guessSending || !guessName.trim()}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold transition-all">
                      <Send className="w-4 h-4" />
                      {guessSending ? "Enviando…" : "¡Enviar apuesta!"}
                    </button>
                  </form>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Gift list ── */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-8">
            <h2 className="text-2xl font-serif text-pink-400 mb-2">Lista de regalos 🎁</h2>
            <p className="text-pink-300">Reserva tu regalo para que nadie regale lo mismo</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {gifts.map((gift, i) => (
              <motion.div key={gift.id} {...fadeUp(i * 0.05)}>
                <Card className={`rounded-2xl border-0 shadow-md overflow-hidden transition-all duration-300 ${gift.reserved ? "bg-gray-50" : "bg-white hover:shadow-lg"}`}>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{gift.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${gift.reserved ? "text-gray-400" : "text-pink-400"}`}>{gift.name}</p>
                        <p className="text-xs text-pink-300">{gift.price}</p>
                      </div>
                      {gift.reserved && <Lock className="w-4 h-4 text-gray-300 shrink-0" />}
                    </div>

                    {gift.reserved ? (
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Reservado por <strong>{gift.reservedBy}</strong></span>
                      </div>
                    ) : reservingId === gift.id ? (
                      <div className="space-y-2">
                        <input
                          autoFocus
                          value={reserverName}
                          onChange={e => setReserverName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                          onKeyDown={e => { if (e.key === "Enter") confirmReservation(gift.id) }}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => confirmReservation(gift.id)} disabled={!reserverName.trim()}
                            className="flex-1 py-2 rounded-xl bg-pink-400 hover:bg-pink-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                            Confirmar
                          </button>
                          <button onClick={() => { setReservingId(null); setReserverName("") }}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm transition-colors">
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReservingId(gift.id)}
                        className="w-full py-2 rounded-xl border-2 border-pink-200 text-pink-400 hover:bg-pink-50 hover:border-pink-400 text-sm font-semibold transition-all">
                        🎁 ¡Lo llevo yo!
                      </button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Activities ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-8">
            <h2 className="text-2xl font-serif text-pink-400">Lo que te espera</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Gift,  title: "Mesa de regalos",   desc: "Prepara algo especial para la bebé" },
              { icon: Star,  title: "Juegos divertidos", desc: "Actividades y premios para todos" },
              { icon: Music, title: "Música y baile",    desc: "Celebremos juntos este momento" },
            ].map((a, i) => (
              <motion.div key={a.title} {...fadeUp(i * 0.1)}>
                <Card className="rounded-3xl bg-white/80 border-0 shadow-lg shadow-pink-50 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-100 to-mint-100 flex items-center justify-center">
                    <a.icon className="w-7 h-7 text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-pink-400 mb-2">{a.title}</h3>
                  <p className="text-sm text-pink-300">{a.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div {...fadeUp(0)}>
            <Card className="rounded-3xl bg-white/90 backdrop-blur-sm border-0 shadow-xl shadow-pink-100/50 overflow-hidden">
              <div className="p-8 sm:p-10">
                <h2 className="text-2xl font-serif text-pink-400 text-center mb-2">Confirma tu asistencia</h2>
                <p className="text-pink-300 text-center mb-8">Tu presencia hará este día más especial</p>
                <RSVPForm config={babyShowerRSVPConfig} />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-2 mb-4">
            {["text-pink-300","text-pink-400","text-pink-300"].map((c, i) => (
              <Heart key={i} className={`w-5 h-5 ${c}`} />
            ))}
          </div>
          <p className="font-serif text-2xl text-pink-400 mb-2">Te esperamos</p>
          <p className="text-pink-300 text-sm">Con amor, {eventDetails.parents}</p>
          <div className="mt-12 pt-8 border-t border-pink-100">
            <a href="/" className="inline-flex items-center gap-2 text-pink-200 hover:text-pink-400 transition-colors text-sm">
              <Sparkles className="w-4 h-4" />
              Creado con Momento Wow
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes balloon-float {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-22px) rotate(2deg); }
        }
        .balloon { animation: balloon-float var(--tw-duration, 6s) ease-in-out infinite; }

        @keyframes confetti-burst {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
        .confetti-piece {
          animation: confetti-burst ease-out forwards;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
