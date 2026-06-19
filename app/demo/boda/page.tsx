"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Heart,
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Clock,
  Music,
  Sparkles,
  ChevronDown,
  Home,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MemoryGame, TriviaQuiz, Confetti } from "@/components/boda-games";
import { StepRsvp } from "@/components/boda-rsvp";

const WEDDING_DATE = new Date("2026-09-12T18:00:00");

const COUPLE = { bride: "Elena", groom: "Mateo" };

const STORY = [
  {
    year: "2019",
    title: "El primer café",
    text: "Una cita a ciegas que ninguno de los dos quería. Tres horas después, seguíamos hablando.",
    image: "/boda/story-coffee.png",
    tint: "rgba(98, 0, 238, 0.10)",
  },
  {
    year: "2021",
    title: "Bajo la lluvia",
    text: "Nos pilló la tormenta sin paraguas. Fue el día que supimos que era para siempre.",
    image: "/boda/story-rain.png",
    tint: "rgba(46, 255, 169, 0.12)",
  },
  {
    year: "2025",
    title: "La pregunta",
    text: "Al atardecer, frente al mar. Un sí entre lágrimas que cambió todo.",
    image: "/boda/story-proposal.png",
    tint: "rgba(98, 0, 238, 0.14)",
  },
];

function useCountdown(target: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

/* ---------- Envelope unlock screen ---------- */
function EnvelopeScreen({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1400);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#F5F5F0" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* floating hearts */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20"
          style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 4) * 20}%` }}
          animate={{ y: [0, -16, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
          }}
        >
          <Heart className="w-5 h-5 fill-current" />
        </motion.div>
      ))}

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8"
      >
        Estás invitado
      </motion.p>

      {/* Envelope */}
      <div className="relative w-72 h-52 md:w-80 md:h-56" aria-hidden>
        {/* body */}
        <div className="absolute inset-0 rounded-3xl bg-card shadow-2xl border border-primary/10" />

        {/* flap */}
        <motion.div
          className="absolute left-0 right-0 top-0 origin-top"
          style={{ transformStyle: "preserve-3d" }}
          animate={opening ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className="mx-auto h-0 w-0"
            style={{
              borderLeft: "144px solid transparent",
              borderRight: "144px solid transparent",
              borderTop: "104px solid var(--primary)",
              opacity: 0.92,
            }}
          />
        </motion.div>

        {/* letter sliding up */}
        <motion.div
          className="absolute inset-x-6 top-10 bottom-6 rounded-2xl bg-white shadow-lg flex flex-col items-center justify-center"
          animate={
            opening
              ? { y: -120, opacity: 0, scale: 0.95 }
              : { y: 0, opacity: 1 }
          }
          transition={{ duration: 0.7, delay: opening ? 0.5 : 0 }}
        >
          <span className="font-serif text-3xl text-primary">
            {COUPLE.bride} & {COUPLE.groom}
          </span>
          <span className="text-xs tracking-widest uppercase text-muted-foreground mt-2">
            Nuestra boda
          </span>
        </motion.div>

        {/* wax seal */}
        <motion.button
          onClick={handleOpen}
          aria-label="Abrir invitación"
          className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-xl"
          style={{ backgroundColor: "#6200EE" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={
            opening
              ? { scale: 0, opacity: 0 }
              : { scale: [1, 1.06, 1] }
          }
          transition={
            opening
              ? { duration: 0.3 }
              : { duration: 2, repeat: Number.POSITIVE_INFINITY }
          }
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </motion.button>
      </div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
        className="mt-10 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleOpen}
          className="text-primary font-semibold tracking-wide"
        >
          Toca el sello para abrir
        </button>
        <ChevronDown className="w-5 h-5 text-primary/60" />
      </motion.div>
    </motion.div>
  );
}

/* ---------- Countdown ---------- */
function Countdown() {
  const t = useCountdown(WEDDING_DATE);
  const units = [
    { v: t.d, l: "Días" },
    { v: t.h, l: "Horas" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Seg" },
  ];
  return (
    <div className="flex justify-center gap-3 md:gap-5">
      {units.map((u) => (
        <div
          key={u.l}
          className="flex flex-col items-center rounded-3xl bg-card/80 backdrop-blur px-3 py-4 md:px-6 md:py-5 shadow-lg border border-primary/10 min-w-[68px] md:min-w-[88px]"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={u.v}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-4xl font-bold text-primary tabular-nums"
            >
              {String(u.v).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Story item (scrollytelling) ---------- */
function StoryItem({
  item,
  index,
  onInView,
}: {
  item: (typeof STORY)[number];
  index: number;
  onInView: (tint: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);
  const reversed = index % 2 === 1;

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.35 && v < 0.7) onInView(item.tint);
    });
    return () => unsub();
  }, [scrollYProgress, item.tint, onInView]);

  return (
    <div ref={ref} className="py-10 md:py-16">
      <div
        className={`flex flex-col ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-6 md:gap-12`}
      >
        <motion.div
          initial={{ opacity: 0, x: reversed ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="relative w-full md:w-1/2"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute top-4 left-4 rounded-full bg-card/90 backdrop-blur px-4 py-1.5 text-sm font-bold text-primary shadow">
              {item.year}
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <Sparkles className="w-6 h-6 text-secondary mx-auto md:mx-0 mb-3" />
          <h3 className="font-serif text-3xl md:text-4xl text-primary mb-3">
            {item.title}
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
            {item.text}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function BodaPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bgTint, setBgTint] = useState("transparent");
  const [confettiFire, setConfettiFire] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setUnlocked(true);
    // The opening click is a valid user gesture -> start audio
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Background music (royalty-free tone) */}
      <audio ref={audioRef} loop preload="auto">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ambient-piano-loop.mp3"
          type="audio/mpeg"
        />
      </audio>

      <AnimatePresence>
        {!unlocked && <EnvelopeScreen onOpen={handleOpen} />}
      </AnimatePresence>

      {/* dynamic scroll tint */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 transition-colors duration-700"
        animate={{ backgroundColor: bgTint }}
      />

      {unlocked && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* confetti layer for correct trivia answers */}
          <Confetti fire={confettiFire} />

          {/* sound + home controls */}
          <div className="fixed top-4 right-4 z-40 flex gap-2">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card/90 backdrop-blur shadow-lg border border-primary/10 text-primary"
            >
              {muted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="fixed top-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-card/90 backdrop-blur shadow-lg border border-primary/10 text-primary"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* HERO */}
          <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-4">
            <Image
              src="/boda/couple-hero.png"
              alt={`${COUPLE.bride} y ${COUPLE.groom}`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#F5F5F0]" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="relative z-10 text-center text-white"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="tracking-[0.3em] uppercase text-sm mb-4 drop-shadow"
              >
                Nos casamos
              </motion.p>
              <h1 className="font-serif text-6xl md:text-8xl drop-shadow-lg mb-4">
                {COUPLE.bride}
                <span className="text-secondary"> & </span>
                {COUPLE.groom}
              </h1>
              <p className="text-lg md:text-xl drop-shadow mb-2">
                12 de Septiembre, 2026 · Mallorca
              </p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                className="mt-10"
              >
                <ChevronDown className="w-7 h-7 mx-auto" />
              </motion.div>
            </motion.div>
          </section>

          {/* COUNTDOWN */}
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl md:text-4xl text-primary mb-8"
              >
                Cuenta atrás para el gran día
              </motion.h2>
              <Countdown />
            </div>
          </section>

          {/* STORY - scrollytelling */}
          <section className="relative py-12 px-4">
            <div className="container mx-auto max-w-5xl">
              <div className="text-center mb-6">
                <p className="tracking-[0.3em] uppercase text-sm text-secondary-foreground/70 mb-2">
                  Scrollytelling
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-primary">
                  Nuestra Historia
                </h2>
              </div>
              {STORY.map((item, i) => (
                <StoryItem
                  key={item.year}
                  item={item}
                  index={i}
                  onInView={setBgTint}
                />
              ))}
            </div>
          </section>

          {/* VENUE */}
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-5xl">
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/boda/venue.png"
                    alt="Finca de la celebración"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1024px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                  <h3 className="font-serif text-3xl md:text-4xl mb-4">
                    Finca Son Olivera
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-secondary" /> 12 Sep 2026
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary" /> 18:00 h
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-secondary" /> Mallorca,
                      España
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GAMING ZONE */}
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <p className="tracking-[0.3em] uppercase text-sm text-secondary-foreground/70 mb-2">
                  Zona de juego
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-primary text-balance">
                  ¿Cuánto conoces a los novios?
                </h2>
                <p className="text-muted-foreground mt-3">
                  Pon a prueba tu memoria y tu intuición antes del gran día.
                </p>
              </motion.div>

              {/* Memory Match */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="rounded-3xl p-5 md:p-8 shadow-xl border-primary/10 mb-8">
                  <div className="flex items-center gap-2 mb-5">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-2xl text-primary">
                      Encuentra las parejas
                    </h3>
                  </div>
                  <MemoryGame />
                </Card>
              </motion.div>

              {/* Trivia */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="rounded-3xl p-5 md:p-8 shadow-xl border-primary/10">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-2xl text-primary">
                      El trivial de Elena & Mateo
                    </h3>
                  </div>
                  <TriviaQuiz onCorrect={() => setConfettiFire((n) => n + 1)} />
                </Card>
              </motion.div>
            </div>
          </section>

          {/* RSVP */}
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-md">
              <Card className="rounded-3xl p-6 md:p-8 shadow-xl border-primary/10">
                <div className="text-center mb-6">
                  <Music className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h2 className="font-serif text-3xl text-primary">
                    Confirma tu asistencia
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    Reserva antes del 1 de Agosto
                  </p>
                </div>
                <StepRsvp eventId="demo-boda-elena-mateo" />
              </Card>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="relative py-12 px-4 text-center">
            <Heart className="w-8 h-8 text-primary fill-primary/20 mx-auto mb-4" />
            <p className="font-serif text-2xl text-primary mb-1">
              {COUPLE.bride} & {COUPLE.groom}
            </p>
            <p className="text-muted-foreground text-sm">
              Con cariño, os esperamos · 12.09.2026
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              Hecho con cariño por{" "}
              <Link href="/" className="text-primary font-semibold">
                Momento Wow
              </Link>
            </p>
          </footer>
        </motion.main>
      )}
    </div>
  );
}
