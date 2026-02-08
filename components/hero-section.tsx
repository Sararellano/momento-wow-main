"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 bg-lilac-light rounded-full blur-3xl opacity-40 transition-all duration-1000 delay-300 ${
            isVisible ? "translate-x-0 opacity-40" : "translate-x-20 opacity-0"
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 bg-mint-light rounded-full blur-3xl opacity-50 transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-50" : "translate-y-20 opacity-0"
          }`}
        />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground text-balance">
                La invitación de papel termina en la basura.{" "}
                <span className="text-primary font-serif">Tu Momento Wow</span>,
                en el recuerdo de todos.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Diseñamos experiencias web interactivas para eventos que no se
                olvidan. Juegos, música y emoción en un solo link.
              </p>
            </div>

						<div className="flex flex-col sm:flex-row gap-4">
							<a href="#portfolio">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Ver Demos en Vivo
                </span>
                {/* Pulse effect */}
                <span className="absolute inset-0 bg-primary-foreground/20 rounded-full animate-ping opacity-20" />
              </Button>
							</a>
            </div>
          </div>

          {/* iPhone Mockup with Confetti Animation */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; color: string; delay: number; size: number }>
  >([]);

  useEffect(() => {
    const colors = [
      "bg-primary",
      "bg-secondary",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-blue-400",
    ];
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4,
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="relative w-72 h-[580px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
        {/* Phone screen */}
        <div className="relative w-full h-full bg-cream rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-b-3xl z-20" />

          {/* Screen content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
            {/* Invitation preview */}
            <div className="text-center space-y-4 relative z-10">
              <p className="text-muted-foreground text-sm uppercase tracking-widest">
                Estás invitado a
              </p>
              <h3 className="text-3xl font-serif text-primary">
                La Boda de
              </h3>
              <p className="text-2xl font-bold text-foreground">
                María & Carlos
              </p>
              <div className="w-16 h-0.5 bg-primary mx-auto" />
              <p className="text-muted-foreground">12 de Octubre, 2026</p>
            </div>

            {/* Confetti animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {confetti.map((piece) => (
                <div
                  key={piece.id}
                  className={`absolute ${piece.color} rounded-full animate-confetti`}
                  style={{
                    left: `${piece.x}%`,
                    width: `${piece.size}px`,
                    height: `${piece.size}px`,
                    animationDelay: `${piece.delay}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements around phone */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-mint rounded-full opacity-60 animate-bounce" />
      <div
        className="absolute -bottom-6 -left-6 w-12 h-12 bg-lilac-light rounded-full opacity-60 animate-bounce"
        style={{ animationDelay: "0.5s" }}
      />
    </div>
  );
}
