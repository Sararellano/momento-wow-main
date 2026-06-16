"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Sparkles,
  Building2,
  Trophy,
  ChevronRight,
  CheckCircle2,
  PartyPopper,
  Car,
  Utensils,
  Briefcase,
  Target,
  Lightbulb,
  Rocket,
  Coffee,
  Mic2,
  Award,
  Home,
  CalendarPlus,
  Navigation,
  Eye,
  BarChart2,
  TrendingUp,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RSVPForm } from "@/components/rsvp/rsvp-form"
import type { RSVPConfig } from "@/lib/rsvp/types"
import { supabase } from "@/lib/supabase/client"
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config"

const EVENT_DATE = new Date("2026-10-16T09:00:00+02:00")

// Agenda items
const AGENDA_ITEMS = [
  {
    time: "09:00",
    title: "Registro y Bienvenida",
    description: "Acreditación, café de bienvenida y networking inicial",
    icon: Coffee,
    duration: "30 min",
  },
  {
    time: "09:30",
    title: "Keynote: Visión 2026",
    description: "Presentación del CEO sobre la estrategia y objetivos del año",
    icon: Mic2,
    speaker: "Carlos Mendoza, CEO",
    duration: "45 min",
  },
  {
    time: "10:15",
    title: "Lanzamiento de Producto",
    description: "Presentación exclusiva de nuestra nueva línea de soluciones",
    icon: Rocket,
    speaker: "Ana García, Dir. Producto",
    duration: "1 hora",
  },
  {
    time: "11:15",
    title: "Coffee Break",
    description: "Pausa para networking y refrigerios",
    icon: Coffee,
    duration: "30 min",
  },
  {
    time: "11:45",
    title: "Panel: Innovación Digital",
    description: "Mesa redonda con expertos del sector sobre tendencias",
    icon: Lightbulb,
    speaker: "Panelistas invitados",
    duration: "1 hora",
  },
  {
    time: "12:45",
    title: "Almuerzo Networking",
    description: "Comida gourmet con espacios de networking temático",
    icon: Utensils,
    duration: "1h 30min",
  },
  {
    time: "14:15",
    title: "Workshops Paralelos",
    description: "Sesiones prácticas en grupos reducidos",
    icon: Target,
    duration: "2 horas",
  },
  {
    time: "16:15",
    title: "Ceremonia de Premios",
    description: "Reconocimiento a los mejores proyectos y equipos del año",
    icon: Award,
    duration: "45 min",
  },
  {
    time: "17:00",
    title: "Cocktail de Clausura",
    description: "Brindis final y networking de cierre",
    icon: PartyPopper,
    duration: "2 horas",
  },
]

// Trivia questions
const TRIVIA_QUESTIONS = [
  {
    question: "¿En qué año fue fundada nuestra empresa?",
    options: ["2015", "2018", "2020", "2012"],
    correct: 1,
  },
  {
    question: "¿Cuántos países abarca nuestra red de operaciones?",
    options: ["5 países", "12 países", "8 países", "15 países"],
    correct: 2,
  },
  {
    question: "¿Cuál es nuestro valor principal como empresa?",
    options: ["Velocidad", "Innovación", "Tradición", "Competencia"],
    correct: 1,
  },
]

// Speakers
const SPEAKERS = [
  { name: "Carlos Mendoza", role: "CEO & Founder",      company: "TechCorp",     initials: "CM", color: "#7C3AED", topic: "Keynote: Visión 2026" },
  { name: "Ana García",     role: "Dir. de Producto",   company: "TechCorp",     initials: "AG", color: "#2EFFA9", topic: "Lanzamiento de Producto" },
  { name: "Marcos Ruiz",    role: "CTO",                company: "InnovateTech", initials: "MR", color: "#f472b6", topic: "Panel Innovación Digital" },
  { name: "Laura Vidal",    role: "Head of Growth",     company: "GrowthLab",    initials: "LV", color: "#fb923c", topic: "Workshop Growth Hacking" },
  { name: "José Torres",    role: "COO",                company: "ScaleUp",      initials: "JT", color: "#38bdf8", topic: "Workshop Liderazgo" },
]

