"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Check,
  ArrowLeft,
  ArrowRight,
  PartyPopper,
  Utensils,
  Wine,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type FormState = {
  attending: "si" | "no" | "";
  name: string;
  guests: number;
  menu: string;
  allergies: string;
  song: string;
};

type StepRsvpProps = {
  eventId?: string;
};

async function saveRSVPToSupabase(eventId: string, form: FormState) {
  try {
    const payload = {
      name: form.name.trim(),
      guests: String(form.guests),
      attendance: form.attending === "si" ? "yes" : "no",
      menu: form.menu,
      allergies: form.allergies.trim(),
      song: form.song.trim(),
    };

    await fetch(`${supabaseUrl}/rest/v1/rsvps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        event_id: eventId,
        created_at: new Date().toISOString(),
        data: payload,
      }),
    });
  } catch {
    // Keep the UX intact even if Supabase is temporarily unavailable.
  }
}

const MENUS = [
  { id: "carne", label: "Carne", icon: Utensils },
  { id: "pescado", label: "Pescado", icon: Wine },
  { id: "veggie", label: "Vegetariano", icon: Heart },
];

export function StepRsvp({ eventId = "demo-boda-elena-mateo" }: StepRsvpProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormState>({
    attending: "",
    name: "",
    guests: 1,
    menu: "",
    allergies: "",
    song: "",
  });
  const [nameError, setNameError] = useState("");

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const chooseAttending = (value: "si" | "no") => {
    setForm((f) => ({ ...f, attending: value }));
    setDir(1);
    // If not attending, jump straight to the name/farewell step
    setStep(1);
  };

  const submitName = async () => {
    if (!form.name.trim()) {
      setNameError("Necesitamos tu nombre para la lista");
      return;
    }
    setNameError("");
    if (form.attending === "no") {
      await saveRSVPToSupabase(eventId, form);
      setSent(true);
    } else {
      go(2);
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 50 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -50 }),
  };

  /* ---------- Success state ---------- */
  if (sent) {
    const going = form.attending === "si";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: going ? [0, -6, 6, 0] : 0 }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-secondary"
        >
          {going ? (
            <PartyPopper className="w-10 h-10 text-secondary-foreground" />
          ) : (
            <Heart className="w-10 h-10 text-secondary-foreground fill-current" />
          )}
        </motion.div>
        <h3 className="font-serif text-3xl text-primary mb-2">
          ¡Gracias, {form.name}!
        </h3>
        <p className="text-muted-foreground text-pretty">
          {going
            ? `Te esperamos junto a ${form.guests} ${
                form.guests === 1 ? "persona" : "personas"
              }. ¡Va a ser inolvidable!`
            : "Te echaremos de menos, pero gracias por avisarnos con cariño."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-[320px]">
      {/* progress dots */}
      {form.attending === "si" && (
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: i === step ? 1.3 : 1 }}
              className={`h-2 w-2 rounded-full ${
                i <= step ? "bg-primary" : "bg-primary/20"
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir}>
        {/* STEP 0 — attending */}
        {step === 0 && (
          <motion.div
            key="step0"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif text-3xl text-primary text-center mb-6">
              ¿Contamos contigo?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => chooseAttending("si")}
                className="rounded-3xl bg-primary py-6 text-lg font-bold text-primary-foreground shadow-lg"
              >
                ¡Sí, allí estaré! 🎉
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => chooseAttending("no")}
                className="rounded-3xl border-2 border-border bg-card py-6 text-lg font-bold text-foreground hover:border-primary/40"
              >
                No podré asistir
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 1 — name */}
        {step === 1 && (
          <motion.div
            key="step1"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif text-3xl text-primary text-center mb-6">
              {form.attending === "no"
                ? "Déjanos tu nombre"
                : "¡Genial! ¿Cómo te llamas?"}
            </h3>
            <Label htmlFor="rsvp-name" className="mb-2 block">
              Nombre y apellidos
            </Label>
            <Input
              id="rsvp-name"
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && submitName()}
              placeholder="Ej. Lucía Fernández"
              className="rounded-3xl h-12"
            />
            {nameError && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -6, 6, 0] }}
                className="text-destructive text-sm mt-2"
              >
                {nameError}
              </motion.p>
            )}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => go(0)}
                className="rounded-3xl h-12 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button onClick={() => void submitName()} className="flex-1 rounded-3xl h-12">
                {form.attending === "no" ? "Enviar" : "Siguiente"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — guests + menu */}
        {step === 2 && (
          <motion.div
            key="step2"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif text-3xl text-primary text-center mb-6">
              Cuéntanos los detalles
            </h3>

            <Label className="mb-2 block">¿Cuántos venís en total?</Label>
            <div className="flex items-center justify-center gap-5 mb-6">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() =>
                  setForm((f) => ({ ...f, guests: Math.max(1, f.guests - 1) }))
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-2xl font-bold text-primary"
                aria-label="Restar invitado"
              >
                –
              </motion.button>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={form.guests}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  className="w-10 text-center text-4xl font-bold text-primary tabular-nums"
                >
                  {form.guests}
                </motion.span>
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() =>
                  setForm((f) => ({ ...f, guests: Math.min(8, f.guests + 1) }))
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-2xl font-bold text-primary"
                aria-label="Sumar invitado"
              >
                +
              </motion.button>
            </div>

            <Label className="mb-2 block">Preferencia de menú</Label>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {MENUS.map((m) => {
                const Icon = m.icon;
                const active = form.menu === m.id;
                return (
                  <motion.button
                    key={m.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm({ ...form, menu: m.id })}
                    className={`flex flex-col items-center gap-2 rounded-3xl border-2 py-4 transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {m.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => go(1)}
                className="rounded-3xl h-12 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => go(3)}
                disabled={!form.menu}
                className="flex-1 rounded-3xl h-12"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — allergies + song */}
        {step === 3 && (
          <motion.div
            key="step3"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif text-3xl text-primary text-center mb-6">
              Un último detalle
            </h3>

            <Label htmlFor="rsvp-allergy" className="mb-2 block">
              ¿Alguna alergia o intolerancia?
            </Label>
            <Input
              id="rsvp-allergy"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              placeholder="Opcional: gluten, lactosa, frutos secos…"
              className="rounded-3xl h-12 mb-5"
            />

            <Label htmlFor="rsvp-song" className="mb-2 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-primary" />
              La canción que no puede faltar
            </Label>
            <Input
              id="rsvp-song"
              value={form.song}
              onChange={(e) => setForm({ ...form, song: e.target.value })}
              placeholder="Opcional: tu temazo para la pista"
              className="rounded-3xl h-12"
            />

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => go(2)}
                className="rounded-3xl h-12 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  void saveRSVPToSupabase(eventId, form);
                  setSent(true);
                }}
                className="flex-1 rounded-3xl h-12 text-base"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar asistencia
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
