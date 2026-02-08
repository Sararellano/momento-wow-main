"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Smartphone, Zap, Palette } from "lucide-react";

const techFeatures = [
  {
    icon: Code2,
    title: "Código artesanal",
    description:
      "Cada línea escrita a mano. Sin plantillas genéricas ni constructores.",
  },
  {
    icon: Zap,
    title: "Velocidad extrema",
    description: "Optimizado para cargar en menos de 2 segundos en cualquier red.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description:
      "Diseñado pensando en móviles porque ahí es donde se abrirá tu invitación.",
  },
  {
    icon: Palette,
    title: "Animaciones únicas",
    description:
      "Microinteracciones GSAP que hacen que cada detalle cobre vida.",
  },
];

export function TechSection() {
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
    <section ref={sectionRef} className="py-24 px-4" id="tecnologia">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                No es una plantilla.{" "}
                <span className="font-serif text-primary">
                  Es código con corazón.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mientras otros usan constructores de arrastrar y soltar,
                nosotros escribimos código personalizado línea a línea.
                Utilizamos animaciones GSAP cuidadosamente optimizadas para que
                tu invitación vuele en cualquier dispositivo, incluso con
                conexión 3G.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cada proyecto es único porque cada historia merece ser contada
                de forma diferente. Sin compromisos, sin limitaciones de
                plantilla.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{"<"}2s</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Tiempo de carga
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Código propio
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">60fps</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Animaciones fluidas
                </p>
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div
            className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {techFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`group p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <div className="w-12 h-12 bg-lilac-light rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
