"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, Calendar, Gamepad2, ChevronDown } from "lucide-react";
import { RSVPForm } from "@/components/rsvp/rsvp-form";
import type { RSVPConfig } from "@/lib/rsvp/types";
import { supabase } from "@/lib/supabase/client";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config"

const cumpleanosRSVPConfig: RSVPConfig = {
  eventId: 'demo-cumple-capitan-lucas',
  eventName: 'Cumpleaños del Capitán Lucas',
  fields: [
    { name: 'name', type: 'text', label: 'Nombre del tripulante', placeholder: 'Juan Pérez', required: true },
    { name: 'guests', type: 'select', label: 'Número de asistentes', required: true, options: [
      { value: '1', label: 'Solo yo' },
      { value: '2', label: 'Yo + 1 niño/a' },
      { value: '3', label: 'Yo + 2 niños/as' },
    ]},
    { name: 'attendance', type: 'radio', label: '¿Subirás al barco?', required: true, options: [
      { value: 'yes', label: '¡Sí, zarpo con vosotros!' },
      { value: 'no', label: 'No puedo asistir' },
    ]},
  ],
  adapter: {
    type: 'both',
    googleScriptUrl: 'https://script.google.com/macros/s/AKfycbwC9KWNugCSqYoftsRvPdkIUKOLirdFupkgcD0MszMVgw7i-sJJkseS1yJ7lLBayf1fnw/exec',
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
    supabaseTable: 'rsvps',
  },
  theme: {
    primaryColor: 'cyan-500',
    accentColor: 'blue-500',
    cardClass: 'shadow-xl',
    buttonClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white',
    radioActiveClass: 'border-cyan-500 bg-cyan-500 text-white',
    radioInactiveClass: 'border-border bg-background text-foreground hover:border-cyan-300',
    successIconClass: 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg',
  },
  labels: {
    submitButton: 'Confirmar asistencia',
    successTitle: '¡Bienvenido a la tripulación!',
    successMessage: '¡Nos vemos el 20 de Julio para la gran aventura pirata!',
    declineTitle: '¡Gracias por avisar!',
    declineMessage: '¡Esperamos verte en la próxima aventura!',
  },
};

// 5 characters × 5 hats = 25 unique missions
const MISSIONS: Record<string, Record<string, { title: string; desc: string; power: string }>> = {
  unicorn: {
    none:   { title: "Unicornio Libre",    desc: "guardiana del arcoíris eterno",             power: "✨ Magia arcoíris" },
    pirate: { title: "Unicornio Corsaria", desc: "terror de los siete mares mágicos",         power: "⚔️ Cuerno + sable" },
    crown:  { title: "Unicornio Real",     desc: "reina del bosque encantado",                power: "👑 Poder infinito" },
    party:  { title: "Unicornio Festiva",  desc: "reina de todas las fiestas del reino",      power: "🎉 Confeti mágico" },
    cowboy: { title: "Unicornio Vaquera",  desc: "heroína de las praderas del oeste mágico", power: "🤠 Lazo encantado" },
  },
  superhero: {
    none:   { title: "Guardián Supremo",   desc: "protector de la ciudad de las estrellas",  power: "💪 Fuerza infinita" },
    pirate: { title: "Capitán Héroe",      desc: "el más valiente de todos los mares",       power: "⚓ Gancho metálico" },
    crown:  { title: "Rey de los Héroes",  desc: "líder supremo de la Liga Justicia",        power: "⚡ Rayo real" },
    party:  { title: "Héroe de la Fiesta", desc: "defensor de la alegría universal",         power: "🎊 Bomba confeti" },
    cowboy: { title: "Vaquero Galáctico",  desc: "sheriff del universo conocido",            power: "🔫 Pistola de rayos" },
  },
  superheroina: {
    none:   { title: "Guardiana Suprema",  desc: "protectora de la ciudad de las estrellas", power: "💜 Fuerza invencible" },
    pirate: { title: "Capitana Heroína",   desc: "la más valiente de todos los mares",       power: "⚓ Látigo marino" },
    crown:  { title: "Reina Heroína",      desc: "líder de la Liga de las Superheroínas",    power: "⚡ Rayo arcoíris" },
    party:  { title: "Heroína Festiva",    desc: "defensora de la alegría y la fiesta",      power: "🎊 Purpurina cósmica" },
    cowboy: { title: "Vaquera Galáctica",  desc: "sheriff del universo conocido",            power: "🌟 Lazo de luz" },
  },
  dinosaur: {
    none:   { title: "Dino Prehistórico",  desc: "rey de todos los dinosaurios",             power: "🦕 Rugido sísmico" },
    pirate: { title: "Dino Capitán",       desc: "terror de los mares prehistóricos",        power: "⚓ Cola de acero" },
    crown:  { title: "Dino Real",          desc: "el más poderoso del Jurásico",             power: "👑 Poder ancestral" },
    party:  { title: "Dino Festivo",       desc: "el más divertido del Cretácico",           power: "🎉 Rugido de fiesta" },
    cowboy: { title: "Dino Vaquero",       desc: "el ranchero más temido del Jurásico",      power: "🤠 Lazo prehistórico" },
  },
  ghost: {
    none:   { title: "Fantasma Libre",    desc: "guardián de los secretos nocturnos",        power: "👻 Invisibilidad total" },
    pirate: { title: "Fantasma Corsario", desc: "el fantasma pirata más temido del mar",     power: "⚓ Barco fantasma" },
    crown:  { title: "Rey Fantasma",      desc: "soberano del reino de los espíritus",       power: "👑 Control fantasmal" },
    party:  { title: "Fantasma Festivo",  desc: "el espíritu más alegre de la fiesta",       power: "🎉 Travesuras eternas" },
    cowboy: { title: "Fantasma Vaquero",  desc: "el espectro del viejo oeste sin fin",       power: "🤠 Lazo espectral" },
  },
};

