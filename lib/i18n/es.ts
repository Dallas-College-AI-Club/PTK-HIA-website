import type { Messages } from "./en";

/**
 * Spanish text. MOCK DRAFT: machine-written to test the language setup.
 * It has NOT been checked yet. Alex validates Spanish (AGENTS.md) before
 * this goes live. Keep the same keys as en.ts: the type below makes the
 * build fail if a line is missing or extra.
 */
export const es: Messages = {
   brand: {
      name: "PTK × AI Club",
      college: "Dallas College",
   },
   pages: {
      home: "Inicio",
      learnEnglish: "Aprender inglés",
      startCollege: "Empezar la universidad",
      payForCollege: "Pagar la universidad",
      talkToSomeone: "Hablar con alguien",
      askQuestion: "Hacer una pregunta",
   },
   layout: {
      backHome: "Inicio",
      stillHaveQuestion: "¿Todavía tiene una pregunta?",
      stillHaveQuestionBody: "Pregunte en su idioma. Las respuestas vienen de recursos reunidos por PTK.",
      askInYourLanguage: "Pregunte en su idioma",
      footerPoweredBy: "Con el apoyo de PTK y AI Club de Dallas College",
      footerInstagram: "Instagram",
      footerPrivacy: "Privacidad",
      comingSoon: "Próximamente",
      opensNewTab: "(se abre en una pestaña nueva)",
      footerNotOfficial: "No es un sitio web oficial de Dallas College.",
      mainNavLabel: "Principal",
      quickActionsLabel: "Acciones rápidas",
      footerNavLabel: "Pie de página",
   },
   language: {
      label: "Idioma",
      chooseTitle: "Elija su idioma",
   },
   startCollege: {
      intro: "Usted solicita la admisión y se inscribe en clases en el sitio web de Dallas College.",
      registrationLink: "Ir a la inscripción de Dallas College",
      englishNote: "El sitio web de Dallas College está en inglés. ¿Necesita ayuda con los pasos?",
   },
   financialAid: {
      intro: "Formas de obtener ayuda para pagar sus estudios.",
      sections: {
         aid: {
            title: "Ayuda financiera",
            body: "Dinero del gobierno para ayudarle a pagar las clases. Solicítela cada año.",
         },
         busPass: {
            title: "Pase de autobús gratis para estudiantes",
            body: "Viaje gratis en los autobuses y trenes de DART mientras toma clases.",
         },
         scholarships: {
            title: "Becas",
            body: "Dinero para sus estudios que no tiene que devolver.",
         },
      },
      links: {
         aidOverview: { label: "Cómo funciona la ayuda financiera" },
         fafsa: {
            label: "Solicite con la FAFSA",
            hint: "Para ciudadanos de EE. UU., residentes permanentes y refugiados",
         },
         tasfa: { label: "Solicite con la TASFA", hint: "Para estudiantes de Texas que no pueden usar la FAFSA" },
         keepAid: { label: "Mantenga su ayuda financiera" },
         goPass: { label: "Obtenga su DART GoPass" },
         scholarships: { label: "Buscar becas", hint: "Una sola solicitud para muchas becas" },
         dreamers: { label: "Ayuda para estudiantes Dreamers y DACA" },
      },
      englishNote: "El sitio web de Dallas College está en inglés. ¿Necesita ayuda?",
   },
   getConnected: {
      title: "Hablar con alguien",
      intro: "Deje sus datos de contacto y una persona de Dallas College se comunicará con usted.",
      privacyNote: "Nunca le preguntaremos sobre su estatus migratorio.",
      fields: {
         fullName: "Nombre completo",
         email: "Correo electrónico",
         phone: "Teléfono",
         contactHint: "Denos un correo electrónico o un número de teléfono (o ambos).",
         preferredLanguage: "Idioma preferido",
         situation: "¿Qué lo describe mejor?",
         helpWith: "¿Con qué necesita ayuda?",
         notes: "¿Algo más que debamos saber? (opcional)",
         choose: "Elija una opción",
      },
      situations: {
         highSchoolSenior: "Estudiante de último año de preparatoria",
         currentStudent: "Estudiante actual de Dallas College",
         parent: "Padre o madre",
         refugee: "Refugiado / recién llegado a EE. UU.",
         eslLearner: "Estudiante de inglés (ESL)",
         other: "Otro",
      },
      helpTopics: {
         admissions: "Admisiones",
         esl: "Clases de inglés (ESL)",
         financialAid: "Ayuda financiera / matrícula",
         childcare: "Cuidado de niños",
         transportation: "Transporte",
         counseling: "Consejería",
         other: "Otro",
      },
      errors: {
         fullNameRequired: "Escriba su nombre, por favor.",
         contactRequired: "Denos un correo electrónico o un número de teléfono, por favor.",
         emailInvalid: "Este correo no parece completo. Revise que tenga una @ y un punto.",
         choose: "Elija una opción, por favor.",
         generic: "Algo salió mal de nuestro lado. Inténtelo de nuevo.",
      },
      submit: "Enviar mi solicitud",
      sending: "Enviando…",
      thankYouTitle: "¡Gracias!",
      thankYouBody: "Alguien de Dallas College se comunicará con usted pronto.",
      ptkContact: {
         title: "Contactar a PTK",
         body: "¿Tiene una pregunta para los estudiantes de PTK que hicieron este sitio? Envíenos un correo.",
         emailButton: "Escribir a PTK",
      },
      peerMentor: {
         title: "Mentores estudiantiles",
         body: "Hable con un estudiante que ha pasado por lo mismo que usted.",
      },
   },
   // MOCK DRAFT, same as the rest of this file: Alex still needs to check it.
   esl: {
      title: "Aprender inglés",
      description: "Programas de noche y fin de semana, pasos para inscribirse y ubicaciones.",
      intro: "Clases de noche y de fin de semana, cómo inscribirse y adónde ir.",
      sections: {
         nightsWeekends: {
            title: "Programas de noche y fin de semana",
            body: "Clases de noche y de sábado para adultos que trabajan.",
         },
         registration: {
            title: "Pasos para inscribirse",
            body: "Los pasos para inscribirse en clases y pagarlas.",
         },
         locations: {
            title: "Ubicaciones",
            body: "Encuentre campus y centros cerca de usted.",
         },
      },
      links: {
         nightsWeekends: { label: "Ver los programas de noche y fin de semana" },
         registration: { label: "Ver los pasos para inscribirse" },
         locations: { label: "Ver todas las ubicaciones" },
      },
      englishNote: "El sitio web de Dallas College está en inglés. ¿Necesita ayuda?",
   },
   home: {
      welcome: "Bienvenido",
      howCanWeHelp: "¿Cómo podemos ayudarle?",
      askLabel: "Haga una pregunta en su idioma",
      askPlaceholder: "Escriba su pregunta",
      askButton: "Preguntar",
      popular: "Populares:",
      popularQuestions: [
         { label: "Clases de inglés de noche", question: "¿Cómo me inscribo en las clases de inglés de noche?" },
         { label: "Becas", question: "¿Qué becas puedo solicitar?" },
         { label: "Pase de autobús gratis", question: "¿Cómo obtengo el pase de autobús gratis para estudiantes?" },
      ],
      aiNotice:
         "Las respuestas vienen de recursos reunidos por PTK. Confirme siempre los detalles importantes con Dallas College.",
      illustrationAlt: "Globos de diálogo que dicen hola en inglés, español, árabe, birmano y suajili",
      whatDoYouNeed: "¿Qué necesita?",
      cards: {
         learnEnglish: { title: "Aprender inglés (ESL)", description: "Clases de inglés de noche y los fines de semana" },
         startCollege: { title: "Empezar la universidad", description: "Pasos desde la solicitud hasta su primera clase" },
         payForCollege: { title: "Pagar la universidad", description: "Ayuda financiera, becas y planes de pago" },
         talkToSomeone: { title: "Hablar con alguien", description: "Una persona real le ayudará" },
      },
      moreHelp: "Más ayuda",
      moreHelpItems: {
         childcare: { label: "Cuidado de niños", question: "¿Qué ayuda hay para el cuidado de niños de los estudiantes?" },
         busPass: { label: "Pase de autobús", question: "¿Cómo obtengo el pase de autobús gratis para estudiantes?" },
         counseling: { label: "Consejería", question: "¿Cómo hago una cita de consejería?" },
      },
   },
   privacy: {
      title: "Privacidad",
      description: "Cómo este sitio protege su privacidad: qué pedimos, qué nunca pedimos y adónde va su información.",
      intro: [
         "Muchas personas que usan este sitio están aprendiendo inglés, son nuevas en EE. UU. o crían a su familia mientras estudian. Usted debe poder recibir ayuda sin renunciar a su privacidad.",
         "Por eso hicimos este sitio para pedir lo menos posible y decirle claramente qué pasa con lo que comparte.",
      ],
      sections: [
         {
            title: "Nuestro enfoque sobre la privacidad",
            items: [
               "Solo pedimos lo que necesitamos para ayudarle.",
               "Nunca le preguntamos su estado migratorio.",
               "Usted decide qué compartir. Cada formulario y pregunta de este sitio es opcional.",
               "No mostramos anuncios, no usamos herramientas de rastreo y nunca vendemos su información.",
            ],
         },
         {
            title: "Si usa Hablar con alguien",
            items: [
               "El formulario pide su nombre, un correo o teléfono, su idioma preferido, qué le describe, con qué necesita ayuda y cualquier nota que quiera agregar.",
               "Se envía por correo al equipo de PTK y a los Success Coaches de Dallas College, para que una persona real le contacte. Solo se usa para ayudarle.",
            ],
         },
         {
            title: "Si usa el chatbot",
            items: [
               "Para escribir una respuesta, sus preguntas se envían a un servicio de IA (a través de OpenRouter). Por favor, no escriba datos privados, como su número de estudiante o su dirección.",
               "Si respondió las preguntas de “¿No sabe por dónde empezar?”, esas respuestas también se envían, para que la respuesta sea más útil para usted.",
               "No guardamos su conversación. Desaparece al cerrar la página. El servicio de IA puede guardar los mensajes según sus propias reglas.",
            ],
         },
         {
            title: "Otros sitios web",
            items: [
               "Este es un proyecto estudiantil de Phi Theta Kappa (PTK) y el AI Club de Dallas College. No es un sitio web oficial de Dallas College.",
               "Cuando siga un enlace a Dallas College o a Instagram, se aplican sus propias reglas de privacidad.",
            ],
         },
      ],
   },
   chatbot: {
      title: "Hacer una pregunta",
      subtitle: "Pregunte en su idioma",
      botName: "Chatbot de PTK",
      greeting: "¡Hola! Pregúnteme lo que quiera sobre Dallas College. Puede escribir en su propio idioma.",
      tapAQuestion: "O toque una pregunta:",
      starterQuestions: [
         "¿Cómo me inscribo en las clases de inglés de noche?",
         "¿Qué becas puedo solicitar?",
         "¿Cómo obtengo el pase de autobús gratis para estudiantes?",
         "¿Qué ayuda hay para el cuidado de niños de los estudiantes?",
      ],
      conversationLabel: "Conversación",
      youSaid: "Usted dijo:",
      thinking: "Buscando una respuesta…",
      source: "Fuente:",
      helpful: "¿Le fue útil?",
      yes: "Sí",
      no: "No",
      thanksForFeedback: "Gracias por decirnos.",
      talkToPerson: "Hablar con una persona real",
      talkToPersonBody: "Alguien de Dallas College le ayudará",
      inputLabel: "Escriba su pregunta",
      askAnother: "Hacer otra pregunta",
      send: "Enviar pregunta",
      askButton: "Preguntar",
      error: "Lo sentimos, algo salió mal. Inténtelo de nuevo o hable con una persona real.",
      tooManyQuestions: "Hizo muchas preguntas muy rápido. Espere un minuto y vuelva a intentarlo.",
      tryAgain: "Intentar de nuevo",
   },
};
