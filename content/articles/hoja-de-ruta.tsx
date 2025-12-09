import {
  Paragraph,
  Heading,
  List,
  Blockquote,
  Callout,
} from "@/components/content";

// Metadata exportada para uso en el layout
export const metadata = {
  title: "Cómo construir tu propio SaaS (sin renunciar a tu trabajo)",
  description:
    "La hoja de ruta realista para pasar de Dev Junior a Indie Founder. Sin falsas promesas, solo código, shipping y constancia.",
  date: "2025-12-09",
  slug: "hoja-de-ruta",
};

// Componente de separador visual
function Divider() {
  return <hr className="border-white/10 my-16" />;
}

// El contenido principal del artículo
export default function HojaDeRutaContent() {
  return (
    <>
      {/* INTRODUCCIÓN */}
      <Heading level={2} id="la-verdad-incomoda">
        La Verdad Incómoda sobre tu Carrera
      </Heading>

      <Paragraph>
        Hay una mentira cómoda que nos repetimos todos los que trabajamos en
        tecnología:{" "}
        <strong>
          "Si aprendo ese nuevo framework, si saco esa certificación de AWS, si
          domino la última arquitectura de moda... entonces seré libre."
        </strong>
      </Paragraph>

      <Paragraph>
        Es una mentira porque confunde <strong>Capacidad Técnica</strong> con{" "}
        <strong>Libertad Financiera</strong>.
      </Paragraph>

      <Paragraph>
        Si aprendes más frameworks, te convertirás en un{" "}
        <strong>mejor empleado</strong>. Te subirán el sueldo, sí. Te darán un
        título más "Senior", probablemente. Te sentirás importante en las
        reuniones de arquitectura. Pero tu libertad, tu tiempo y tu futuro
        seguirán dependiendo de una sola variable que tú no controlas:{" "}
        <strong>La decisión de tu empleador.</strong>
      </Paragraph>

      <Callout variant="warning">
        <strong>Tu salario es un sedante.</strong> Es una dosis mensual de
        seguridad extremadamente adictiva. Te da la comodidad suficiente para
        pagar tus cuentas, darte algunos gustos y olvidar que, en el fondo,
        estás construyendo el castillo de otra persona. Mientras tú optimizas el
        rendimiento de sus bases de datos, ellos optimizan su patrimonio.
      </Callout>

      <Paragraph>
        La industria tech tradicional está diseñada para crear engranajes
        eficientes. Te llenan la cabeza de teoría, de LeetCode, de Clean
        Architecture, de patrones de diseño complejos que solo tienen sentido si
        eres Google, Netflix o un banco.
      </Paragraph>

      <Paragraph>
        Pero tú no eres un banco. Tú eres una persona que quiere libertad.
      </Paragraph>

      <Paragraph>
        Mientras tú estudias el algoritmo de ordenamiento número 47 que nunca
        vas a implementar en producción, hay desarrolladores "mediocres" (según
        el estándar académico) que están facturando{" "}
        <strong>$10,000 USD al mes</strong> con productos feos, con código
        spaghetti, pero que{" "}
        <strong>solucionan problemas reales de usuarios reales.</strong>
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

      {/* PARTE 1: LA REALIDAD */}
      <Heading level={2} id="la-realidad">
        Parte 1: La Realidad (El Filtro de Turistas)
      </Heading>

      <Paragraph>
        Antes de mostrarte el mapa, quiero ser brutalmente honesto contigo. Si
        has llegado aquí buscando "Ingresos Pasivos mientras duermes", o crees
        que el Software es como el Trading o las Crypto donde te prometen
        retornos mágicos sin esfuerzo, cierra esta pestaña. En serio. Vete.
      </Paragraph>

      <Paragraph>
        Construir tu libertad, crear un "Plan B Digital" mientras mantienes tu
        empleo full-time, <strong>es jodidamente difícil.</strong>
      </Paragraph>

      <Paragraph>Es un intercambio. Y el precio es alto:</Paragraph>

      <List
        ordered
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
        <strong>Esta es la realidad:</strong> No hay magia. Hay trabajo
        enfocado, doloroso y constante. Pero el precio de <strong>NO</strong>{" "}
        hacerlo es mucho más alto: es pasar los próximos 40 años de tu vida
        dependiendo de que alguien más decida seguir pagándote un sueldo a
        cambio de tus mejores horas.
      </Paragraph>

      <Callout variant="note">
        <strong>Advertencia:</strong> No renuncies a tu trabajo mañana. Eso no
        es valentía, es estupidez financiera. Usa tu empleo actual como tu{" "}
        <strong>Inversionista Ángel</strong>. Que tu sueldo financie tus noches
        de construcción. Sacrifica tu tiempo libre temporalmente, para comprar
        tu libertad permanentemente.
      </Callout>

      <Divider />

      {/* PARTE 2: EL ENEMIGO MODERNO */}
      <Heading level={2} id="el-enemigo-moderno">
        Parte 2: El Enemigo Moderno (La Trampa de los Generadores AI)
      </Heading>

      <Paragraph>
        Y aquí viene el segundo filtro, uno más moderno y peligroso. Con el auge
        de la IA, ha surgido una nueva plaga de gurus y herramientas vendiendo
        la fantasía de{" "}
        <strong>"Crea tu SaaS millonario con un solo prompt"</strong>.
      </Paragraph>

      <Paragraph>
        Te venden herramientas como <strong>Lovable, Bolt, v0</strong> o
        constructores No-Code "mágicos" como la solución final. Te dicen:{" "}
        <em>"¡Ya no necesitas saber programar! ¡Solo pídeselo a la IA!"</em>.
      </Paragraph>

      <Callout variant="danger">
        <strong>Eso es una trampa mortal.</strong>
      </Callout>

      <Paragraph>
        Esas herramientas son increíbles para prototipos (Demos). Son geniales
        para hacer un video viral en Twitter. Pero son <strong>pésimas</strong>{" "}
        para construir un negocio de software real, robusto y escalable.
      </Paragraph>

      <Paragraph>
        ¿Por qué? Porque son <strong>Cajas Negras</strong>. Si construyes tu
        negocio sobre una herramienta que escribe código que tú no entiendes:
      </Paragraph>

      <List
        items={[
          <>
            <strong>Imposible de Debuggear:</strong> Cuando algo falle (y el
            software <em>siempre</em> falla), no sabrás cómo arreglarlo. La IA
            no podrá "razonar" sobre un bug de arquitectura compleja de la misma
            forma que tú.
          </>,
          <>
            <strong>Techo Técnico:</strong> Cuando necesites una lógica de
            negocio específica que se salga del "tutorial estándar", la
            herramienta alucinará o te bloqueará.
          </>,
          <>
            <strong>Riesgo de Plataforma:</strong> No eres el dueño del
            producto. Eres un rehén de la herramienta. Si ellos suben precios o
            cierran, tu negocio desaparece.
          </>,
        ]}
      />

      <Paragraph>
        Nosotros no somos "Prompters". No somos "No-Coders" buscando atajos
        fáciles. <strong>Nosotros somos Builders.</strong>
      </Paragraph>

      <Paragraph>
        Usamos la IA (Cursor, Copilot, Claude) como un{" "}
        <strong>exoesqueleto</strong>. Como una palanca que multiplica nuestra
        fuerza x10. Entendemos el código. Dirigimos la arquitectura. Sabemos qué
        está pasando en el backend. Pero dejamos que la IA teclee el boilerplate
        repetitivo. Somos Ingenieros Aumentados, no usuarios pasivos.
      </Paragraph>

      <Divider />

      {/* PARTE 3: MI HISTORIA */}
      <Heading level={2} id="mi-historia">
        Parte 3: Mi Historia (De No-Code a Real Code)
      </Heading>

      <Paragraph>
        Yo no nací sabiendo esto. De hecho, mi camino fue el inverso al de la
        mayoría de los "Hackers". Empecé desde la necesidad, no desde la
        ingeniería.
      </Paragraph>

      <Paragraph>
        Hace 7 años, cuando era estudiante universitario, necesitaba dinero.
        Tenía nociones básicas de HTML/CSS del colegio, pero no era programador.
        ¿Qué hice? Lo pragmático: <strong>Aprendí WordPress.</strong>
      </Paragraph>

      <Paragraph>
        Empecé a ofrecer servicios de diseño web a Pymes locales. Usaba
        constructores visuales (Elementor, Divi), plantillas y plugins. Era un{" "}
        <strong>Implementador No-Code</strong>.
      </Paragraph>

      <Paragraph>
        Al principio, se sentía como el éxito. <em>"¡Soy mi propio jefe!"</em>,
        pensaba. <em>"¡Tengo mi agencia!"</em>. Pero pronto la realidad me
        golpeó. La trampa de los servicios es cruel:
      </Paragraph>

      <List
        ordered
        items={[
          <>
            <strong>Si no trabajaba, no cobraba.</strong> Si me enfermaba dos
            semanas, mis ingresos eran cero.
          </>,
          <>
            <strong>No tenía un jefe, tenía 10.</strong> Cada cliente se sentía
            dueño de mi tiempo. Eran más exigentes y pagaban peor que un
            empleador corporativo.
          </>,
        ]}
      />

      <Paragraph>
        Además, mis clientes siempre me pedían lo mismo al entregar la web:{" "}
        <em>"Héctor, está bonita, ¿pero cómo consigo más ventas?"</em>. Entendí
        que la web por sí sola no servía. Así que pivoté. Me metí de lleno en el{" "}
        <strong>SEO y Marketing Digital.</strong>
      </Paragraph>

      <Paragraph>
        Para probar mis habilidades (y huir de los clientes), lancé mi propio{" "}
        <strong>Blog de Marca Personal</strong>. Empecé a escribir, a posicionar
        keywords y a monetizar con <strong>Marketing de Afiliados</strong>.
        Recomendaba hostings, herramientas de email marketing, software de
        terceros.
      </Paragraph>

      <Paragraph>
        ¡Esto sí era mejor! Llegué a generar picos de{" "}
        <strong>$5,000 USD al mes</strong> de forma semi-pasiva. El tráfico
        llegaba orgánicamente desde Google. La gente leía mis guías. Hacían clic
        en mis enlaces. Yo comisionaba. Dormía y ganaba dinero. Parecía que
        había hackeado el sistema.
      </Paragraph>

      <Paragraph>
        Hasta que me di cuenta de la fragilidad de mi imperio. Aunque ganaba
        dinero, <strong>seguía sin tener el control.</strong> Yo enviaba mi
        tráfico (mi activo más valioso, mi oro) a los negocios de otros. Estaba
        construyendo la base de clientes de otras empresas. Si el dueño del
        programa de afiliados decidía bajar las comisiones mañana (como hizo
        Amazon), mis ingresos se desplomaban. Si Google cambiaba el algoritmo,
        yo moría.
      </Paragraph>

      <Blockquote>
        "Espera... Tengo la capacidad técnica para construir cosas (ya no soy
        solo un implementador). Tengo la capacidad de atraer tráfico (sé SEO).
        ¿Por qué diablos estoy construyendo el castillo de otro cuando podría
        estar poniendo ladrillos en el mío?"
      </Blockquote>

      <Paragraph>
        Ese fue el momento de quiebre. Decidí dar el salto final. Dejé de ser un
        mercenario (Agencia). Dejé de ser un intermediario (Afiliado). Decidí
        convertirme en un <strong>Propietario.</strong> Decidí aprender a
        construir <strong>Software Real (SaaS)</strong>. Pasar del No-Code al
        Code. No por purismo académico, sino por{" "}
        <strong>Control y Equity.</strong>
      </Paragraph>

      <Divider />

      {/* PARTE 4: EL STACK */}
      <Heading level={2} id="el-stack">
        Parte 4: El Stack del Builder (Tu Roadmap de Guerra)
      </Heading>

      <Paragraph>
        Olvida los roadmaps académicos de "Frontend Developer 2026" que te piden
        aprender cómo funciona el motor V8 de JavaScript antes de escribir un
        "Hola Mundo". Tu objetivo no es pasar una entrevista técnica en Amazon.
        Tu objetivo es <strong>SHIPPEAR</strong>. Ir de Idea {"->"} URL Pública{" "}
        {"->"}
        Primera Venta lo más rápido posible.
      </Paragraph>

      <Paragraph>
        Para eso, necesitamos un arsenal que priorice la{" "}
        <strong>Velocidad</strong> sobre la Pureza. Este es el stack que usamos
        hoy los Indie Hackers:
      </Paragraph>

      <Heading level={3} id="frontend">
        1. El Frontend (La Cara del Producto)
      </Heading>
      <Paragraph>
        No reinventamos la rueda. Usamos lo que funciona y abunda.
      </Paragraph>
      <List
        items={[
          <>
            <strong>Next.js:</strong> No es solo React. Es el framework
            completo. Nos da el Routing, el SEO (crítico para nosotros) y la
            capacidad de ejecutar código de servidor en un solo lugar.
          </>,
          <>
            <strong>TailwindCSS:</strong> Muchos puristas lo odian porque
            "ensucia el HTML". Nosotros lo amamos porque nos permite diseñar a
            la velocidad del pensamiento. Sin archivos CSS separados, sin
            nombres de clases inventados. Estilo en línea, rápido y mantenible.
          </>,
          <>
            <strong>DaisyUI:</strong> Olvida diseñar botones desde cero. DaisyUI
            te da componentes semánticos y bellos basados en Tailwind. Copias,
            pegas, personalizas y lanzas.
          </>,
        ]}
      />

      <Heading level={3} id="backend">
        2. El Backend & Datos (El Cerebro)
      </Heading>
      <Paragraph>
        Aquí es donde la mayoría se paraliza con Docker, Kubernetes y
        Microservicios. <strong>Olvida eso.</strong> Nosotros usamos
        Backend-as-a-Service (BaaS) o soluciones gestionadas.
      </Paragraph>
      <List
        items={[
          <>
            <strong>Base de Datos:</strong> <strong>Supabase</strong>{" "}
            (PostgreSQL) o <strong>MongoDB</strong> (con Mongoose). Ambas son
            excelentes. Supabase te da base de datos, auth y storage en un solo
            paquete. MongoDB te da una flexibilidad increíble si vienes de JS.
          </>,
          <>
            <strong>Autenticación:</strong> <strong>Clerk</strong> o{" "}
            <strong>NextAuth (Auth.js)</strong>. La gestión de usuarios (Login,
            Reset Password, Google Sign-in) es difícil y arriesgada de hacer
            desde cero. Estas herramientas lo resuelven en 15 minutos.
          </>,
          <>
            <strong>Pagos:</strong> <strong>Stripe</strong> o{" "}
            <strong>LemonSqueezy</strong>. Si no puedes cobrar, no tienes un
            negocio, tienes una ONG. LemonSqueezy es genial porque actúa como
            "Merchant of Record" y te quita el dolor de cabeza de los impuestos
            globales.
          </>,
        ]}
      />

      <Heading level={3} id="ia-leverage">
        3. IA como Palanca (Tu Equipo Virtual)
      </Heading>
      <Paragraph>
        Aquí está la verdadera revolución. No se trata de versiones ni modelos
        específicos. Se trata de usar <strong>Cursor o Claude Code</strong>.
      </Paragraph>
      <Paragraph>
        Son herramientas que entienden tu base de código completa. Puedes
        decirles "refactoriza este módulo", "añade manejo de errores",
        "explícame qué hace este legacy code". Usándolos, te conviertes en el{" "}
        <strong>Arquitecto</strong>. Ya no escribes cada línea de boilerplate.
        Tú defines la estructura, la lógica de negocio y los modelos de datos.
        La IA teclea la implementación. Tú revisas y ajustas.
      </Paragraph>
      <Paragraph>
        Esto reduce la curva de aprendizaje y construcción de meses a semanas.
        Lo que antes necesitaba un equipo de 3 (Frontend, Backend, DevOps), hoy
        lo hace <strong>un solo Builder empoderado.</strong>
      </Paragraph>

      <Heading level={3} id="distribucion">
        4. Distribución (SEO de Producto)
      </Heading>
      <Paragraph>
        El código sin usuarios es un hobby caro en un servidor de Vercel. La
        mayoría de los devs construyen cosas increíbles y luego intentan
        "spammearlas" en Twitter o Reddit, solo para ser ignorados o baneados.
        Nosotros no. Nosotros construimos con la distribución en mente desde el
        día 1.
      </Paragraph>
      <List
        items={[
          <>
            <strong>No usamos Ads al principio:</strong> Los anuncios son
            gasolina para el fuego. Si no tienes fuego (un producto que
            convierte), la gasolina solo te quema el dinero. Los Ads son para
            escalar, no para validar.
          </>,
          <>
            <strong>Ingeniería como Marketing:</strong> Creamos "Side Projects"
            o herramientas gratuitas. Una calculadora, un generador de PDFs, un
            auditor simple. Herramientas que resuelven un problema pequeño,
            atraen tráfico orgánico gratis, y luego redirigen a tu SaaS
            principal.
          </>,
          <>
            <strong>SEO Programático:</strong> Usamos nuestros datos para
            generar miles de landing pages dinámicas que atacan búsquedas
            específicas (Long-tail).
          </>,
        ]}
      />

      <Divider />

      {/* CONCLUSIÓN: CTA */}
      <Heading level={2} id="conclusion-encrucijada">
        Conclusión: Tu Encrucijada
      </Heading>

      <Paragraph>
        Hemos llegado al final. Ahora tienes dos caminos frente a ti:
      </Paragraph>

      <Paragraph>
        <strong>Opción 1: El Camino del "Lector Pasivo"</strong>
        <br />
        Cierras esta pestaña. Vuelves a tu trabajo mañana. Sigues estudiando
        tutoriales que no implementas.
        <br />
        <em>Resultado:</em> En 12 meses estarás en el mismo lugar, pero un año
        más viejo y con más arrepentimiento.
      </Paragraph>

      <Paragraph>
        <strong>Opción 2: El Camino del "Builder"</strong>
        <br />
        Decides que ya fue suficiente teoría. Decides que vas a construir tus
        propios activos.
      </Paragraph>

      <Paragraph>
        Si eliges el camino 2, no quiero venderte nada. Quiero invitarte a mi{" "}
        <strong>Círculo Privado</strong>.
      </Paragraph>

      <Paragraph>
        Piénsalo como el <strong>"Anti-Curso"</strong>. Mientras otros te cobran
        por contenido desactualizado, yo te abro la cocina de mi negocio en
        tiempo real.
      </Paragraph>

      <Callout variant="tip">
        <strong>LO QUE RECIBES (El Stack):</strong>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            🏗️ <strong>Construcción Real (Insights):</strong> Verás cómo se
            construye un negocio desde cero. Sin filtros. Mis decisiones, mis
            errores y mis aciertos.
          </li>
          <li>
            🔍 <strong>SEO de Trinchera:</strong> Estrategias de posicionamiento
            que funcionan HOY, no teoría de hace 5 años.
          </li>
          <li>
            🚀 <strong>Shipping Real:</strong> Cómo llevamos proyectos de{" "}
            <code>localhost</code> a ventas. Tácticas de lanzamiento y
            monetización.
          </li>
          <li>
            🎥 <strong>Acceso a Lives Privados Semanales:</strong> (Esto vale
            oro). Nos conectamos cada semana. Respondo tus dudas, revisamos tu
            código o tu estrategia en directo.
          </li>
        </ul>
      </Callout>

      <Paragraph>
        <strong>¿El Costo?</strong>
        <br />
        $0.
      </Paragraph>

      <Paragraph>
        <strong>¿Por qué lo hago gratis?</strong>
        <br />
        Porque juego a largo plazo. Quiero construir una reputación obsesiva por
        aportar valor. Si te ayudo a ganar tu primer dólar online, sé que
        confiarás en mí para siempre.
      </Paragraph>

      <Paragraph>
        <strong>TU GARANTÍA:</strong>
        <br />
        Entra, mira el primer Live o lee el primer correo. Si no sientes que
        aprendes más aquí que en un máster de $2,000, te vas con un clic. No
        tienes nada que perder y una carrera de libertad que ganar.
      </Paragraph>

      <Paragraph>Dale clic al botón. Nos vemos en el próximo Live.</Paragraph>

      {/* Aquí abajo iría el componente de NewsletterForm que ya tienes en el layout, o si quieres insertarlo explícitamente */}
    </>
  );
}
