"use client";

import { Sparkles, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Momento<span className="font-serif text-primary">Wow</span>
              </span>
            </a>
            <p className="text-background/70 max-w-sm leading-relaxed">
              Creamos invitaciones web interactivas que convierten la primera
              impresión de tu evento en un recuerdo inolvidable.
            </p>
            {/* Social links */}
            {/* <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:hola@momentowow.es"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div> */}
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-background">Servicios</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#portfolio"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Bodas
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Cumpleaños
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Eventos corporativos
                </a>
              </li>
              <li>
                <a
                  href="#precios"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Precios
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-background">Contacto</h4>
            <ul className="space-y-3">
              <li className="text-background/70"><a href="mailto:sararellano@gmail.com" className="text-primary underline">sararellano@gmail.com</a></li>
              <li className="text-background/70">Madrid, España</li>
              <li>
                <a
                  href="#contacto"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Solicitar presupuesto →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © {currentYear} Momento Wow. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="/politica-privacidad"
							target="_blank"
              className="text-background/50 hover:text-background transition-colors"
            >
              Política de Privacidad
            </a>
            <a
              href="/terminos-uso"
							target="_blank"
              className="text-background/50 hover:text-background transition-colors"
            >
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
