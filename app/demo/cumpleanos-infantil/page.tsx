"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Calendar, Gamepad2, ChevronDown } from "lucide-react";

export default function CumpleanosInfantilDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", guests: "1", attending: true });
  const [submitted, setSubmitted] = useState(false);

  // Character customization state
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedHat, setSelectedHat] = useState("none");
  const [selectedShirt, setSelectedShirt] = useState("blue");
  const [selectedPants, setSelectedPants] = useState("brown");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Character customization options
  const characters = [
    { id: "unicorn", name: "Unicornio", emoji: "🦄" },
    { id: "superhero", name: "Superhéroe", emoji: "🦸" },
    { id: "superheroina", name: "Superheroína", emoji: "🦸‍♀️" },
    { id: "dinosaur", name: "Dinosaurio", emoji: "🦕" },
    { id: "ghost", name: "Fantasma", emoji: "👻" },
  ];

  const hats = [
    { id: "none", name: "Sin gorro", emoji: "" },
    { id: "pirate", name: "Gorro pirata", emoji: "🏴‍☠️" },
    { id: "crown", name: "Corona", emoji: "👑" },
    { id: "party", name: "Gorro fiesta", emoji: "🎩" },
    { id: "cowboy", name: "Sombrero vaquero", emoji: "🤠" },
  ];

  const shirts = [
    { id: "blue", name: "Azul", color: "#3b82f6" },
    { id: "red", name: "Rojo", color: "#ef4444" },
    { id: "green", name: "Verde", color: "#22c55e" },
    { id: "yellow", name: "Amarillo", color: "#eab308" },
    { id: "purple", name: "Púrpura", color: "#a855f7" },
  ];

  const pants = [
    { id: "brown", name: "Marrones", color: "#92400e" },
    { id: "black", name: "Negros", color: "#1f2937" },
    { id: "blue", name: "Azules", color: "#1e40af" },
    { id: "red", name: "Rojos", color: "#dc2626" },
  ];

  // Handle RSVP form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Get character display
  const renderCharacter = () => {
    if (!selectedCharacter) return null;

    const character = characters.find(c => c.id === selectedCharacter);
    const hat = hats.find(h => h.id === selectedHat);
    const shirt = shirts.find(s => s.id === selectedShirt);
    const pants_obj = pants.find(p => p.id === selectedPants);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-7xl">
          {hat?.emoji}{character?.emoji}
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: shirt?.color }} />
          <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: pants_obj?.color }} />
        </div>
      </div>
    );
  };

  return (
    <main className="relative bg-background">
      {/* Hero Section - Birthday theme */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-b from-cyan-50 via-blue-50 to-background">
        {/* Decorative pirate elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-20 right-10 text-6xl opacity-20 transition-all duration-1000 ${
              isVisible ? "translate-x-0 rotate-0" : "translate-x-20 rotate-45"
            }`}
          >
            ⚓
          </div>
          <div
            className={`absolute bottom-40 left-10 text-7xl opacity-20 transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 rotate-0" : "-translate-x-20 -rotate-45"
            }`}
          >
            🏴‍☠️
          </div>
          <div
            className={`absolute top-1/2 right-1/4 text-5xl opacity-15 transition-all duration-1000 delay-500 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
          >
            ⛵
          </div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Pirate icon */}
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

            {/* Birthday boy name */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                ¡Capitán Lucas!
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                cumple <span className="text-5xl text-cyan-500">8</span> años
              </p>
            </div>

            {/* Event details */}
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

            {/* Game button - Big and prominent */}
            <div className="flex flex-col gap-4 items-center pt-8">
              <a
                href="/demo/cumpleanos-infantil/juego-recoger-regalos"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold animate-pulse"
              >
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a recoger regalos!
              </a>
              <a
                href="/demo/cumpleanos-infantil/juego-3-en-raya"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold"
                style={{ marginTop: '12px' }}
              >
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a 3 en raya!
							</a>
							<a
                href="/demo/cumpleanos-infantil/juego-puzzle"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold"
                style={{ marginTop: '12px' }}
              >
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a Puzzle!
							</a>
							<a
                href="/demo/cumpleanos-infantil/juego-battleship"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white px-12 py-6 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold"
                style={{ marginTop: '12px' }}
              >
                <Gamepad2 className="w-8 h-8" />
                ¡JUEGA AHORA a Hundir la Flota!
              </a>
              <p className="text-sm text-muted-foreground">Encuentra el regalo pirata</p>
            </div>

            {/* Scroll indicator */}
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
              Personaliza tu avatar para la fiesta
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Character preview */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 h-full">
              <p className="text-sm font-semibold text-muted-foreground mb-4">Tu personaje:</p>
              <div className="min-h-48 flex items-center justify-center">
                {selectedCharacter ? (
                  renderCharacter()
                ) : (
                  <p className="text-muted-foreground">Elige un personaje</p>
                )}
              </div>
            </div>

            {/* Customization options */}
            <div className="lg:col-span-2 space-y-8">
              {/* Character selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Elige tu personaje:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => setSelectedCharacter(char.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        selectedCharacter === char.id
                          ? "border-purple-600 bg-purple-100"
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
                    <h3 className="text-xl font-bold text-foreground">Elige gorro:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {hats.map((hat) => (
                        <button
                          key={hat.id}
                          onClick={() => setSelectedHat(hat.id)}
                          className={`p-4 rounded-2xl border-2 transition-all text-center ${
                            selectedHat === hat.id
                              ? "border-blue-600 bg-blue-100"
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
                    <h3 className="text-xl font-bold text-foreground">Color de camiseta:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {shirts.map((shirt) => (
                        <button
                          key={shirt.id}
                          onClick={() => setSelectedShirt(shirt.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            selectedShirt === shirt.id
                              ? "border-gray-800 scale-110"
                              : "border-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div
                            className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: shirt.color }}
                          />
                          <p className="text-xs font-semibold">{shirt.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pants color selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">Color de pantalones:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {pants.map((pant) => (
                        <button
                          key={pant.id}
                          onClick={() => setSelectedPants(pant.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            selectedPants === pant.id
                              ? "border-gray-800 scale-110"
                              : "border-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div
                            className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: pant.color }}
                          />
                          <p className="text-xs font-semibold">{pant.name}</p>
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
            {/* Location */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ubicación</h3>
                <p className="text-muted-foreground text-lg">
                  Isla del Tesoro - Parque Aventura
                </p>
                <p className="text-muted-foreground mt-2">
                  Avenida del Mar, 123<br />
                  Barcelona, España
                </p>
              </div>
            </div>

            {/* Activities */}
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

          {/* What to bring */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              🏴‍☠️ Código pirata
            </p>
            <p className="text-muted-foreground">
              Ven disfrazado de pirata • Trae tu mejor sonrisa de aventurero
            </p>
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

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl bg-card border-2 border-border shadow-xl">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre del tripulante
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Juan Pérez"
                  className="rounded-xl py-6"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-medium text-foreground">
                  Número de acompañantes
                </label>
                <select
                  id="guests"
                  name="guests"
                  className="w-full rounded-xl py-3 px-4 border-2 border-border bg-background"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                >
                  <option value="1">Solo yo</option>
                  <option value="2">Yo + 1 niño/a</option>
                  <option value="3">Yo + 2 niños/as</option>
                </select>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">¿Subirás al barco?</p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: true })}
                    className={`flex-1 py-3 px-6 rounded-xl border-2 transition-all ${
                      formData.attending
                        ? "border-cyan-500 bg-cyan-500 text-white"
                        : "border-border bg-background text-foreground hover:border-cyan-300"
                    }`}
                  >
                    ¡Sí, zarpo con vosotros!
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: false })}
                    className={`flex-1 py-3 px-6 rounded-xl border-2 transition-all ${
                      !formData.attending
                        ? "border-cyan-500 bg-cyan-500 text-white"
                        : "border-border bg-background text-foreground hover:border-cyan-300"
                    }`}
                  >
                    No puedo asistir
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300"
              >
                Confirmar asistencia
              </Button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-6 p-8 rounded-3xl bg-card border-2 border-border shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                <span className="text-4xl">⚓</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {formData.attending ? "¡Bienvenido a la tripulación!" : "¡Gracias por avisar!"}
                </h3>
                <p className="text-muted-foreground">
                  {formData.attending
                    ? "¡Nos vemos el 20 de Julio para la gran aventura pirata!"
                    : "¡Esperamos verte en la próxima aventura!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Back to main site */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground mb-4">
            Esta es una demo de invitación web creada por
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-semibold text-lg transition-colors"
          >
            ← Volver a Momento Wow
          </a>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </main>
  );
}