// Workshops
const WORKSHOPS = [
  { id: "w1", emoji: "🎯", title: "Liderazgo en la era digital", speaker: "José Torres",  seats: 25, left: 8  },
  { id: "w2", emoji: "🤖", title: "IA aplicada al negocio",      speaker: "Marcos Ruiz", seats: 20, left: 12 },
  { id: "w3", emoji: "📈", title: "Growth hacking en 2026",      speaker: "Laura Vidal", seats: 20, left: 5  },
]

// Sponsors
const SPONSORS = [
  "Accenture", "Salesforce", "Microsoft", "Santander", "BBVA", "Iberdrola",
]

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration, start])

  return count
}

// Countdown hook
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

// Page analytics tracking hook — sends real behavioral data to Supabase page_analytics table
const SUPA_URL = supabaseUrl
const SUPA_KEY = supabaseAnonKey
const TRACKED_SECTIONS = ['section-hero', 'section-agenda', 'section-trivia', 'section-mapa', 'section-rsvp']

function usePageAnalytics(eventId: string) {
  const sessionId = useRef('')
  const startTime = useRef(0)
  const sectionsViewed = useRef<Set<string>>(new Set())
  const mapClicksRef = useRef(0)
  const sent = useRef(false)

  const trackMapClick = () => { mapClicksRef.current++ }

  useEffect(() => {
    // One session per browser tab — avoid duplicates on hot reload
    const storageKey = `mw_analytics_${eventId}`
    if (sessionStorage.getItem(storageKey)) { sent.current = true; return }
    const id = crypto.randomUUID()
    sessionId.current = id
    startTime.current = Date.now()
    sessionStorage.setItem(storageKey, id)

    const getDevice = (): string => {
      const w = window.innerWidth
      if (w < 768) return 'mobile'
      if (w < 1024) return 'tablet'
      return 'desktop'
    }

    const send = () => {
      if (sent.current) return
      sent.current = true
      fetch(`${SUPA_URL}/rest/v1/page_analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          event_id: eventId,
          session_id: id,
          device_type: getDevice(),
          time_spent_seconds: Math.max(0, Math.round((Date.now() - startTime.current) / 1000)),
          map_clicks: mapClicksRef.current,
          sections_viewed: Array.from(sectionsViewed.current),
        }),
        keepalive: true,
      })
    }

    // Track which sections the user scrolls past
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting && e.target.id) sectionsViewed.current.add(e.target.id) }),
      { threshold: 0.3 }
    )
    TRACKED_SECTIONS.forEach(sid => {
      const el = document.getElementById(sid)
      if (el) observer.observe(el)
    })

    const onVisibility = () => { if (document.visibilityState === 'hidden') send() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', send)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', send)
      send()
    }
  }, [eventId])

  return { trackMapClick }
}

// Confetti component
function Confetti({ active }: { active: boolean }) {
  const colors = ["#6200EE", "#2EFFA9", "#FFD700", "#FF69B4", "#00CED1"]

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: "100vh",
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// Timeline item component
function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof AGENDA_ITEMS)[0]
  index: number
  isLast: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[15px] top-10 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent" />
      )}

      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.2 }}
      >
        <Icon className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
      </motion.div>

      {/* Content */}
      <motion.div
        whileHover={{ scale: 1.02, x: 5 }}
        className="pb-8"
      >
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
              {item.time}
            </span>
            <span className="text-xs text-muted-foreground">{item.duration}</span>
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          {item.speaker && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Mic2 className="w-4 h-4" />
              <span>{item.speaker}</span>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

// Stats section component
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const confirmed = useAnimatedCounter(247, 2000, isInView)
  const companies = useAnimatedCounter(45, 1500, isInView)
  const speakers = useAnimatedCounter(12, 1000, isInView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Stats en Tiempo Real
          <Sparkles className="w-5 h-5 text-secondary" />
        </h2>
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          <div className="text-center">
            <motion.div
              className="text-3xl md:text-5xl font-bold text-primary"
              animate={isInView ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 2 }}
            >
              {confirmed}
            </motion.div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Confirmados</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-3xl md:text-5xl font-bold text-secondary"
              style={{ color: "#2EFFA9" }}
              animate={isInView ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 2.2 }}
            >
              {companies}
            </motion.div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Empresas</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-3xl md:text-5xl font-bold text-primary"
              animate={isInView ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 2.4 }}
            >
              {speakers}
            </motion.div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Ponentes</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Trivia game component
function TriviaGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const startGame = () => {
    setGameState("playing")
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
  }

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)

    setTimeout(() => {
      if (index === TRIVIA_QUESTIONS[currentQuestion].correct) {
        setScore((s) => s + 1)
      }

      if (currentQuestion < TRIVIA_QUESTIONS.length - 1) {
        setCurrentQuestion((q) => q + 1)
        setSelectedAnswer(null)
      } else {
        setGameState("finished")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }, 1000)
  }

  return (
    <Card className="p-6 md:p-8">
      <Confetti active={showConfetti} />

      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Trivia de Marca
        <Trophy className="w-5 h-5 text-primary" />
      </h2>

      <AnimatePresence mode="wait">
        {gameState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-6">
              Demuestra cuánto conoces nuestra empresa con este rápido trivia de 3 preguntas.
            </p>
            <Button onClick={startGame} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Comenzar Trivia
            </Button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Pregunta {currentQuestion + 1} de {TRIVIA_QUESTIONS.length}</span>
              <span>Puntos: {score}</span>
            </div>

            <h3 className="text-lg md:text-xl font-semibold text-center">
              {TRIVIA_QUESTIONS[currentQuestion].question}
            </h3>

            <div className="grid gap-3">
              {TRIVIA_QUESTIONS[currentQuestion].options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === TRIVIA_QUESTIONS[currentQuestion].correct
                const showResult = selectedAnswer !== null

                return (
                  <motion.button
                    key={index}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${!showResult ? "hover:border-primary hover:bg-primary/5 cursor-pointer" : ""}
                      ${showResult && isCorrect ? "border-green-500 bg-green-50" : ""}
                      ${showResult && isSelected && !isCorrect ? "border-red-500 bg-red-50" : ""}
                      ${!showResult ? "border-border" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {gameState === "finished" && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Trophy className="w-16 h-16 mx-auto text-primary mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">
              {score === 3 ? "Perfecto!" : score >= 2 ? "Muy bien!" : "Buen intento!"}
            </h3>
            <p className="text-muted-foreground mb-6">
              Has acertado {score} de {TRIVIA_QUESTIONS.length} preguntas
            </p>
            <Button onClick={startGame} variant="outline" className="gap-2 bg-transparent">
              Jugar de nuevo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// Analytics preview data — simulated metrics for Pack WOW sales demo
const ANALYTICS_SECTIONS_DATA = [
  { label: "Hero / Portada",     pct: 100 },
  { label: "Agenda del evento",  pct: 84  },
  { label: "Mapa interactivo",   pct: 68  },
  { label: "Trivia corporativa", pct: 51  },
  { label: "Formulario RSVP",    pct: 38  },
]

const ANALYTICS_TIMELINE = [
  { day: "Lun", visits: 42  },
  { day: "Mar", visits: 78  },
  { day: "Mié", visits: 95  },
  { day: "Jue", visits: 134 },
  { day: "Vie", visits: 187 },
  { day: "Sáb", visits: 201 },
  { day: "Dom", visits: 110 },
]

const ANALYTICS_DEVICES = [
  { label: "Móvil",      pct: 71, color: "#7C3AED" },
  { label: "Escritorio", pct: 22, color: "#2EFFA9"  },
  { label: "Tablet",     pct: 7,  color: "#A78BFA"  },
]

// Format seconds into "Xm Ys" for time KPI card
function formatSeconds(s: number): string {
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`
}

// Analytics preview component — shown after RSVP to demonstrate Pack WOW value to marketing teams
function AnalyticsPreview() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const [barsVisible, setBarsVisible] = useState(false)

  useEffect(() => {
    if (isInView) setBarsVisible(true)
  }, [isInView])

  const opens      = useAnimatedCounter(847, 2000, isInView)
  const timeInApp  = useAnimatedCounter(384, 2400, isInView)
  const conversion = useAnimatedCounter(73,  1800, isInView)
  const mapClicks  = useAnimatedCounter(312, 2200, isInView)

  const chartConfig = { visits: { label: "Visitas", color: "#7C3AED" } }

  const kpiCards = [
    { icon: Eye,    display: String(opens),            label: "Aperturas totales"    },
    { icon: Clock,  display: formatSeconds(timeInApp), label: "Tiempo medio en app"  },
    { icon: Target, display: `${conversion}%`,         label: "Tasa conversión RSVP" },
    { icon: MapPin, display: String(mapClicks),        label: "Clics en mapa"        },
  ]

  return (
    <div ref={sectionRef}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          <BarChart2 className="w-4 h-4" />
          Vista previa del panel — Incluido en Pack WOW
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Analytics <span className="text-primary">en tiempo real</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cada invitación Momento Wow incluye un panel privado donde tu equipo de marketing
          ve exactamente cómo interactúan los invitados con cada sección.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-5 rounded-3xl border border-primary/10 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">↑ en vivo</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  {kpi.display}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Engagement + Timeline */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Section engagement bars */}
        <Card className="p-6 rounded-3xl border border-primary/10 bg-white shadow-sm">
          <h3 className="font-semibold text-base mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Engagement por sección
          </h3>
          <div className="space-y-4">
            {ANALYTICS_SECTIONS_DATA.map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.pct}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: "0%" }}
                    animate={{ width: barsVisible ? `${item.pct}%` : "0%" }}
                    transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 7-day activity chart */}
        <Card className="p-6 rounded-3xl border border-primary/10 bg-white shadow-sm">
          <h3 className="font-semibold text-base mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Actividad últimos 7 días
          </h3>
          <ChartContainer config={chartConfig} className="h-40 w-full">
            <AreaChart data={ANALYTICS_TIMELINE} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid #e5e7eb" }}
                formatter={(value: number) => [`${value} visitas`, ""]}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#7C3AED"
                strokeWidth={2}
                fill="url(#analyticsGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#7C3AED" }}
              />
            </AreaChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Devices breakdown */}
      <Card className="p-6 rounded-3xl border border-primary/10 bg-white shadow-sm mb-8">
        <h3 className="font-semibold text-base mb-5 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Dispositivos
        </h3>
        <div className="space-y-3">
          {ANALYTICS_DEVICES.map((device, i) => (
            <div key={device.label} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: device.color }} />
              <span className="text-sm text-muted-foreground w-24">{device.label}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: device.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: barsVisible ? `${device.pct}%` : "0%" }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />
              </div>
              <span className="text-sm font-semibold w-8 text-right">{device.pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Button size="lg" className="gap-2 px-8" asChild>
          <Link href="/#contacto">
            <TrendingUp className="w-5 h-5" />
            Solicitar demo personalizada
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Sin compromiso — respuesta en menos de 24h
        </p>
      </motion.div>
    </div>
  )
}

