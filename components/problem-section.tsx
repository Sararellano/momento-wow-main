"use client";

import { useEffect, useRef, useState } from "react";
import { HeartCrack, MapPinOff, MessageSquareOff } from "lucide-react";

const problems = [
  {
    icon: HeartCrack,
    title: "Cero emoción",
    description: "Un correo no cuenta una historia.",
  },
  {
    icon: MapPinOff,
    title: "Información perdida",
    description: "Los invitados olvidan el mapa o el horario.",
  },
  {
    icon: MessageSquareOff,
    title: "Confirmaciones caóticas",
    description:
      "Gestiona tus invitados de forma inteligente, no por mensajes de audio.",
  },
];

export function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 bg-muted/50"
      id="problema"
    >
      <div className="container mx-auto max-w-6xl">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            ¿Por qué seguir enviando{" "}
            <span className="text-primary">WhatsApps</span> o <span className="text-primary">correos aburridos</span>?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className={`group transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative bg-card rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 h-full group-hover:-translate-y-2">
                {/* Icon */}
                <div className="w-16 h-16 bg-lilac-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <problem.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>

                {/* Decorative accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/0 group-hover:bg-primary rounded-b-3xl transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
