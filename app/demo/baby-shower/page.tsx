"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Heart, Gift, Calendar, MapPin, Clock, Music, Star, Baby, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Event date - set to 45 days from now for demo
const EVENT_DATE = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
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

function FloatingElement({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const prevValue = useRef(value)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsFlipping(true)
      const timer = setTimeout(() => setIsFlipping(false), 300)
      prevValue.current = value
      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className={`
            w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-lg
            flex items-center justify-center
            border-2 border-pink-100
            transition-transform duration-300
            ${isFlipping ? 'scale-95' : 'scale-100'}
          `}
        >
          <span
            className={`
              text-3xl sm:text-4xl font-bold text-pink-400
              transition-all duration-300
              ${isFlipping ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
            `}
          >
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-mint-200 rounded-full opacity-60" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-200 rounded-full opacity-60" />
      </div>
      <span className="mt-3 text-sm text-pink-300 font-medium tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}

function RSVPForm() {
  const [submitted, setSubmitted] = useState(false)
  const [attendance, setAttendance] = useState("yes")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-mint-100 flex items-center justify-center">
          <Heart className="w-10 h-10 text-pink-400 animate-pulse" />
        </div>
        <h3 className="text-2xl font-serif text-pink-400 mb-2">Gracias por confirmar</h3>
        <p className="text-pink-300">Te esperamos con mucha ilusión</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-pink-400">Tu nombre</Label>
        <Input
          id="name"
          placeholder="¿Cómo te llamas?"
          className="rounded-2xl border-pink-100 focus:border-pink-300 focus:ring-pink-200 bg-white/80"
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-pink-400">¿Podrás asistir?</Label>
        <RadioGroup value={attendance} onValueChange={setAttendance} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" className="border-pink-300 text-pink-400" />
            <Label htmlFor="yes" className="text-pink-300 cursor-pointer">Sí, allí estaré</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" className="border-pink-300 text-pink-400" />
            <Label htmlFor="no" className="text-pink-300 cursor-pointer">No podré ir</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-pink-400">Mensaje para los papás (opcional)</Label>
        <Textarea
          id="message"
          placeholder="Escribe tu mensaje de cariño..."
          className="rounded-2xl border-pink-100 focus:border-pink-300 focus:ring-pink-200 bg-white/80 min-h-24 resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-pink-300 hover:from-pink-500 hover:to-pink-400 text-white shadow-lg shadow-pink-200/50 py-6"
      >
        <Heart className="w-4 h-4 mr-2" />
        Confirmar asistencia
      </Button>
    </form>
  )
}

export default function BabyShowerDemo() {
  const timeLeft = useCountdown(EVENT_DATE)
  const [isPlaying, setIsPlaying] = useState(false)

  const eventDetails = {
    babyName: "Sofía",
    parents: "María y Carlos",
    date: EVENT_DATE.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: "16:00",
    location: "Jardín de Eventos La Rosa",
    address: "Calle de las Flores 123, Madrid",
  }

  const activities = [
    { icon: Gift, title: "Mesa de regalos", description: "Prepara algo especial para la bebé" },
    { icon: Star, title: "Juegos divertidos", description: "Actividades y premios para todos" },
    { icon: Music, title: "Música y baile", description: "Celebremos juntos este momento" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-mint-50 overflow-hidden">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0} className="absolute top-20 left-10 opacity-30">
          <Star className="w-8 h-8 text-pink-300" />
        </FloatingElement>
        <FloatingElement delay={0.5} className="absolute top-40 right-20 opacity-30">
          <Heart className="w-6 h-6 text-pink-400" />
        </FloatingElement>
        <FloatingElement delay={1} className="absolute top-60 left-1/4 opacity-20">
          <Baby className="w-10 h-10 text-mint-400" />
        </FloatingElement>
        <FloatingElement delay={1.5} className="absolute bottom-40 right-10 opacity-30">
          <Sparkles className="w-7 h-7 text-pink-300" />
        </FloatingElement>
        <FloatingElement delay={2} className="absolute bottom-60 left-20 opacity-20">
          <Star className="w-5 h-5 text-mint-300" />
        </FloatingElement>
      </div>

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative top element */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center shadow-lg shadow-pink-100">
                <Baby className="w-12 h-12 text-pink-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-mint-200 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-400" />
              </div>
            </div>
          </div>

          {/* Main title */}
          <p className="text-pink-300 text-sm uppercase tracking-widest mb-4">
            Estás invitado/a al
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-pink-400 mb-4 leading-tight">
            Baby Shower
          </h1>
          <p className="text-2xl sm:text-3xl font-serif text-mint-500 mb-6">
            de {eventDetails.babyName}
          </p>

          <p className="text-lg text-pink-300 max-w-md mx-auto leading-relaxed">
            {eventDetails.parents} te invitan a celebrar la próxima llegada de su pequeña princesa
          </p>

          {/* Music toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 shadow-md text-pink-400 hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            <Music className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-sm">{isPlaying ? 'Pausar música' : 'Reproducir música'}</span>
          </button>
        </div>
      </header>

      {/* Countdown Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-pink-400 mb-2">Cuenta regresiva</h2>
            <p className="text-pink-300">para conocer a {eventDetails.babyName}</p>
          </div>

          <div className="flex justify-center gap-4 sm:gap-6">
            <CountdownUnit value={timeLeft.days} label="Días" />
            <CountdownUnit value={timeLeft.hours} label="Horas" />
            <CountdownUnit value={timeLeft.minutes} label="Min" />
            <CountdownUnit value={timeLeft.seconds} label="Seg" />
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl shadow-pink-100/50 border-0 overflow-hidden">
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-serif text-pink-400 text-center mb-8">
                Detalles del evento
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pink-400 mb-1">Fecha</h3>
                    <p className="text-pink-300 capitalize">{eventDetails.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-mint-50/50 hover:bg-mint-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-mint-100 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-mint-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pink-400 mb-1">Hora</h3>
                    <p className="text-pink-300">{eventDetails.time} hrs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pink-400 mb-1">Lugar</h3>
                    <p className="text-pink-300">{eventDetails.location}</p>
                    <p className="text-pink-200 text-sm mt-1">{eventDetails.address}</p>
                  </div>
                </div>
              </div>

              {/* Map button */}
              <Button
                variant="outline"
                className="w-full mt-6 rounded-2xl border-pink-200 text-pink-400 hover:bg-pink-50 hover:text-pink-500 py-6 bg-transparent"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Ver en Google Maps
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-pink-400 text-center mb-10">
            Lo que te espera
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <Card
                key={activity.title}
                className="rounded-3xl bg-white/80 border-0 shadow-lg shadow-pink-50 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-100 to-mint-100 flex items-center justify-center">
                  <activity.icon className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="font-semibold text-pink-400 mb-2">{activity.title}</h3>
                <p className="text-sm text-pink-300">{activity.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Registry */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-3xl bg-gradient-to-br from-mint-50 to-pink-50 border-0 shadow-xl shadow-mint-100/50 overflow-hidden">
            <div className="p-8 sm:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white shadow-md flex items-center justify-center">
                <Gift className="w-8 h-8 text-pink-400" />
              </div>
              <h2 className="text-2xl font-serif text-pink-400 mb-4">
                Mesa de regalos
              </h2>
              <p className="text-pink-300 mb-6 max-w-md mx-auto">
                Si deseas obsequiar algo especial para la bebé, hemos preparado una lista con mucho cariño
              </p>
              <Button
                className="rounded-2xl bg-white text-pink-400 hover:bg-pink-50 shadow-md hover:shadow-lg px-8 py-6"
              >
                Ver lista de regalos
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="rounded-3xl bg-white/90 backdrop-blur-sm border-0 shadow-xl shadow-pink-100/50 overflow-hidden">
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-serif text-pink-400 text-center mb-2">
                Confirma tu asistencia
              </h2>
              <p className="text-pink-300 text-center mb-8">
                Tu presencia hará este día más especial
              </p>
              <RSVPForm />
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pink-300" />
            <Heart className="w-5 h-5 text-pink-400" />
            <Heart className="w-5 h-5 text-pink-300" />
          </div>
          <p className="font-serif text-2xl text-pink-400 mb-2">
            Te esperamos
          </p>
          <p className="text-pink-300 text-sm">
            Con amor, {eventDetails.parents}
          </p>

          {/* Momento Wow branding */}
          <div className="mt-12 pt-8 border-t border-pink-100">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-pink-200 hover:text-pink-400 transition-colors text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Creado con Momento Wow</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