// Pure inline SVG avatar — zero images, zero loading time
function AvatarSVG({ character, hat, shirtColor, pantsColor }: {
  character: string; hat: string; shirtColor: string; pantsColor: string;
}) {
  const SKIN = "#FDDBB4";
  const DINO_SKIN = "#86efac";
  const GHOST_SKIN = "#dbeafe";
  const EYES = "#1a1a2e";
  const isGhost = character === "ghost";
  const isDino  = character === "dinosaur";
  const skin = isGhost ? GHOST_SKIN : isDino ? DINO_SKIN : SKIN;

  return (
    <svg viewBox="0 0 120 220" className="w-40 h-52 drop-shadow-xl" aria-hidden="true">
      <defs>
        <radialGradient id="faceShine" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Layer 1: Back elements (cape, dino spikes + tail) ── */}
      {(character === "superhero" || character === "superheroina") && (
        <path
          d="M22 92 Q6 144 16 202 Q60 218 104 202 Q114 144 98 92"
          fill={character === "superhero" ? "#dc2626" : "#ec4899"}
        />
      )}
      {isDino && (
        <>
          <polygon points="38,16 34,36 43,34" fill="#4ade80" />
          <polygon points="54,8  50,30 59,28" fill="#22c55e" />
          <polygon points="70,12 66,33 75,31" fill="#4ade80" />
          <polygon points="83,20 79,39 87,37" fill="#22c55e" />
          <path d="M98 160 Q132 158 142 200 L106 186 Q111 168 100 164 Z" fill={DINO_SKIN} />
        </>
      )}

      {/* ── Layer 2: Legs / Pants ── */}
      {!isGhost && (
        <>
          <rect x="26" y="150" width="30" height="58" rx="10" fill={pantsColor} />
          <rect x="64" y="150" width="30" height="58" rx="10" fill={pantsColor} />
          <ellipse cx="41" cy="210" rx="16" ry="7" fill="#111827" />
          <ellipse cx="79" cy="210" rx="16" ry="7" fill="#111827" />
        </>
      )}

      {/* ── Layer 3: Body / Shirt ── */}
      {isGhost ? (
        <path
          d="M20 90 L20 168 Q29 183 38 168 Q47 183 56 168 Q65 181 74 168 Q83 183 92 168 Q101 183 100 168 L100 90 Z"
          fill={GHOST_SKIN}
        />
      ) : (
        <>
          <rect x="20" y="88" width="80" height="68" rx="16" fill={shirtColor} />
          <path d="M52 88 L60 100 L68 88" fill="white" opacity="0.25" />
        </>
      )}

      {/* ── Layer 4: Head ── */}
      <circle cx="60" cy="52" r="38" fill={skin} />
      <circle cx="37" cy="61" r="9"   fill="#ffb3b3" opacity="0.4" />
      <circle cx="83" cy="61" r="9"   fill="#ffb3b3" opacity="0.4" />
      {/* Eyes */}
      <circle cx="47" cy="48" r="7"   fill="white" />
      <circle cx="73" cy="48" r="7"   fill="white" />
      <circle cx="48" cy="49" r="4.5" fill={EYES} />
      <circle cx="74" cy="49" r="4.5" fill={EYES} />
      <circle cx="50" cy="47" r="2"   fill="white" />
      <circle cx="76" cy="47" r="2"   fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="3" ry="2" fill={isGhost ? "#94a3b8" : "#d4886a"} />
      {/* Mouth */}
      {isGhost
        ? <path d="M48 66 Q54 60 60 66 Q66 72 72 66" stroke={EYES} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : <path d="M47 65 Q60 77 73 65"              stroke={EYES} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      }
      <circle cx="60" cy="52" r="38" fill="url(#faceShine)" />

      {/* ── Layer 5: Character-specific decorations ── */}
      {character === "unicorn" && (
        <>
          <path d="M22 38 Q14 58 22 80"  stroke="#f472b6" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M22 38 Q11 60 22 82"  stroke="#a78bfa" strokeWidth="6"  fill="none" strokeLinecap="round" />
          <path d="M98 38 Q106 58 98 80" stroke="#60a5fa" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M34 16 Q60 8 86 16"   stroke="#fb923c" strokeWidth="10" fill="none" strokeLinecap="round" />
          <polygon points="60,1 53,27 67,27" fill="#FFD700" />
          <line x1="57" y1="7"  x2="56" y2="25" stroke="#FFA500" strokeWidth="1.2" />
          <line x1="63" y1="7"  x2="64" y2="25" stroke="#FFA500" strokeWidth="1.2" />
        </>
      )}
      {character === "superhero" && (
        <>
          <path d="M22 44 Q35 36 48 44 L48 58 Q35 50 22 58 Z" fill="#1e40af" />
          <path d="M72 44 Q85 36 98 44 L98 58 Q85 50 72 58 Z" fill="#1e40af" />
          <path d="M48 44 Q60 40 72 44 L72 52 Q60 48 48 52 Z" fill="#1e40af" />
          <text x="60" y="132" textAnchor="middle" fontSize="20">⭐</text>
        </>
      )}
      {character === "superheroina" && (
        <>
          <path d="M25 28 Q22 56 26 82"  stroke="#f59e0b" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M95 28 Q98 56 94 82"  stroke="#f59e0b" strokeWidth="14" fill="none" strokeLinecap="round" />
          <ellipse cx="60" cy="17" rx="36" ry="12" fill="#f59e0b" />
          <path d="M22 50 Q35 43 48 50 L48 62 Q35 55 22 62 Z" fill="#7c3aed" />
          <path d="M72 50 Q85 43 98 50 L98 62 Q85 55 72 62 Z" fill="#7c3aed" />
          <path d="M48 50 Q60 46 72 50 L72 57 Q60 53 48 57 Z" fill="#7c3aed" />
          <text x="60" y="132" textAnchor="middle" fontSize="20">⭐</text>
        </>
      )}
      {isDino && (
        <>
          <circle cx="42" cy="106" r="6" fill="#4ade80" opacity="0.7" />
          <circle cx="60" cy="101" r="6" fill="#4ade80" opacity="0.7" />
          <circle cx="78" cy="106" r="6" fill="#4ade80" opacity="0.7" />
          <circle cx="51" cy="119" r="6" fill="#22c55e" opacity="0.7" />
          <circle cx="69" cy="119" r="6" fill="#22c55e" opacity="0.7" />
        </>
      )}
      {isGhost && (
        <>
          <text x="22" y="142" fontSize="14" opacity="0.6">✨</text>
          <text x="88" y="152" fontSize="12" opacity="0.6">⭐</text>
          <text x="44" y="172" fontSize="10" opacity="0.5">✨</text>
        </>
      )}

      {/* ── Layer 6: Hat ── */}
      {hat === "pirate" && (
        <>
          <path d="M14 40 Q60 28 106 40 L100 50 Q60 36 20 50 Z" fill="#1c1c1c" />
          <path d="M28 42 Q30 12 60 8 Q90 12 92 42 Z"           fill="#111" />
          <path d="M28 42 Q60 35 92 42 L90 48 Q60 40 30 48 Z"   fill="#e5e7eb" />
          <circle cx="60" cy="26" r="7"   fill="#e5e7eb" />
          <circle cx="57.5" cy="24" r="2" fill="#111" />
          <circle cx="62.5" cy="24" r="2" fill="#111" />
          <path d="M56 29 L57 32 M60 30 L60 33 M64 29 L63 32" stroke="#111" strokeWidth="1.5" />
        </>
      )}
      {hat === "crown" && (
        <>
          <path d="M28 42 L28 22 L42 32 L60 8 L78 32 L92 22 L92 42 Z" fill="#FFD700" />
          <rect x="28" y="38" width="64" height="8" rx="3" fill="#FFC000" />
          <circle cx="60" cy="10" r="5" fill="#dc2626" />
          <circle cx="30" cy="22" r="4" fill="#3b82f6" />
          <circle cx="90" cy="22" r="4" fill="#22c55e" />
          <circle cx="42" cy="32" r="3" fill="#a855f7" />
          <circle cx="78" cy="32" r="3" fill="#ec4899" />
        </>
      )}
      {hat === "party" && (
        <>
          <polygon points="60,2 30,46 90,46" fill="#a855f7" />
          <polygon points="60,2 30,46 90,46" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,4" />
          <path d="M30 46 Q60 40 90 46" stroke="#ec4899" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="60" cy="3"  r="4" fill="#fbbf24" />
          <circle cx="47" cy="24" r="3" fill="#60a5fa" />
          <circle cx="71" cy="20" r="3" fill="#f87171" />
          <circle cx="55" cy="37" r="2.5" fill="#fbbf24" />
          <circle cx="73" cy="34" r="2.5" fill="#4ade80" />
        </>
      )}
      {hat === "cowboy" && (
        <>
          <ellipse cx="60" cy="43" rx="48" ry="12" fill="#92400e" />
          <path d="M30 41 Q32 14 60 10 Q88 14 90 41 Z"        fill="#78350f" />
          <path d="M38 30 Q50 24 60 26 Q70 24 82 30"          stroke="#92400e" strokeWidth="3" fill="none" />
          <path d="M30 41 Q60 35 90 41 L90 47 Q60 41 30 47 Z" fill="#fbbf24" />
          <rect x="55" y="39" width="10" height="10" rx="2" fill="#d97706" />
          <rect x="57" y="41" width="6"  height="6"  rx="1" fill="#fbbf24" />
        </>
      )}
    </svg>
  );
}