// Speakers section
function SpeakersSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Nuestros <span className="text-primary">Ponentes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Líderes del sector que compartirán sus experiencias y visiones
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {SPEAKERS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-5 text-center hover:shadow-lg transition-all duration-300 cursor-default border border-primary/10">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: s.color }}
                >
                  {s.initials}
                </div>
                <h3 className="font-bold text-sm leading-snug mb-0.5">{s.name}</h3>
                <p className="text-xs text-primary font-medium mb-0.5">{s.role}</p>
                <p className="text-xs text-muted-foreground mb-2">{s.company}</p>
                <span className="inline-block text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full leading-relaxed">
                  {s.topic}
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Workshop picker
function WorkshopPicker() {
  const [selected, setSelected] = useState<string | null>(null)
  const [saved,    setSaved]    = useState(false)
  const [name,     setName]     = useState("")

  useEffect(() => {
    try {
      const s = localStorage.getItem("summit-workshop")
      if (s) { setSelected(s); setSaved(true) }
    } catch {}
  }, [])

  const save = () => {
    if (!selected || !name.trim()) return
    localStorage.setItem("summit-workshop", selected)
    const w = WORKSHOPS.find(w => w.id === selected)
    // best-effort Supabase insert handled by parent context
    setSaved(true)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Elige tu <span className="text-primary">Workshop</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Las sesiones son en grupos reducidos. Reserva tu plaza antes de confirmar asistencia.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {saved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-3"
            >
              <div className="text-5xl">🎯</div>
              <h3 className="text-xl font-bold">¡Plaza reservada!</h3>
              <p className="text-muted-foreground">
                Workshop: <strong>{WORKSHOPS.find(w => w.id === selected)?.title}</strong>
              </p>
              <button
                onClick={() => { setSaved(false); setSelected(null) }}
                className="text-sm text-primary underline underline-offset-2"
              >
                Cambiar selección
              </button>
            </motion.div>
          ) : (
            <>
              {WORKSHOPS.map((w, i) => (
                <motion.button
                  key={w.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelected(w.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selected === w.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-white hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{w.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{w.title}</p>
                      <p className="text-sm text-muted-foreground">{w.speaker}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${w.left <= 5 ? "text-red-500" : "text-primary"}`}>
                        {w.left} plazas
                      </p>
                      <p className="text-xs text-muted-foreground">de {w.seats}</p>
                    </div>
                    {selected === w.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 pt-2"
                >
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre para reservar la plaza"
                    className="flex-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <button
                    onClick={save}
                    disabled={!name.trim()}
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground font-bold text-sm transition-all"
                  >
                    Reservar
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.section>
  )
}

// RSVP configuration for the corporate event demo
const corporativoRSVPConfig: RSVPConfig = {
  eventId: 'demo-summit-empresarial-2026',
  eventName: 'Summit Empresarial 2026',
  fields: [
    { name: 'name', type: 'text', label: 'Nombre completo', placeholder: 'Tu nombre', required: true },
    { name: 'email', type: 'email', label: 'Email corporativo', placeholder: 'tu@empresa.com', required: true },
    { name: 'company', type: 'text', label: 'Empresa', placeholder: 'Nombre de tu empresa', required: true },
    { name: 'position', type: 'text', label: 'Cargo', placeholder: 'Tu cargo' },
    { name: 'guests', type: 'select', label: 'Número de asistentes', required: true, options: [
      { value: '1', label: 'Solo yo' },
      { value: '2', label: 'Yo + 1 asistente' },
    ]},
    { name: 'catering', type: 'radio', label: 'Preferencia de catering', required: true, options: [
      { value: 'normal', label: 'Normal' },
      { value: 'vegetariano', label: 'Vegetariano' },
      { value: 'vegano', label: 'Vegano' },
      { value: 'sin-gluten', label: 'Sin gluten' },
    ]},
    { name: 'dietary', type: 'select', label: 'Alergias o restricciones adicionales', options: [
      { value: 'none', label: 'Ninguna' },
      { value: 'lactose', label: 'Intolerancia a la lactosa' },
      { value: 'nuts', label: 'Alergia a frutos secos' },
      { value: 'shellfish', label: 'Alergia a mariscos' },
      { value: 'other', label: 'Otra (especificar por email)' },
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
  },
  labels: {
    title: 'Confirmar Asistencia',
    subtitle: 'Reserva tu plaza en el Summit Empresarial 2026',
    submitButton: 'Confirmar Asistencia',
    submittingButton: 'Confirmando...',
    successTitle: 'Confirmación Recibida',
    successMessage: 'Te hemos registrado. Recibirás los detalles del evento pronto.',
    declineTitle: 'Gracias por avisarnos',
    declineMessage: 'Esperamos verte en futuros eventos.',
  },
}

// Interactive Map component
function InteractiveMap({ onPinClick }: { onPinClick?: () => void }) {
  const [activePin, setActivePin] = useState<string | null>(null)

  const pins = [
    { id: "entrance", x: 50, y: 75, label: "Entrada Principal", icon: Building2 },
    { id: "parking", x: 20, y: 60, label: "Parking VIP", icon: Car },
    { id: "register", x: 65, y: 55, label: "Registro", icon: Users },
    { id: "auditorium", x: 50, y: 35, label: "Auditorio", icon: Mic2 },
    { id: "catering", x: 80, y: 45, label: "Zona Catering", icon: Utensils },
  ]

  return (
    <Card className="p-6 md:p-8 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Mapa del Evento
      </h2>

      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden">
        {/* Simplified map background */}
        <div className="absolute inset-0">
          {/* Building outline */}
          <div className="absolute top-[20%] left-[30%] right-[30%] bottom-[30%] border-2 border-primary/30 rounded-lg bg-primary/5" />
          {/* Parking area */}
          <div className="absolute top-[50%] left-[10%] w-[15%] h-[20%] border-2 border-dashed border-secondary/50 rounded-lg bg-secondary/5" />
          {/* Roads */}
          <div className="absolute bottom-[15%] left-0 right-0 h-4 bg-muted-foreground/10" />
          <div className="absolute top-0 bottom-0 left-[45%] w-4 bg-muted-foreground/10" />
        </div>

        {/* Interactive pins */}
        {pins.map((pin) => {
          const Icon = pin.icon
          return (
            <motion.div
              key={pin.id}
              className="absolute cursor-pointer"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setActivePin(pin.id)}
              onHoverEnd={() => setActivePin(null)}
              onClick={() => onPinClick?.()}
            >
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center shadow-lg
                  ${pin.id === "parking" ? "bg-secondary" : "bg-primary"}
                `}
                animate={activePin === pin.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: activePin === pin.id ? Infinity : 0, duration: 1 }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              <AnimatePresence>
                {activePin === pin.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg"
                  >
                    {pin.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        <a
          href="https://maps.google.com/?q=Centro+de+Convenciones+Madrid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Navigation className="w-4 h-4" />
          Cómo llegar
        </a>
        <span className="text-muted-foreground">|</span>
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Car className="w-4 h-4" />
          Parking gratuito
        </span>
      </div>
    </Card>
  )
}

// Main page component
export default function EventoCorporativoPage() {
  const timeLeft = useCountdown(EVENT_DATE)
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const { trackMapClick } = usePageAnalytics('demo-summit-empresarial-2026')

  const handleCalendarClick = () => {
    const title    = encodeURIComponent("Summit Empresarial 2026")
    const location = encodeURIComponent("Centro de Convenciones Madrid")
    const details  = encodeURIComponent("El evento empresarial más innovador del año. Networking, conferencias y oportunidades que transformarán tu negocio.")
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261016T070000Z/20261016T170000Z&location=${location}&details=${details}`,
      "_blank"
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5F0]/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Home className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm md:text-base">Momento Wow</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Summit Empresarial</span>
            <span className="sm:hidden">Summit</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} id="section-hero" className="pt-20 pb-12 md:pt-28 md:pb-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-secondary/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Event badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Briefcase className="w-4 h-4" />
              Summit Empresarial 2026
            </motion.div>

            {/* Main title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              La imagen de tu marca{" "}
              <span className="text-primary">empieza antes</span> del evento
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete al evento empresarial más innovador del año. Networking, conferencias y
              oportunidades que transformarán tu negocio.
            </p>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto mb-8">
              {[
                { value: timeLeft.days, label: "Días" },
                { value: timeLeft.hours, label: "Horas" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Seg" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 border border-border">
                    <div className="text-2xl md:text-4xl font-bold text-primary">
                      {String(item.value).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">{item.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button with pulse effect */}
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-primary rounded-full"
                animate={{ scale: [1, 1.3, 1.3], opacity: [0.4, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Button size="lg" className="relative gap-2 px-8" onClick={handleCalendarClick}>
                <CalendarPlus className="w-5 h-5" />
                Agendar al Calendario
              </Button>
            </motion.div>
          </motion.div>

          {/* Event details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10"
          >
            {[
              { icon: Calendar, text: EVENT_DATE.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) },
              { icon: Clock, text: "09:00 - 19:00" },
              { icon: MapPin, text: "Centro de Convenciones Madrid" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <item.icon className="w-4 h-4 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Sponsor strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Patrocinan</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {SPONSORS.map((s) => (
                <span
                  key={s}
                  className="text-sm md:text-base font-bold text-muted-foreground/60 hover:text-muted-foreground transition-colors tracking-wide"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* Agenda Section */}
      <section id="section-agenda" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Agenda del <span className="text-primary">Evento</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un día completo de conferencias, workshops y networking diseñado para impulsar tu negocio
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {AGENDA_ITEMS.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isLast={index === AGENDA_ITEMS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <SpeakersSection />

      {/* Trivia Section */}
      <section id="section-trivia" className="py-12 md:py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Rompehielos <span className="text-primary">Digital</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Demuestra cuánto conoces nuestra empresa y gana puntos para el networking
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <TriviaGame />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="section-mapa" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <InteractiveMap onPinClick={trackMapClick} />
          </div>
        </div>
      </section>

      {/* Workshop Picker */}
      <WorkshopPicker />

      {/* RSVP Section */}
      <section id="section-rsvp" className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <RSVPForm config={corporativoRSVPConfig} />
          </div>
        </div>
      </section>

      {/* Analytics Preview Section — Pack WOW sales tool */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnalyticsPreview />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-[#F5F5F0]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Invitación creada con
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Sparkles className="w-4 h-4" />
            Momento Wow
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            La primera emoción de tu evento, en un solo link
          </p>
        </div>
      </footer>
    </div>
  )
}
