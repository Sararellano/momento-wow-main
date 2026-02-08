import React from "react";

export default function PoliticaPrivacidad() {
  return (
    <main className="container mx-auto max-w-3xl py-16 px-4 text-base text-foreground">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="mb-4">
        En <b>Momento Wow</b> nos comprometemos a proteger tu privacidad y tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos la información que nos proporcionas al utilizar nuestros servicios de creación de invitaciones web interactivas.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. ¿Quiénes somos?</h2>
      <p className="mb-4">
        Momento Wow es una empresa dedicada a la creación de invitaciones web interactivas para eventos, con el objetivo de convertir la primera impresión de tu evento en un recuerdo inolvidable.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. ¿Qué datos recopilamos?</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Nombre y apellidos</li>
        <li>Correo electrónico</li>
        <li>Datos del evento (tipo, fecha, detalles)</li>
        <li>Información de contacto adicional que nos proporciones</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. ¿Para qué usamos tus datos?</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Para responder a tus solicitudes y consultas</li>
        <li>Para crear y personalizar tus invitaciones web</li>
        <li>Para enviarte información relevante sobre nuestros servicios</li>
        <li>Para cumplir con obligaciones legales</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. ¿Cómo protegemos tu información?</h2>
      <p className="mb-4">
        Utilizamos medidas de seguridad técnicas y organizativas para proteger tus datos personales y evitar el acceso no autorizado, la alteración o la pérdida de la información.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. ¿Con quién compartimos tus datos?</h2>
      <p className="mb-4">
        No compartimos tus datos personales con terceros, salvo obligación legal o para la prestación de servicios estrictamente necesarios para la creación de tus invitaciones.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Tus derechos</h2>
      <p className="mb-4">
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición enviando un correo a <a href="mailto:hola@momentowow.es" className="text-primary underline">hola@momentowow.es</a>.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Cambios en la política</h2>
      <p className="mb-4">
        Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Te recomendamos revisarla periódicamente.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Contacto</h2>
      <p>
        Si tienes dudas sobre nuestra política de privacidad, puedes contactarnos en <a href="mailto:hola@momentowow.es" className="text-primary underline">hola@momentowow.es</a>.
      </p>
    </main>
  );
}
