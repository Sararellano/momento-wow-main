"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles, Zap } from "lucide-react";

const pricingPlans = [
  {
    name: "Esencial",
    price: "149",
    description: "Perfecto para eventos íntimos",
    icon: Zap,
    features: [
      "Diseño web personalizado",
      "Información del evento",
      "Mapa interactivo",
      "Confirmación de asistencia",
      "Soporte por email",
    ],
    popular: false,
    gradient: "from-muted to-card",
    buttonVariant: "outline" as const,
  },
  {
    name: "Experiencia",
    price: "249",
    description: "El favorito de nuestros clientes",
    icon: Star,
    features: [
      "Todo lo del pack Esencial",
      "Animaciones GSAP personalizadas",
      "Música de fondo",
      "Galería de fotos",
      "Cuenta atrás animada",
      "Panel de gestión de invitados",
      "Soporte prioritario",
    ],
    popular: true,
    gradient: "from-lilac-light to-mint-light",
    buttonVariant: "default" as const,
  },
  {
    name: "Pack WOW",
    price: "399",
    description: "La experiencia definitiva",
    icon: Sparkles,
    features: [
      "Todo lo del pack Experiencia",
      "Mini-juego interactivo",
      "Video de fondo",
      "Múltiples idiomas",
      "Integración con calendario",
      "Estadísticas avanzadas",
      "Soporte 24/7",
      "Dominio personalizado",
    ],
    popular: false,
    gradient: "from-mint-light to-muted",
    buttonVariant: "outline" as const,
  },
];

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-muted/30" id="precios">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Planes pensados para{" "}
            <span className="font-serif text-primary">cada momento</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sin sorpresas. Precios transparentes que incluyen diseño, desarrollo
            y soporte.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    Más popular
                  </span>
                </div>
              )}

              <div
                className={`relative overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-xl h-full ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105 bg-card"
                    : "border-border/50 bg-card hover:border-primary/20"
                }`}
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${plan.gradient} p-8`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        plan.popular ? "bg-primary/20" : "bg-foreground/10"
                      }`}
                    >
                      <plan.icon
                        className={`w-6 h-6 ${
                          plan.popular ? "text-primary" : "text-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">desde</span>
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-xl text-muted-foreground">€</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular ? "bg-primary/20" : "bg-secondary/50"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              plan.popular
                                ? "text-primary"
                                : "text-secondary-foreground"
                            }`}
                          />
                        </div>
                        <span className="text-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full rounded-full py-6 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                        : "hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Empezar ahora
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
