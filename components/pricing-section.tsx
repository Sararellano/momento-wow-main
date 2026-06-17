"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Star, Sparkles, Zap } from "lucide-react";

// TODO: replace with your real WhatsApp number (e.g. "34612345678")
const WHATSAPP_NUMBER = "34XXXXXXXXX";

function getWhatsAppUrl(planName: string): string {
  const text = encodeURIComponent(
    `Hola! Me interesa el plan ${planName} de Momento Wow. ¿Podemos hablar?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.12 1.528 5.849L0 24l6.335-1.502A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.724.883.945-3.628-.234-.373A9.783 9.783 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
    </svg>
  );
}

const pricingPlans = [
  {
    name: "Esencial",
    price: "30",
    originalPrice: "59.99",
    description: "Perfecto para eventos íntimos",
    icon: Zap,
    features: [
      "Diseño web personalizado",
      "Información del evento",
      "Mapa interactivo",
      "Confirmación de asistencia",
      "Alojamiento incluido 1 año",
      "Link bajo subdominio momentowow.es",
      "Soporte por email",
    ],
    popular: false,
    gradient: "from-muted to-card",
    buttonVariant: "outline" as const,
  },
  {
    name: "Experiencia",
    price: "50",
    originalPrice: "79.99",
    description: "El favorito de nuestros clientes",
    icon: Star,
    features: [
      "Todo lo del pack Esencial",
      "Animaciones GSAP personalizadas",
      "Música de fondo",
      "Galería de fotos",
      "Cuenta atrás animada",
      "Panel de gestión de invitados",
      "Subdominio personalizado (tu-evento.momentowow.es)",
      "Soporte prioritario",
    ],
    popular: true,
    gradient: "from-lilac-light to-mint-light",
    buttonVariant: "default" as const,
  },
  {
    name: "Pack WOW",
    price: "80",
    originalPrice: "129.99",
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
      "Dominio propio configurado (cliente compra ~12€/año)",
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Precio de lanzamiento — plazas limitadas
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Planes pensados para{" "}
            <span className="font-serif text-primary">cada momento</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sin sorpresas. Precios transparentes que incluyen diseño, desarrollo
            y soporte. Pago en 2 partes: 50% al contratar, 50% al entregar.
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

                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-sm text-muted-foreground">desde</span>
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-xl text-muted-foreground">€</span>
                    <span className="text-sm text-muted-foreground line-through ml-1">
                      {plan.originalPrice}€
                    </span>
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

                  <div className="flex flex-col gap-2">
                    <a
                      href={getWhatsAppUrl(plan.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-sm bg-[#25D366] hover:bg-[#1db954] text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <WhatsAppIcon />
                      Empezar por WhatsApp
                    </a>
                    <a
                      href="#contacto"
                      className="text-center text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors py-1"
                    >
                      o rellena el formulario →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
