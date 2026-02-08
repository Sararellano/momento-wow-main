"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Clock, Calendar, Music, ChevronDown } from "lucide-react";

export default function BodaDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({ name: "", guests: "1", attending: true });
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Toggle audio playback
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle RSVP form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="relative bg-background">
      {/* Background audio - lightweight HTML5 audio */}
      <audio ref={audioRef} loop>
        {/* Replace with your own romantic music file (lightweight MP3, under 2MB recommended) */}
        <source src="/demo/audio/romantic-piano.mp3" type="audio/mpeg" />
      </audio>

      {/* Music control button - fixed position */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <Music className={`w-6 h-6 text-primary-foreground ${isPlaying ? "animate-pulse" : ""}`} />
      </button>

      {/* Hero Section - Names and Date */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -top-40 -right-40 w-96 h-96 bg-lilac-light rounded-full blur-3xl opacity-30 transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-30" : "translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute -bottom-40 -left-40 w-96 h-96 bg-mint-light rounded-full blur-3xl opacity-40 transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-40" : "translate-y-20 opacity-0"
            }`}
          />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Heart icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Heart className="w-10 h-10 text-primary fill-primary" />
              </div>
            </div>

            {/* Couple names */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-primary">
                Elena & Mateo
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                Nos casamos
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-semibold text-foreground">
                15 de Junio, 2026
              </p>
              <p className="text-lg text-muted-foreground">
                Sevilla, España
              </p>
            </div>

            {/* Scroll indicator */}
            <div className="pt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Storytelling */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Nuestra <span className="font-serif text-primary">Historia</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Un viaje de amor que comenzó hace 5 años
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-12">
            {/* First meeting */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-block px-4 py-2 bg-lilac-light rounded-full text-primary font-semibold text-sm">
                  2021 - El Primer Encuentro
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Una tarde de café ☕
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestros caminos se cruzaron en una pequeña cafetería de Madrid.
                  Elena pidió un capuchino, Mateo un café solo. Ambos llevaban el mismo libro.
                  La conversación fluyó como si nos conociéramos de toda la vida.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-lilac-light to-mint-light" />
              </div>
            </div>

            {/* First trip */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-block px-4 py-2 bg-mint-light rounded-full text-mint font-semibold text-sm">
                  2022 - Nuestro Primer Viaje
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Lisboa bajo la lluvia 🌧️
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Escapada de fin de semana que se convirtió en una aventura inolvidable.
                  Bailamos bajo la lluvia en el Mirador de Santa Lucía.
                  Fue ahí donde Mateo supo que Elena era "la indicada".
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-mint-light to-lilac-light" />
              </div>
            </div>

            {/* The proposal */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-block px-4 py-2 bg-lilac-light rounded-full text-primary font-semibold text-sm">
                  2025 - La Propuesta
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  ¿Quieres casarte conmigo? 💍
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  En la misma cafetería donde todo comenzó, con las mismas tazas y el mismo libro.
                  Mateo se arrodilló. Elena dijo "sí" antes de que pudiera terminar la pregunta.
                  Los aplausos de los desconocidos aún resuenan en nuestra memoria.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-lilac-light to-mint-light flex items-center justify-center">
                  <Heart className="w-24 h-24 text-primary fill-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Detalles del <span className="font-serif text-primary">Evento</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Todo lo que necesitas saber para celebrar con nosotros
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ceremony card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-lilac-light/50 to-background border-2 border-border space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ceremonia</h3>
                <p className="text-muted-foreground">
                  Capilla de San Juan, Sevilla
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>17:00h</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Calle Real de la Alhambra, 23</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>15 de Junio, 2026</span>
                </div>
              </div>
            </div>

            {/* Reception card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-mint-light/50 to-background border-2 border-border space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-mint flex items-center justify-center">
                <Heart className="w-8 h-8 text-mint-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Celebración</h3>
                <p className="text-muted-foreground">
                  Cortijo Los Olivos
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="w-5 h-5 text-mint" />
                  <span>19:30h - 02:00h</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-5 h-5 text-mint" />
                  <span>Carretera de Carmona, km 7</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="w-5 h-5 text-mint" />
                  <span>15 de Junio, 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dress code */}
          <div className="mt-12 text-center p-8 rounded-3xl bg-muted/50">
            <h3 className="text-xl font-semibold text-foreground mb-2">Código de vestimenta</h3>
            <p className="text-muted-foreground">
              Elegante • Colores claros • Disfruta del sol de Sevilla
            </p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Confirma tu <span className="font-serif text-primary">Asistencia</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Nos encantaría contar contigo en nuestro día especial
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl bg-card border-2 border-border">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Tu nombre completo
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="María García López"
                  className="rounded-xl py-6"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-medium text-foreground">
                  Número de acompañantes
                </label>
                <select
                  id="guests"
                  name="guests"
                  className="w-full rounded-xl py-3 px-4 border-2 border-border bg-background"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                >
                  <option value="1">Solo yo</option>
                  <option value="2">Yo + 1 acompañante</option>
                  <option value="3">Yo + 2 acompañantes</option>
                  <option value="4">Yo + 3 acompañantes</option>
                </select>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">¿Podrás asistir?</p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: true })}
                    className={`flex-1 py-3 px-6 rounded-xl border-2 transition-all ${
                      formData.attending
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    ¡Sí, asistiré!
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: false })}
                    className={`flex-1 py-3 px-6 rounded-xl border-2 transition-all ${
                      !formData.attending
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    No podré asistir
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300"
              >
                Enviar confirmación
              </Button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-6 p-8 rounded-3xl bg-card border-2 border-border">
              <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Heart className="w-10 h-10 text-mint-foreground fill-mint-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {formData.attending ? "¡Gracias por confirmar!" : "Gracias por avisarnos"}
                </h3>
                <p className="text-muted-foreground">
                  {formData.attending
                    ? "Nos vemos el 15 de Junio. ¡No podemos esperar para celebrar juntos!"
                    : "Lamentamos que no puedas acompañarnos. ¡Te echaremos de menos!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Back to main site */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground mb-4">
            Esta es una demo de invitación web creada por
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors"
          >
            ← Volver a Momento Wow
          </a>
        </div>
      </section>
    </main>
  );
}
