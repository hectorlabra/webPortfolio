import {
  Paragraph,
  Heading,
  List,
  Blockquote,
  Callout,
} from "@/components/content";

// Metadata exportada para uso en el layout
export const metadata = {
  title:
    "Por qué dejé $5K/mes en afiliados para construir SaaS (y cómo puedes hacer el salto sin renunciar a tu trabajo)",
  description:
    "Roadmap Anti-Hype: deja de estudiar tutoriales y empieza a shippear activos. Sin atajos mágicos, solo ingeniería y pragmatismo.",
  date: "2025-12-11",
  slug: "hoja-de-ruta",
  author: "Héctor Labra",
  readingTimeMinutes: 15,
};

// Componente de separador visual
function Divider() {
  return <hr className="border-white/10 my-16" />;
}

// El contenido principal del artículo
export default function HojaDeRutaContent() {
  return (
    <>
      <Heading level={2} id="mi-realidad">
        Mi realidad (sin filtros)
      </Heading>

      <Paragraph>
        No te voy a vender la fantasía del millonario en pijama con un SaaS de
        $100K/mes.
      </Paragraph>

      <Paragraph>
        <strong>La verdad:</strong> Todavía no tengo ese SaaS.
      </Paragraph>

      <Paragraph>Pero sí tengo esto:</Paragraph>

      <List
        items={[
          <>
            ✅ Generé <strong>$5,000 USD/mes en ingresos semi-pasivos</strong>
            con un blog de marca personal y marketing de afiliados
          </>,
          <>
            ✅ <strong>200+ clientes</strong> de mi agencia de WordPress y
            diseño web
          </>,
          <>
            ✅ <strong>Comunidad de afiliados</strong> que hicieron crecer sus
            blogs con monetización semi-pasiva generando en promedio 1K USD al
            mes como ingreso extra
          </>,
          <>
            ✅ <strong>7 años en la trinchera:</strong> de agencias WordPress a
            afiliados, siempre monetizando
          </>,
        ]}
      />

      <Paragraph>¿Por qué importa esto para tu SaaS?</Paragraph>

      <Paragraph>Porque un SaaS exitoso NO es solo código. Es:</Paragraph>

      <List
        items={[
          <>
            <strong>Atraer tráfico</strong> (SEO) → Ya lo domino
          </>,
          <>
            <strong>Monetizar</strong> (ventas/afiliados) → Ya lo hice
          </>,
          <>
            <strong>Construir productos</strong> (agencia) → Ya lo probé
          </>,
          <>
            <strong>Distribuir</strong> (marketing de contenido) → Es mi
            especialidad
          </>,
        ]}
      />

      <Paragraph>
        Ahora estoy juntando todas esas piezas en SaaS. Y te llevo conmigo en el
        journey.
      </Paragraph>

      <Paragraph>
        Esta no es una masterclass de un millonario hablando desde la cima. Es
        el mapa en tiempo real de alguien que ya validó cada pieza del negocio
        por separado, y ahora las está ensamblando en software.
      </Paragraph>

      <Divider />

      <Callout variant="tip">
        Ahora que sabes quién soy y qué he construido, déjame mostrarte por qué
        decidí dar este salto. Y por qué tú también deberías considerarlo.
      </Callout>

      <Heading level={2} id="la-verdad-incomoda">
        La verdad incómoda sobre tu carrera
      </Heading>

      <Paragraph>
        Hay una mentira cómoda que nos repetimos todos los que trabajamos en
        tecnología: "Si aprendo ese nuevo framework, si saco esa certificación
        de AWS, si domino la última arquitectura de moda... entonces seré
        libre."
      </Paragraph>

      <Paragraph>
        Es una mentira porque confunde <strong>Capacidad Técnica</strong> con
        <strong> Libertad Financiera</strong>.
      </Paragraph>

      <Paragraph>
        Si aprendes más frameworks, te convertirás en un mejor empleado. Te
        subirán el sueldo, sí. Te darán un título más "Senior", probablemente.
        Te sentirás importante en las reuniones de arquitectura. Pero tu
        libertad, tu tiempo y tu futuro seguirán dependiendo de una sola
        variable que tú no controlas:{" "}
        <strong>la decisión de tu empleador.</strong>
      </Paragraph>

      <Callout variant="warning">
        <strong>ADVERTENCIA</strong>
        <br />
        Tu salario es un sedante. Es una dosis mensual de seguridad
        extremadamente adictiva. Te da la comodidad suficiente para pagar tus
        cuentas, darte algunos gustos y olvidar que, en el fondo, estás
        construyendo el castillo de otra persona. Mientras tú optimizas el
        rendimiento de sus bases de datos, ellos optimizan su patrimonio.
      </Callout>

      <Paragraph>
        La industria tech tradicional está diseñada para crear engranajes
        eficientes. Te llenan la cabeza de teoría, de LeetCode, de Clean
        Architecture, de patrones de diseño complejos que solo tienen sentido si
        eres Google, Netflix o un banco.
      </Paragraph>

      <Paragraph>
        Pero tú no eres un banco.{" "}
        <strong>Tú eres una persona que quiere libertad.</strong>
      </Paragraph>

      <Paragraph>
        Mientras tú estudias el algoritmo de ordenamiento número 47 que nunca
        vas a implementar en producción, hay desarrolladores "mediocres" (según
        el estándar académico) que están facturando $10,000 USD al mes con
        productos feos, con código spaghetti, pero que solucionan problemas
        reales de usuarios reales.
      </Paragraph>

      <Paragraph>Ellos entendieron la diferencia fundamental:</Paragraph>

      <List
        items={[
          <>
            <strong>Code for Jobs:</strong> Buscar la pureza técnica.
            Especializarse. Ser el mejor engranaje posible.
          </>,
          <>
            <strong>Code for Freedom:</strong> Buscar el pragmatismo. Shippear.
            Vender. Ser el dueño del motor.
          </>,
        ]}
      />

      <Paragraph>
        Este artículo no es para que renuncies mañana. Es para que despiertes
        hoy.
      </Paragraph>

      <Divider />

      <Heading level={2} id="stack-minimalista">
        Solo necesitas 2 cosas (el stack minimalista)
      </Heading>

      <Paragraph>
        Olvida los roadmaps académicos de "Frontend Developer 2026" que te piden
        aprender cómo funciona el motor V8 de JavaScript antes de escribir un
        "Hola Mundo".
      </Paragraph>

      <Paragraph>
        Tu objetivo no es pasar una entrevista técnica en Amazon. <br />
        <strong>Tu objetivo es SHIPPEAR.</strong>
      </Paragraph>

      <Paragraph>
        Ir de <strong>Idea → URL Pública → Primera Venta</strong> lo más rápido
        posible.
      </Paragraph>

      <Paragraph>Para eso, solo necesitas 2 cosas:</Paragraph>

      <Heading level={3} id="nextjs">
        1. Next.js (el framework completo)
      </Heading>

      <Paragraph>
        No es solo React. Es todo lo que necesitas en un solo lugar:
      </Paragraph>

      <List
        items={[
          <>Frontend y Backend en el mismo proyecto</>,
          <>Routing automático</>,
          <>SEO incorporado (crítico para distribución orgánica)</>,
          <>Deploy en Vercel con un clic</>,
        ]}
      />

      <Heading level={3} id="ia-copiloto">
        2. IA como co-piloto (Cursor o Claude Code)
      </Heading>

      <Paragraph>
        No como sustituto de tu cerebro. Como exoesqueleto que multiplica tu
        fuerza.
      </Paragraph>

      <Paragraph>
        Tú defines la arquitectura. Tú sabes qué estás construyendo. La IA
        teclea el boilerplate repetitivo.
      </Paragraph>

      <Paragraph>
        <strong>El resto son Legos que ensamblas en semanas:</strong>
      </Paragraph>

      <List
        items={[
          <>Base de datos: MongoDB + Mongoose (lo más simple)</>,
          <>Auth: NextAuth (login con Google/Email en 30 min)</>,
          <>Pagos: Stripe o LemonSqueezy</>,
          <>Emails: Resend o SendGrid</>,
        ]}
      />

      <Paragraph>
        No necesitas dominarlos todos antes de empezar. Los integras cuando los
        necesitas.
      </Paragraph>

      <Divider />

      <Heading level={2} id="filtro-de-turistas">
        El filtro de turistas (la realidad sin maquillaje)
      </Heading>

      <Paragraph>
        Antes de mostrarte el proceso, quiero ser brutalmente honesto contigo.
      </Paragraph>

      <Paragraph>
        Si has llegado aquí buscando "Ingresos Pasivos mientras duermes", o
        crees que el Software es como el Trading o las Crypto donde te prometen
        retornos mágicos sin esfuerzo, <strong>cierra esta pestaña.</strong> En
        serio. Vete.
      </Paragraph>

      <Paragraph>
        Construir tu libertad, crear un "Plan B Digital" mientras mantienes tu
        empleo full-time, es jodidamente difícil.
      </Paragraph>

      <Paragraph>Es un intercambio. Y el precio es alto:</Paragraph>

      <List
        items={[
          <>
            <strong>Sacrificio Social:</strong> Te va a tocar codear un viernes
            por la noche mientras tus amigos están en el bar o viendo Netflix.
          </>,
          <>
            <strong>Frustración Técnica:</strong> Vas a tener bugs a las 2 de la
            mañana que te harán cuestionar tu propia inteligencia y querer tirar
            la toalla.
          </>,
          <>
            <strong>Golpes al Ego:</strong> Vas a lanzar cosas que, al
            principio, absolutamente nadie va a usar. Y dolerá.
          </>,
          <>
            <strong>Aprendizaje Forzoso:</strong> Vas a tener que "ensuciarte
            las manos" aprendiendo de marketing y ventas (sí, siendo dev,
            tendrás que aprender a vender).
          </>,
        ]}
      />

      <Paragraph>
        Esta es la realidad: <strong>No hay magia.</strong> Hay trabajo
        enfocado, doloroso y constante.
      </Paragraph>

      <Paragraph>
        Pero el precio de NO hacerlo es mucho más alto: es pasar los próximos 40
        años de tu vida dependiendo de que alguien más decida seguir pagándote
        un sueldo a cambio de tus mejores horas.
      </Paragraph>

      <Callout variant="note">
        <strong>NOTA</strong>
        <br />
        <strong>Advertencia:</strong> No renuncies a tu trabajo mañana. Eso no
        es valentía, es estupidez financiera. Usa tu empleo actual como tu
        Inversionista Ángel. Que tu sueldo financie tus noches de construcción.
        Sacrifica tu tiempo libre temporalmente, para comprar tu libertad
        permanentemente.
      </Callout>

      <Divider />

      <Heading level={2} id="enemigo-moderno">
        El enemigo moderno (la trampa de los generadores AI)
      </Heading>

      <Paragraph>
        Y aquí viene el segundo filtro, uno más moderno y peligroso.
      </Paragraph>

      <Paragraph>
        Con el auge de la IA, ha surgido una nueva plaga de gurús y herramientas
        vendiendo la fantasía de "Crea tu SaaS millonario con un solo prompt".
      </Paragraph>

      <Paragraph>
        Te venden herramientas como Lovable, Bolt, v0 o constructores No-Code
        "mágicos" como la solución final. Te dicen: "¡Ya no necesitas saber
        programar! ¡Solo pídeselo a la IA!".
      </Paragraph>

      <Callout variant="danger">
        <strong>PELIGRO</strong>
        <br />
        Eso es una trampa mortal.
      </Callout>

      <Paragraph>
        Esas herramientas son increíbles para prototipos (Demos). Son geniales
        para hacer un video viral en Twitter. Pero son pésimas para construir un
        negocio de software real, robusto y escalable.
      </Paragraph>

      <Paragraph>
        ¿Por qué? Porque son <strong>Cajas Negras.</strong>
      </Paragraph>

      <Paragraph>
        Si construyes tu negocio sobre una herramienta que escribe código que tú
        no entiendes:
      </Paragraph>

      <List
        ordered
        items={[
          <>
            <strong>Imposible de debuggear:</strong> Cuando algo falle (y el
            software siempre falla), no sabrás cómo arreglarlo.
          </>,
          <>
            <strong>Techo técnico:</strong> Cuando necesites una lógica de
            negocio específica que se salga del "tutorial estándar", la
            herramienta alucinará o te bloqueará.
          </>,
          <>
            <strong>Riesgo de plataforma:</strong> No eres el dueño del
            producto. Eres un rehén de la herramienta. Si ellos suben precios o
            cierran, tu negocio desaparece.
          </>,
        ]}
      />

      <Paragraph>
        Nosotros no somos "Prompters". No somos "No-Coders" buscando atajos
        fáciles.
      </Paragraph>

      <Paragraph>
        Nosotros somos <strong>Builders.</strong>
      </Paragraph>

      <Paragraph>
        Usamos la IA (Cursor, Copilot, Claude) como un exoesqueleto. Como una
        palanca que multiplica nuestra fuerza x10. Entendemos el código.
        Dirigimos la arquitectura. Sabemos qué está pasando en el backend. Pero
        dejamos que la IA teclee el boilerplate repetitivo.
      </Paragraph>

      <Paragraph>
        Somos <strong>Ingenieros Aumentados</strong>, no usuarios pasivos.
      </Paragraph>

      <Divider />

      <Heading level={2} id="mi-historia">
        Mi historia (el journey en 4 actos)
      </Heading>

      <Paragraph>
        Yo no nací sabiendo esto. De hecho, mi camino fue el inverso al de la
        mayoría de los "Hackers". Empecé desde la necesidad, no desde la
        ingeniería.
      </Paragraph>

      <Heading level={3} id="acto-1">
        Acto 1: El mercenario (agencia WordPress)
      </Heading>

      <Paragraph>
        Hace 7 años, cuando era estudiante universitario, necesitaba dinero.
        Tenía nociones básicas de HTML/CSS del colegio, pero no era programador.
      </Paragraph>

      <Paragraph>
        ¿Qué hice? Lo pragmático: aprendí WordPress. Empecé a ofrecer servicios
        de diseño web a Pymes locales usando constructores visuales (Elementor,
        Divi). Era un Implementador No-Code.
      </Paragraph>

      <Paragraph>
        Al principio, se sentía como el éxito. "¡Soy mi propio jefe!", pensaba.
      </Paragraph>

      <Paragraph>
        Pero pronto la realidad me golpeó: si no trabajaba, no cobraba. No tenía
        un jefe, tenía 10. Cada cliente se sentía dueño de mi tiempo.
      </Paragraph>

      <Heading level={3} id="acto-2">
        Acto 2: El intermediario (afiliados + SEO)
      </Heading>

      <Paragraph>
        Mis clientes siempre me pedían lo mismo:{" "}
        <em>"Héctor, está bonita, ¿pero cómo consigo más ventas?"</em>
      </Paragraph>

      <Paragraph>
        Entendí que la web por sí sola no servía. Pivoté. Me metí de lleno en el
        SEO y Marketing Digital.
      </Paragraph>

      <Paragraph>
        Lancé mi propio Blog de Marca Personal. Empecé a posicionar keywords y a
        monetizar con Marketing de Afiliados.
      </Paragraph>

      <Paragraph>
        Llegué a generar picos de <strong>$5,000 USD al mes</strong> de forma
        semi-pasiva. El tráfico llegaba orgánicamente desde Google. La gente
        leía mis guías. Hacían clic en mis enlaces. Yo comisionaba.
      </Paragraph>

      <Heading level={3} id="acto-3">
        Acto 3: El despertar
      </Heading>

      <Paragraph>
        Hasta que me di cuenta de la fragilidad de mi imperio.
      </Paragraph>

      <Paragraph>
        Aunque ganaba dinero, seguía sin tener el control. Yo enviaba mi tráfico
        (mi activo más valioso) a los negocios de otros.
      </Paragraph>

      <Paragraph>
        Si el dueño del programa de afiliados decidía bajar las comisiones
        mañana (como hizo Amazon), mis ingresos se desplomaban. Si Google
        cambiaba el algoritmo, yo moría.
      </Paragraph>

      <Blockquote>
        "Espera... Tengo la capacidad técnica para construir cosas. Tengo la
        capacidad de atraer tráfico. ¿Por qué diablos estoy construyendo el
        castillo de otro cuando podría estar poniendo ladrillos en el mío?"
      </Blockquote>

      <Heading level={3} id="acto-4">
        Acto 4: El builder (presente)
      </Heading>

      <Paragraph>Ese fue el momento de quiebre.</Paragraph>

      <Paragraph>
        Dejé de ser un mercenario. Dejé de ser un intermediario. Decidí
        convertirme en un <strong>Propietario.</strong>
      </Paragraph>

      <Paragraph>
        Decidí aprender a construir Software Real (SaaS). Pasar del No-Code al
        Code. No por purismo académico, sino por{" "}
        <strong>Control y Equity.</strong>
      </Paragraph>

      <Paragraph>
        Y aquí estoy. No en la meta, pero en el camino correcto. Documentando
        cada paso. Y trayendo a otros conmigo.
      </Paragraph>

      <Divider />

      <Heading level={2} id="proceso-real">
        El proceso real (de idea a primera venta en 6 meses)
      </Heading>

      <Paragraph>
        Esto no es teoría. Es el blueprint exacto que estoy siguiendo y que
        puedes replicar mientras mantienes tu trabajo full-time.
      </Paragraph>

      <Heading level={3} id="fase-1">
        Fase 1: Validación y construcción de audiencia (meses 1-3)
      </Heading>

      <Paragraph>
        <strong>Objetivo:</strong> Construir audiencia mientras validas ideas.
      </Paragraph>

      <Paragraph>
        <strong>Tu framework real:</strong>
      </Paragraph>

      <List
        ordered
        items={[
          <>
            <strong>Blogging + SEO moderno</strong>
            <br />
            Escribe sobre el problema que quieres resolver. Posiciona en Google
            con long-tail keywords. Atrae tráfico orgánico de calidad.
          </>,
          <>
            <strong>RRSS escritas (LinkedIn + X/Twitter)</strong>
            <br />
            Documenta tu journey públicamente. Comparte insights, fracasos,
            aprendizajes. Construye confianza y autoridad.
          </>,
          <>
            <strong>Newsletter como hub central</strong>
            <br />
            Captura emails de tu blog y RRSS. Nutre la relación semanalmente.
            Esta es tu audiencia para el beta launch.
          </>,
          <>
            <strong>Monetización del runway (mientras construyes)</strong>
            <br />
            Afiliación (herramientas que usas), freelance selectivo, y
            sponsorships si tu newsletter crece.
          </>,
        ]}
      />

      <Paragraph>
        <strong>Meta mínima:</strong> 200-300 suscriptores en newsletter en 90
        días. Si no llegas, necesitas crear más contenido de valor o mejorar
        distribución.
      </Paragraph>

      <Heading level={3} id="fase-2">
        Fase 2: MVP funcional (meses 2-4)
      </Heading>

      <Paragraph>
        <strong>Objetivo:</strong> Construir la feature mínima que resuelve el
        core del problema.
      </Paragraph>

      <Paragraph>
        <strong>El stack minimalista:</strong> Next.js, TailwindCSS + DaisyUI,
        MongoDB + Mongoose, NextAuth, Stripe, IA (Cursor) para boilerplate.
      </Paragraph>

      <Paragraph>
        <strong>NO construyas:</strong> dashboard complejo, notificaciones,
        integraciones con 15 APIs, features "nice to have".
      </Paragraph>

      <Paragraph>
        <strong>SÍ construye:</strong> la feature core, un formulario de input,
        un botón que hace la magia, y un resultado descargable/visible.
      </Paragraph>

      <Heading level={3} id="fase-3">
        Fase 3: Distribución (paralelo a construcción)
      </Heading>

      <Paragraph>
        <strong>Objetivo:</strong> Que tu audiencia crezca orgánicamente
        mientras construyes.
      </Paragraph>

      <Paragraph>
        <strong>Los 3 pilares de distribución:</strong>
      </Paragraph>

      <List
        ordered
        items={[
          <>
            <strong>Blogging + SEO</strong>
            <br />
            1-2 artículos profundos al mes, long-tail keywords, CTAs a tu
            newsletter.
          </>,
          <>
            <strong>RRSS escritas (LinkedIn + X)</strong>
            <br />
            Documenta tu construcción en público. Comparte screenshots,
            métricas, fracasos. Threads semanales. No vendas: aporta valor.
          </>,
          <>
            <strong>Herramientas gratuitas (opcional)</strong>
            <br />
            Mini-tools (calculadora/generador/auditor) que atraen tráfico y
            redirigen a tu newsletter/producto.
          </>,
        ]}
      />

      <Paragraph>
        <strong>NO uses ads.</strong> Los anuncios son para escalar productos
        validados, no para validar ideas.
      </Paragraph>

      <Heading level={3} id="fase-4">
        Fase 4: Beta launch y primeras ventas (meses 4-6)
      </Heading>

      <Paragraph>
        <strong>Objetivo:</strong> Conseguir tus primeros 10-20 usuarios beta
        pagando.
      </Paragraph>

      <Paragraph>
        <strong>Pricing estratégico:</strong> cobra desde el día 1 (aunque sea
        $9-19/mes). Ofrece lifetime deal a primeros 50 beta testers: $99
        one-time.
      </Paragraph>

      <Paragraph>
        <strong>Canales de lanzamiento (en orden):</strong> tu newsletter, RRSS,
        tu blog, comunidades de nicho.
      </Paragraph>

      <Divider />

      <Heading level={2} id="la-encrucijada">
        La encrucijada (tu decisión)
      </Heading>

      <Paragraph>
        Hemos llegado al final. Ahora tienes dos caminos frente a ti:
      </Paragraph>

      <Heading level={3} id="opcion-1">
        Opción 1: El camino del "lector pasivo"
      </Heading>

      <Paragraph>
        Cierras esta pestaña. Vuelves a tu trabajo mañana. Sigues estudiando
        tutoriales que no implementas.
      </Paragraph>

      <Paragraph>
        <strong>Resultado:</strong> En 12 meses estarás en el mismo lugar, pero
        un año más viejo y con más arrepentimiento.
      </Paragraph>

      <Heading level={3} id="opcion-2">
        Opción 2: El camino del "builder"
      </Heading>

      <Paragraph>
        Decides que ya fue suficiente teoría. Decides que vas a construir tus
        propios activos.
      </Paragraph>

      <Divider />

      <Heading level={2} id="unete-al-circulo">
        Únete al círculo de builders
      </Heading>

      <Paragraph>
        Si eliges el camino 2, no quiero venderte nada. Quiero invitarte a mi
        <strong> Círculo Privado.</strong>
      </Paragraph>

      <Paragraph>
        Piénsalo como el "Anti-Curso". Mientras otros te cobran por contenido
        desactualizado, yo te abro la cocina de mi negocio en tiempo real.
      </Paragraph>

      <Heading level={3} id="lo-que-recibes">
        Lo que recibes (gratis)
      </Heading>

      <List
        items={[
          <>
            ✅ <strong>Emails semanales de construcción en vivo</strong> — No
            teoría. Decisiones reales mientras construyo mi SaaS.
          </>,
          <>
            ✅ <strong>SEO de producto (no SEO de blog)</strong> — Cómo hacer
            que Google te traiga usuarios, no solo lectores.
          </>,
          <>
            ✅ <strong>El stack minimalista explicado</strong> — Next.js + IA.
            Sin bullshit de “aprende 47 tecnologías primero”.
          </>,
          <>
            ✅ <strong>Mentalidad de builder vs empleado</strong> — Decisiones
            de producto y negocio.
          </>,
          <>
            ✅ <strong>Comunidad de builders reales</strong> — Gente shippeando,
            no solo teorizando.
          </>,
          <>
            ✅ <strong>BONUS:</strong> Acceso prioritario a mi comunidad de
            coaching cuando lance.
          </>,
        ]}
      />

      <Heading level={3} id="costo">
        ¿El costo?
      </Heading>

      <Paragraph>
        <strong>$0.</strong>
      </Paragraph>

      <Heading level={3} id="por-que-gratis">
        ¿Por qué lo hago gratis?
      </Heading>

      <Paragraph>
        Porque juego a largo plazo. Quiero construir una reputación obsesiva por
        aportar valor. Si te ayudo a shippear tu primer producto, sé que
        confiarás en mí para siempre.
      </Paragraph>

      <Paragraph>
        Cuando lance mi coaching/comunidad de pago, quiero que sea una decisión
        obvia para ti porque ya viste el valor que entrego.
      </Paragraph>

      <Heading level={3} id="tu-garantia">
        Tu garantía
      </Heading>

      <Paragraph>Entra, lee el primer email, mira el primer insight.</Paragraph>

      <Paragraph>
        Si no sientes que aprendes más aquí que en un máster de $2,000, te vas
        con un clic.
      </Paragraph>

      <Paragraph>
        <strong>
          No tienes nada que perder y una carrera de libertad que ganar.
        </strong>
      </Paragraph>

      <Heading level={3} id="unete-ahora">
        Únete ahora
      </Heading>

      <Paragraph>
        El formulario para unirte al Círculo está justo debajo.
      </Paragraph>

      <Paragraph>
        <em>
          Lives en vivo · Insights de construcción · SEO práctico · $0 de
          inversión
        </em>
      </Paragraph>

      <Paragraph>
        Nos vemos del otro lado,
        <br />
        <strong>Héctor Labra</strong>
      </Paragraph>

      <Paragraph>
        P.S. — Si estás dudando, pregúntate esto: ¿Dónde estarás en 12 meses si
        no haces nada diferente hoy? ¿Seguirás optimizando las bases de datos de
        otro? ¿O estarás optimizando tu libertad?
      </Paragraph>
    </>
  );
}
