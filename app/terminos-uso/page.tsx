import React from "react";

export default function TerminosUso() {
  return (
    <main className="container mx-auto max-w-3xl py-16 px-4 text-base text-foreground">
      <h1 className="text-3xl font-bold mb-6">Términos de Uso y Aviso Legal</h1>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Titularidad del sitio web</h2>
      <p className="mb-4">
        Este sitio web es propiedad de <b>Momento Wow</b>.<br />
        <b>Titular:</b> [Nombre o razón social]<br />
        <b>NIF/CIF:</b> [NIF/CIF]<br />
        <b>Domicilio social:</b> [Dirección completa]<br />
        <b>Email de contacto:</b> <a href="mailto:hola@momentowow.es" className="text-primary underline">hola@momentowow.es</a>
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Objeto</h2>
      <p className="mb-4">
        El presente Aviso Legal regula el acceso, navegación y uso del sitio web de Momento Wow, dedicado a la creación de invitaciones web interactivas para eventos.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Propiedad intelectual e industrial</h2>
      <p className="mb-4">
        Todos los contenidos del sitio web (textos, imágenes, logotipos, diseños, código fuente, etc.) son propiedad de Momento Wow o de sus licenciantes, y están protegidos por la legislación vigente sobre propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o comunicación pública sin autorización expresa.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Responsabilidad</h2>
      <p className="mb-4">
        Momento Wow no se responsabiliza del mal uso que se realice de los contenidos del sitio web ni de los daños derivados del acceso o uso de la información. Tampoco se responsabiliza de los contenidos de los enlaces externos que puedan aparecer en la web.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Normas de uso</h2>
      <p className="mb-4">
        El usuario se compromete a hacer un uso adecuado y lícito del sitio web y de sus contenidos, respetando la legislación vigente y los derechos de terceros.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Protección de datos</h2>
      <p className="mb-4">
        Los datos personales facilitados a través del sitio web serán tratados conforme a lo establecido en nuestra <a href="/politica-privacidad" className="text-primary underline">Política de Privacidad</a>.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Legislación y jurisdicción</h2>
      <p className="mb-4">
        El presente Aviso Legal se rige por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a los Juzgados y Tribunales de Madrid, salvo que la ley disponga otra cosa.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Contacto</h2>
      <p>
        Para cualquier consulta sobre este Aviso Legal, puedes escribir a <a href="mailto:hola@momentowow.es" className="text-primary underline">hola@momentowow.es</a>.
      </p>
    </main>
  );
}
