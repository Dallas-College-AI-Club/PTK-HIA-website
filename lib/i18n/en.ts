/**
 * English text for the layout and Home page.
 *
 * Every word users see lives here (not inside components), so adding a
 * language means adding one more file with the same keys. Components read
 * text through getMessages() in ./index.ts, never by importing this file.
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
      languagePlaceholder: "Language",
      backHome: "Home",
      stillHaveQuestion: "Still have a question?",
      stillHaveQuestionBody: "Ask in your language. Answers come from resources collected by PTK.",
      askInYourLanguage: "Ask in your language",
      footerPoweredBy: "Powered by PTK and AI Club at Dallas College",
      footerInstagram: "Instagram",
      footerPrivacy: "Privacy",
      comingSoon: "Coming soon",
      footerNotOfficial: "Not an official Dallas College website.",
      mainNavLabel: "Main",
      quickActionsLabel: "Quick actions",
      footerNavLabel: "Footer",
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
};

export type Messages = typeof en;