export default function CumpleanosInfantilDemo() {
  const [isVisible, setIsVisible] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedHat,       setSelectedHat]       = useState("none");
  const [selectedShirt,     setSelectedShirt]      = useState("blue");
  const [selectedPants,     setSelectedPants]      = useState("brown");

  useEffect(() => { setIsVisible(true); }, []);

  const characters = [
    { id: "unicorn",      name: "Unicornio",    emoji: "🦄" },
    { id: "superhero",    name: "Superhéroe",   emoji: "🦸" },
    { id: "superheroina", name: "Superheroína", emoji: "🦸‍♀️" },
    { id: "dinosaur",     name: "Dinosaurio",   emoji: "🦕" },
    { id: "ghost",        name: "Fantasma",     emoji: "👻" },
  ];

  const hats = [
    { id: "none",   name: "Sin gorro",        emoji: "🚫" },
    { id: "pirate", name: "Gorro pirata",     emoji: "🏴‍☠️" },
    { id: "crown",  name: "Corona",           emoji: "👑" },
    { id: "party",  name: "Gorro fiesta",     emoji: "🎉" },
    { id: "cowboy", name: "Sombrero vaquero", emoji: "🤠" },
  ];

  const shirts = [
    { id: "blue",   name: "Azul",    color: "#3b82f6" },
    { id: "red",    name: "Rojo",    color: "#ef4444" },
    { id: "green",  name: "Verde",   color: "#22c55e" },
    { id: "yellow", name: "Amarillo",color: "#eab308" },
    { id: "purple", name: "Púrpura", color: "#a855f7" },
  ];

  const pants = [
    { id: "brown", name: "Marrones", color: "#92400e" },
    { id: "black", name: "Negros",   color: "#1f2937" },
    { id: "blue",  name: "Azules",   color: "#1e40af" },
    { id: "red",   name: "Rojos",    color: "#dc2626" },
  ];

  const shirtColor  = shirts.find(s => s.id === selectedShirt)?.color  ?? "#3b82f6";
  const pantsColor  = pants.find(p  => p.id === selectedPants)?.color  ?? "#92400e";

  const mission = selectedCharacter
    ? MISSIONS[selectedCharacter]?.[selectedHat] ?? MISSIONS[selectedCharacter]?.["none"]
    : null;

  return (
    <main className="relative bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-b from-cyan-50 via-blue-50 to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 right-10 text-6xl opacity-20 transition-all duration-1000 ${isVisible ? "translate-x-0 rotate-0" : "translate-x-20 rotate-45"}`}>⚓</div>
          <div className={`absolute bottom-40 left-10 text-7xl opacity-20 transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 rotate-0" : "-translate-x-20 -rotate-45"}`}>🏴‍☠️</div>
          <div className={`absolute top-1/2 right-1/4 text-5xl opacity-15 transition-all duration-1000 delay-500 ${isVisible ? "scale-100" : "scale-0"}`}>⛵</div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center animate-bounce shadow-2xl">
                  <span className="text-5xl">🏴‍☠️</span>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-spin-slow shadow-lg">
                  <Gamepad2 className="w-6 h-6 text-yellow-900" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                ¡Capitán Lucas!
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                cumple <span className="text-5xl text-cyan-500">8</span> años
              </p>
            </div>

            <div className="space-y-3 text-lg md:text-xl text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-500" />
                <span className="font-semibold">Sábado 20 de Julio, 2026</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-cyan-500" />
                <span>17:00h - 21:00h</span>
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center pt-8">
              <a href="/demo/cumpleanos-infantil/juego-recoger-regalos" className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold animate-pulse">
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a recoger regalos!
              </a>
              <a href="/demo/cumpleanos-infantil/juego-3-en-raya" className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold" style={{ marginTop: '12px' }}>
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a 3 en raya!
              </a>
              <a href="/demo/cumpleanos-infantil/juego-puzzle" className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold" style={{ marginTop: '12px' }}>
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a Puzzle!
              </a>
              <a href="/demo/cumpleanos-infantil/juego-battleship" className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold" style={{ marginTop: '12px' }}>
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a Hundir la Flota!
              </a>
              <p className="text-sm text-muted-foreground">Encuentra el regalo pirata</p>
            </div>

            <div className="pt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Character Customization Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-purple-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              ¡Crea tu <span className="text-purple-600">Personaje</span>!
            </h2>
            <p className="text-muted-foreground text-lg">
              Personaliza tu avatar y descubre tu misión secreta
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Avatar preview + mission card */}
            <div className="lg:col-span-1 flex flex-col items-center gap-6">
              <div className="w-full flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 min-h-64">
                <p className="text-sm font-semibold text-muted-foreground mb-4">Tu personaje:</p>
                {selectedCharacter ? (
                  <div className="transition-all duration-300 ease-out">
                    <AvatarSVG
                      character={selectedCharacter}
                      hat={selectedHat}
                      shirtColor={shirtColor}
                      pantsColor={pantsColor}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <span className="text-5xl opacity-40">🎭</span>
                    <p className="text-muted-foreground text-sm">Elige un personaje</p>
                  </div>
                )}
              </div>

              {/* Play button — appears when character is selected */}
              {selectedCharacter && (
                <a
                  href={`/demo/cumpleanos-infantil/juego-runner?c=${selectedCharacter}&h=${selectedHat}&shirt=${selectedShirt}&pants=${selectedPants}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 text-white font-black text-lg px-6 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
                >
                  <Gamepad2 className="w-6 h-6" />
                  ¡Jugar con mi personaje!
                </a>
              )}

              {/* Mission card — appears when character is selected */}
              {mission && (
                <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-400 p-6 text-white shadow-xl animate-mission-in">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">⚡ Tu misión secreta</p>
                  <h3 className="text-xl font-black leading-tight mb-2">
                    ¡Eres {mission.title}!
                  </h3>
                  <p className="text-sm opacity-90 mb-4 leading-snug">
                    {mission.desc.charAt(0).toUpperCase() + mission.desc.slice(1)}.
                  </p>
                  <div className="bg-white/20 rounded-2xl px-4 py-2 inline-block">
                    <span className="text-sm font-bold">Poder: {mission.power}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customization options */}
            <div className="lg:col-span-2 space-y-8">
              {/* Character selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">1. Elige tu personaje:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => setSelectedCharacter(char.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        selectedCharacter === char.id
                          ? "border-purple-600 bg-purple-100 scale-105 shadow-md"
                          : "border-border hover:border-purple-300 bg-card"
                      }`}
                    >
                      <div className="text-4xl mb-2">{char.emoji}</div>
                      <p className="text-xs font-semibold">{char.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCharacter && (
                <>
                  {/* Hat selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">2. Elige gorro:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {hats.map((hat) => (
                        <button
                          key={hat.id}
                          onClick={() => setSelectedHat(hat.id)}
                          className={`p-4 rounded-2xl border-2 transition-all text-center ${
                            selectedHat === hat.id
                              ? "border-blue-600 bg-blue-100 scale-105 shadow-md"
                              : "border-border hover:border-blue-300 bg-card"
                          }`}
                        >
                          <div className="text-4xl mb-2">{hat.emoji}</div>
                          <p className="text-xs font-semibold">{hat.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shirt color selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">3. Color de camiseta:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {shirts.map((shirt) => (
                        <button
                          key={shirt.id}
                          onClick={() => setSelectedShirt(shirt.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            selectedShirt === shirt.id
                              ? "border-gray-800 scale-110 shadow-md"
                              : "border-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="w-full aspect-square rounded-lg mx-auto mb-2 border-2 border-white shadow-sm" style={{ backgroundColor: shirt.color }} />
                          <p className="text-xs font-semibold text-center">{shirt.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pants color selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">4. Color de pantalones:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {pants.map((pant) => (
                        <button
                          key={pant.id}
                          onClick={() => setSelectedPants(pant.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            selectedPants === pant.id
                              ? "border-gray-800 scale-110 shadow-md"
                              : "border-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="w-full aspect-square rounded-lg mx-auto mb-2 border-2 border-white shadow-sm" style={{ backgroundColor: pant.color }} />
                          <p className="text-xs font-semibold text-center">{pant.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Detalles de la <span className="text-cyan-500">Aventura</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ubicación</h3>
                <p className="text-muted-foreground text-lg">Isla del Tesoro - Parque Aventura</p>
                <p className="text-muted-foreground mt-2">Avenida del Mar, 123<br />Barcelona, España</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Actividades</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>🎮 Zona de videojuegos</li>
                  <li>🏴‍☠️ Búsqueda del tesoro</li>
                  <li>🎂 Tarta pirata gigante</li>
                  <li>🎁 Regalos y sorpresas</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">🏴‍☠️ Código pirata</p>
            <p className="text-muted-foreground">Ven disfrazado de pirata • Trae tu mejor sonrisa de aventurero</p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-cyan-50 to-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              ¿Vienes a la <span className="text-cyan-500">Aventura</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              ¡Confirma tu asistencia para reservar tu lugar en el barco pirata!
            </p>
          </div>
          <RSVPForm config={cumpleanosRSVPConfig} />
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground mb-4">Esta es una demo de invitación web creada por</p>
          <a href="/" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-semibold text-lg transition-colors">
            ← Volver a Momento Wow
          </a>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }

        @keyframes mission-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .animate-mission-in { animation: mission-in 0.4s ease-out both; }
      `}</style>
    </main>
  );
}
