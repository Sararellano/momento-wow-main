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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RSVPForm } from "@/components/rsvp/rsvp-form"
import type { RSVPConfig } from "@/lib/rsvp/types"

// Event date - 30 days from now
const EVENT_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

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
    supabaseUrl: 'https://clgtmhgrozfdxumptomb.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZ3RtaGdyb3pmZHh1bXB0b21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQwMjAsImV4cCI6MjA4ODgzMDAyMH0.NDkbhcx9kEJRb6YF10n-Nd6mR8qM2LpG95edHg2r8c0',
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
function InteractiveMap() {
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
      <section ref={heroRef} className="pt-20 pb-12 md:pt-28 md:pb-20 relative overflow-hidden">
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
              <Button size="lg" className="relative gap-2 px-8">
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-12 md:py-20">
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

      {/* Trivia Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-transparent to-primary/5">
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
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <InteractiveMap />
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <RSVPForm config={corporativoRSVPConfig} />
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
