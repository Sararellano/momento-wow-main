"use client";

import React from "react"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Heart, Cake, Building2, PartyPopper } from "lucide-react";

const eventTypes = [
  { id: "boda", label: "Boda", icon: Heart },
  { id: "cumpleanos", label: "Cumpleaños", icon: Cake },
  { id: "empresa", label: "Evento de Empresa", icon: Building2 },
  { id: "otro", label: "Otro evento", icon: PartyPopper },
];

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    message: '',
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // El formulario será enviado por POST a contact.php, no por JS

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background"
      id="contacto"
    >
      <div className="container mx-auto max-w-3xl">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              ¿Listo para crear tu{" "}
              <span className="font-serif text-primary">Momento Wow</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              Cuéntanos sobre tu evento y te responderemos en menos de 24 horas.
            </p>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form action="/out/contact.php" method="POST" className="space-y-8">
              {/* Event type selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-foreground">
                  ¿Qué evento estás planeando?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {eventTypes.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event.id)}
                      className={`group p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        selectedEvent === event.id
                          ? "border-primary bg-lilac-light shadow-lg"
                          : "border-border hover:border-primary/50 bg-card hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          selectedEvent === event.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted group-hover:bg-lilac-light"
                        }`}
                      >
                        <event.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          selectedEvent === event.id
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {event.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tu nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="María García"
                    className="rounded-xl py-6 bg-card border-border focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Tu email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="maria@ejemplo.com"
                    className="rounded-xl py-6 bg-card border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Event date */}
              <div className="space-y-2">
                <Label htmlFor="date">Fecha aproximada del evento</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="rounded-xl py-6 bg-card border-border focus:border-primary"
                />
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Cuéntanos más sobre tu evento..."
                  className="rounded-xl py-4 px-4 bg-card border-border focus:border-primary w-full min-h-[100px]"
                  required
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full rounded-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  Quiero mi Momento Wow
                  <Send className="w-5 h-5" />
                </span>
              </Button>
            </form>
          ) : (
            /* Success message */
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Heart className="w-10 h-10 text-mint-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  ¡Mensaje recibido!
                </h3>
                <p className="text-muted-foreground">
                  Nos pondremos en contacto contigo muy pronto para crear algo
                  increíble juntos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
