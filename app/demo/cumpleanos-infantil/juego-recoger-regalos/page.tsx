"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Gift, Sparkles, PartyPopper, Star } from "lucide-react";

export default function JuegoPhaserIframe() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-300 via-blue-300 to-blue-400 flex flex-col">
      {/* Fondo animado con iconos flotantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            {i % 3 === 0 ? (
              <Gift className="w-6 h-6 text-pink-400 fill-pink-300" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-cyan-400" />
            ) : (
              <PartyPopper className="w-5 h-5 text-yellow-400" />
            )}
          </motion.div>
        ))}
      </div>
      {/* Header personalizado */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg text-primary">Momento Wow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-muted-foreground">Atrapa los regalos</span>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 py-8">
        <Link
          href="/demo/cumpleanos-infantil"
          className="mb-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all"
        >
          ← Atrás
        </Link>
        <h1 className="text-3xl font-bold text-cyan-900 mb-4 drop-shadow">Atrapa los regalos</h1>
        <iframe
          src="/juego-phaser.html"
          title="Juego Atrapa los regalos"
          width={400}
          height={540}
          className="mt-4 rounded-xl overflow-hidden shadow-lg bg-white"
          style={{ border: 'none' }}
          allowFullScreen
        />
        <p className="mt-6 text-lg text-center text-cyan-900">¡Usa las flechas izquierda y derecha para mover el personaje y atrapar los regalos que caen!</p>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Creado con <span className="font-serif text-primary">Momento Wow</span>
        </p>
      </footer>
    </div>
  );
}
