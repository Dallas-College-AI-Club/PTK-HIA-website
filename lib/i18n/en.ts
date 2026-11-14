/**
 * English text for the layout and Home page.
 *
 * Every word users see lives here (not inside components), so adding a
 * language means adding one more file with the same keys. Components read
 * text through getMessages(locale) in ./index.ts, never by importing this file.
 */
export const en = {
   brand: {
      name: "PTK × AI Club",
      college: "Dallas College",
      logoPlaceholder: "Logo",
   },
   pages: {
      home: "Home",
      learnEnglish: "Learn English",
      startCollege: "Start College",
      payForCollege: "Pay for College",
      talkToSomeone: "Talk to Someone",
      askQuestion: "Ask a Question",
   },
   layout: {
      textSize: "Text size",
      backHome: "Home",
      stillHaveQuestion: "Still have a question?",
      stillHaveQuestionBody: "Ask in your language. Answers come from resources collected by PTK.",
      askInYourLanguage: "Ask in your language",
      footerPoweredBy: "Powered by PTK and AI Club at Dallas College",
      footerInstagram: "Instagram",
      footerPrivacy: "Privacy",
      comingSoon: "Coming soon",
      opensNewTab: "(opens in a new tab)",
      footerNotOfficial: "Not an official Dallas College website.",
      mainNavLabel: "Main",
      quickActionsLabel: "Quick actions",
      footerNavLabel: "Footer",
   },
   language: {
      label: "Language",
      chooseTitle: "Choose your language",
   },
   startCollege: {
      intro: "You apply and register for classes on the Dallas College website.",
      registrationLink: "Go to Dallas College registration",
      englishNote: "The Dallas College website is in English. Need help with the steps?",
   },
   financialAid: {
      intro: "Ways to get help paying for school.",
      sections: {
         aid: {
            title: "Financial aid",
            body: "Money from the government to help pay for classes. Apply every year.",
         },
         busPass: {
            title: "Free student bus pass",
            body: "Ride DART buses and trains for free while you take classes.",
         },
         scholarships: {
            title: "Scholarships",
            body: "Money for school that you don't pay back.",
         },
      },
      // A hint is only added where the label alone isn't clear.
      links: {
         aidOverview: { label: "How financial aid works" },
         fafsa: { label: "Apply with the FAFSA", hint: "For U.S. citizens, permanent residents and refugees" },
         tasfa: { label: "Apply with the TASFA", hint: "For Texas students who can't use the FAFSA" },
         keepAid: { label: "Keep your financial aid" },
         goPass: { label: "Get your DART GoPass" },
         scholarships: { label: "Find scholarships", hint: "One application for many scholarships" },
         dreamers: { label: "Help for Dreamers and DACA students" },
      },
      englishNote: "The Dallas College website is in English. Need help?",
   },
   getConnected: {
      title: "Talk to someone",
      intro: "Leave your contact details and a real person at Dallas College will reach out.",
      privacyNote: "We will never ask about immigration status.",
      fields: {
         fullName: "Full name",
         email: "Email",
         phone: "Phone",
         contactHint: "Give us an email or a phone number (or both).",
         preferredLanguage: "Preferred language",
         situation: "Which describes you best?",
         helpWith: "What do you need help with?",
         notes: "Anything else we should know? (optional)",
         choose: "Choose one",
      },
      situations: {
         highSchoolSenior: "Graduating high school senior",
         currentStudent: "Current Dallas College student",
         parent: "Parent",
         refugee: "Refugee / new to the U.S.",
         eslLearner: "ESL learner",
         other: "Other",
      },
      helpTopics: {
         admissions: "Admissions",
         esl: "ESL classes",
         financialAid: "Financial aid / tuition",
         childcare: "Childcare",
         transportation: "Transportation",
         counseling: "Counseling",
         other: "Other",
      },
      errors: {
         fullNameRequired: "Please enter your name.",
         contactRequired: "Please give us an email or a phone number.",
         emailInvalid: "This email doesn't look complete. Check for an @ and a dot.",
         choose: "Please choose one.",
         generic: "Something went wrong on our side. Please try again.",
      },
      submit: "Send my request",
      sending: "Sending…",
      thankYouTitle: "Thank you!",
      thankYouBody: "Someone from Dallas College will contact you soon.",
      ptkContact: {
         title: "Contact PTK",
         body: "Have a question for the PTK students who made this site? Send us an email.",
         emailButton: "Email PTK",
      },
      peerMentor: {
         title: "Peer mentors",
         body: "Talk with a student who has been where you are.",
      },
   },
   esl: {
      title: "Learn English",
      description: "ESL helps you learn to read, write, listen and speak English. It does not give college credit.",
      opensInNewTab: "opens in a new tab",
      difference: {
         heading: "ESOL and ESL: What’s the Difference?",
         esol: {
            title: "ESOL",
            body: "ESOL is a college credit program. It helps you build the English skills you need for college classes. If you plan to transfer to a four-year school, it also helps you prepare for exams like the TOEFL.",
         },
         esl: {
            title: "ESL",
            body: "ESL is a program with no college credit. It helps you read, write, listen and speak English in daily life, at work and at school. It is a good fit if you want to prepare for a GED program, job training or an industry certification.",
         },
         workReadyU: {
            before: "Dallas College also has the ",
            link: "WorkReadyU ESL Academy",
            after: ", a free program with no college credit. It is for eligible students who want better English for their career.",
         },
      },
      areaOfStudy: "Area of Study Overview",
      esolCourses: {
         heading: "ESOL Courses",
         intro: "ESOL has classes in listening/speaking, reading, writing and grammar at four levels. Classes are in person. Levels three and four are also online.",
         tableCaption: "ESOL courses by level and skill",
         columns: {
            level: "Level",
            listeningSpeaking: "Listening/Speaking",
            reading: "Reading",
            writing: "Writing",
            grammar: "Grammar",
         },
         extra: "There are also extra ESOL classes, such as Integrated Reading and Writing, for more practice.",
         completeHeading: "To finish the ESOL program, do one of these:",
         completeOptions: [
            "Pass ESOL 0044 and ESOL 0054",
            "Pass the reading and writing parts of the TSI Assessment",
         ],
      },
      eslCourses: {
         heading: "ESL Courses",
         intro: "ESL has six levels. It helps you communicate better at work, for a promotion and in daily life.",
         listHeading: "Courses in the ESL program:",
         courses: [
            { code: "COMG 1000", name: "Communications Improvement I (Integrated Skills)" },
            { code: "COMG 1001", name: "Communications Improvement II (Integrated Skills)" },
            { code: "COMG 1004", name: "Communications Improvement III (Integrated Skills)" },
            { code: "COMG 1005", name: "Communications Improvement IV (Integrated Skills)" },
            { code: "COMG 1007", name: "Communications Improvement V (Integrated Skills)" },
            { code: "COMG 1008", name: "Communications Improvement VI (Integrated Skills)" },
         ],
         completion:
            "After the ESL program, you can take the ESOL placement test if you want to keep studying.",
      },
      application: {
         heading: "Application Process",
         esol: {
            title: "ESOL",
            steps: [
               { before: "", link: "Apply to Dallas College", after: "." },
               { before: "Take an ", link: "ESOL placement test", after: " to find your starting level." },
               { before: "Meet with a ", link: "success coach", after: "." },
            ],
         },
         esl: {
            title: "ESL",
            steps: [
               { before: "Meet with a continuing education ", link: "success coach", after: "." },
               { before: "Take an ESL placement test to find your starting level.", link: "", after: "" },
               { before: "Register with your success coach.", link: "", after: "" },
            ],
         },
         questions: {
            before: "Questions about registering for ESL? Email the continuing education success coaches at ",
            after: ".",
         },
      },
      helpfulPages: {
         heading: "Helpful Dallas College Pages",
         items: [
            {
               key: "registration",
               title: "Register for Classes",
               description: "Steps to register for classes and pay for them.",
            },
            {
               key: "locations",
               title: "Dallas College Locations",
               description: "Find campuses and centers near you.",
            },
            {
               key: "nightsWeekends",
               title: "Nights and Weekends Classes",
               description: "Evening and Saturday classes for working adults.",
            },
         ],
      },
      // Each footnote is a list of pieces: plain text, or a link ({ link: key, label }).
      // The key says which address to use (see footnoteLinks in the page file).
      footnotes: {
         label: "Footnotes",
         items: [
            [
               "Length of time is based on catalog degree plans. Prerequisites may be required, which are not included in this estimate. For most programs, full-time student status is assumed, a minimum of 12 credit hours per semester.",
            ],
            [
               "Cost for credit courses is based on tuition rates for program hours for Dallas County residents. The price of most required learning materials (books, software, supplies, etc.) is included with the price of tuition. Certain programs may have additional costs above the standard tuition. Continuing Education courses may vary by program. Please review the ",
               { link: "areaOfStudy", label: "Area of Study Overview" },
               " and/or the ",
               { link: "healthPackets", label: "Health Information Packets" },
               " for additional costs and details. Visit our ",
               { link: "payingForCollege", label: "Paying for College site" },
               " to learn more about cost, financial aid, scholarships and more.",
            ],
            [
               "Each location offers a unique combination of certificate and degree options. Not all degree and certificate offerings are available for admission/start at all campuses every semester.",
            ],
            [
               "A portion of Lightcast’s data comes from ",
               { link: "onet", label: "O*NET Online" },
               " by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the CC BY 4.0 license. O*NET® is a trademark of USDOL/ETA. Lightcast has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications.",
            ],
         ],
      },
      source: {
         label: "Source:",
         linkLabel: "Dallas College ESL page",
         updated: "Updated October 16, 2026",
      },
   },
   home: {
      welcome: "Welcome",
      howCanWeHelp: "How can we help you?",
      askLabel: "Ask a question in your language",
      askPlaceholder: "Type your question",
      askButton: "Ask",
      popular: "Popular:",
      popularQuestions: [
         { label: "Night ESL classes", question: "How do I sign up for night ESL classes?" },
         { label: "Scholarships", question: "What scholarships can I apply for?" },
         { label: "Free bus pass", question: "How do I get the free student bus pass?" },
      ],
      aiNotice:
         "Answers come from resources collected by PTK. Always confirm important details with Dallas College.",
      illustrationAlt: "Illustration placeholder: diverse families walking to campus",
      illustrationPlaceholder: "Illustration placeholder",
      whatDoYouNeed: "What do you need?",
      cards: {
         learnEnglish: { title: "Learn English (ESL)", description: "English classes at night and on weekends" },
         startCollege: { title: "Start College", description: "Steps from applying to your first class" },
         payForCollege: { title: "Pay for College", description: "Financial aid, scholarships and payment plans" },
         talkToSomeone: { title: "Talk to Someone", description: "A real person will help you" },
      },
      moreHelp: "More help",
      moreHelpItems: {
         childcare: { label: "Childcare", question: "What childcare help is there for students?" },
         busPass: { label: "Bus pass", question: "How do I get the free student bus pass?" },
         counseling: { label: "Counseling", question: "How do I make a counseling appointment?" },
      },
   },
   chatbot: {
      title: "Ask a Question",
      subtitle: "Ask in your language",
      botName: "PTK Chatbot",
      greeting: "Hello! Ask me anything about Dallas College. You can write in your own language.",
      tapAQuestion: "Or tap a question:",
      starterQuestions: [
         "How do I sign up for night ESL classes?",
         "What scholarships can I apply for?",
         "How do I get the free student bus pass?",
         "What childcare help is there for students?",
      ],
      conversationLabel: "Conversation",
      youSaid: "You said:",
      thinking: "Looking for an answer…",
      // TODO(backend): remove once answers come from the backend (RAG).
      placeholderAnswer:
         "[Placeholder answer. This will connect to the backend, which finds the answer in the resources PTK collected (RAG), and shows it in short, simple steps.]",
      placeholderSource: "[resource name]",
      source: "Source:",
      helpful: "Was this helpful?",
      yes: "Yes",
      no: "No",
      thanksForFeedback: "Thank you for telling us.",
      talkToPerson: "Talk to a real person",
      talkToPersonBody: "Someone at Dallas College will help you",
      inputLabel: "Type your question",
      askAnother: "Ask another question",
      send: "Send question",
      askButton: "Ask",
      error: "Sorry, something went wrong. Please try again, or talk to a real person.",
   },
};

export type Messages = typeof en;
