"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Gamepad2, Baby, ExternalLink } from "lucide-react";

const portfolioItems = [
  {
    icon: Heart,
    title: "Boda Real",
    subtitle: "Elegancia y Storytelling",
    description:
      "Animaciones suaves, música romántica y una experiencia visual que captura la esencia de tu historia de amor.",
    gradient: "from-pink-100 to-lilac-light",
    accent: "bg-pink-500",
    hoverBg: "group-hover:bg-pink-50",
  },
  {
    icon: Gamepad2,
    title: "Cumpleaños Gamer",
    subtitle: "Con mini-juego interactivo",
    description:
      "Sorprende a tus invitados con un mini-juego temático. La diversión empieza antes de la fiesta.",
    gradient: "from-mint-light to-cyan-100",
    accent: "bg-secondary",
    hoverBg: "group-hover:bg-mint-light",
  },
  {
    icon: Baby,
    title: "Baby Shower",
    subtitle: "Dulzura y cuenta atrás",
    description:
      "Colores tiernos, cuenta regresiva animada y todos los detalles para dar la bienvenida al bebé.",
    gradient: "from-yellow-100 to-orange-100",
    accent: "bg-yellow-400",
    hoverBg: "group-hover:bg-yellow-50",
  },
];

export function PortfolioSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
    <section ref={sectionRef} className="py-24 px-4" id="portfolio">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Elige tu nivel de{" "}
            <span className="font-serif text-primary">impacto</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada evento es único. Descubre qué estilo se adapta mejor a tu
            celebración.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => {
            const demoLinks = ["/demo/boda", "/demo/cumpleanos-infantil", "/demo/baby-shower"];
            return (
              <a
                key={item.title}
                href={demoLinks[index]}
                target="_blank"
                rel="noopener noreferrer"
                className={`group cursor-pointer transition-all duration-700 block ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`relative overflow-hidden rounded-3xl border border-border/50 transition-all duration-500 h-full ${
                  hoveredCard === index
                    ? "shadow-2xl scale-105 border-primary/30"
                    : "shadow-sm hover:shadow-lg"
                }`}
              >
                {/* Gradient header */}
                <div
                  className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <item.icon
                    className={`w-20 h-20 text-foreground/80 transition-all duration-500 ${
                      hoveredCard === index ? "scale-110 rotate-6" : ""
                    }`}
                  />

                  {/* Floating elements on hover */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      hoveredCard === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-3 h-3 ${item.accent} rounded-full animate-float`}
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 3) * 20}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <ExternalLink
                      className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${
                        hoveredCard === index
                          ? "text-primary translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0"
                      }`}
                    />
                  </div>
                  <p className="text-primary font-medium mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`h-1 ${item.accent} transition-all duration-300 ${
                    hoveredCard === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
