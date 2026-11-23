import type { Messages } from "./en";

/**
 * Arabic text (issue #55). Keep the same keys as en.ts: the type below makes
 * the build fail if a line is missing or extra. Arabic pages read right to
 * left (see lib/i18n/languages.ts).
 */
export const ar: Messages = {
   brand: {
      name: "PTK × AI Club",
      college: "Dallas College",
      // The site's description for search results and link previews.
      description: "اعثر على صفوف اللغة الإنجليزية، وابدأ الدراسة، واحصل على مساعدة في تكاليفها، وتواصل مع شخص حقيقي في Dallas College، بلغتك.",
   },
   pages: {
      home: "الرئيسية",
      learnEnglish: "تعلّم الإنجليزية",
      startCollege: "ابدأ الدراسة",
      payForCollege: "تكاليف الدراسة",
      talkToSomeone: "تحدّث مع شخص",
      askQuestion: "اطرح سؤالًا",
      start: "ابدأ",
   },
   layout: {
      backHome: "الرئيسية",
      stillHaveQuestion: "هل لديك سؤال آخر؟",
      stillHaveQuestionBody: "اسأل بلغتك. الإجابات من مصادر جمعتها PTK.",
      askInYourLanguage: "اسأل بلغتك",
      footerPoweredBy: "بدعم من PTK ونادي الذكاء الاصطناعي في Dallas College",
      footerInstagram: "إنستغرام",
      footerPrivacy: "الخصوصية",
      comingSoon: "قريبًا",
      opensNewTab: "(يفتح في علامة تبويب جديدة)",
      footerNotOfficial: "هذا ليس موقعًا رسميًا لـ Dallas College.",
      mainNavLabel: "القائمة الرئيسية",
      quickActionsLabel: "إجراءات سريعة",
      footerNavLabel: "تذييل الصفحة",
   },
   language: {
      label: "اللغة",
      chooseTitle: "اختر لغتك",
   },
   startCollege: {
      intro: "تتقدّم بطلب الالتحاق وتسجّل في الصفوف على موقع Dallas College.",
      registrationLink: "اذهب إلى صفحة التسجيل في Dallas College",
      englishNote: "موقع Dallas College باللغة الإنجليزية. هل تحتاج مساعدة في الخطوات؟",
   },
   financialAid: {
      intro: "طرق للحصول على مساعدة في دفع تكاليف الدراسة.",
      sections: {
         aid: {
            title: "المساعدة المالية",
            body: "أموال من الحكومة للمساعدة في دفع تكاليف الصفوف. قدّم طلبك كل عام.",
         },
         busPass: {
            title: "بطاقة حافلات مجانية للطلاب",
            body: "اركب حافلات وقطارات DART مجانًا أثناء دراستك.",
         },
         scholarships: {
            title: "المنح الدراسية",
            body: "أموال للدراسة لا تحتاج إلى ردّها.",
         },
      },
      links: {
         aidOverview: { label: "كيف تعمل المساعدة المالية" },
         fafsa: { label: "قدّم عبر FAFSA", hint: "للمواطنين الأمريكيين والمقيمين الدائمين واللاجئين" },
         tasfa: { label: "قدّم عبر TASFA", hint: "لطلاب تكساس الذين لا يمكنهم استخدام FAFSA" },
         keepAid: { label: "حافظ على مساعدتك المالية" },
         goPass: { label: "احصل على DART GoPass" },
         scholarships: { label: "ابحث عن منح دراسية", hint: "طلب واحد للعديد من المنح" },
         dreamers: { label: "مساعدة لطلاب Dreamers وDACA" },
      },
      englishNote: "موقع Dallas College باللغة الإنجليزية. هل تحتاج مساعدة؟",
   },
   getConnected: {
      title: "تحدّث مع شخص",
      intro: "اترك بيانات التواصل الخاصة بك وسيتواصل معك شخص حقيقي من Dallas College.",
      privacyNote: "لن نسألك أبدًا عن وضع الهجرة.",
      fields: {
         fullName: "الاسم الكامل",
         email: "البريد الإلكتروني",
         phone: "الهاتف",
         contactHint: "أعطنا بريدًا إلكترونيًا أو رقم هاتف (أو كليهما).",
         preferredLanguage: "اللغة المفضلة",
         situation: "ما الذي يصفك أكثر؟",
         helpWith: "بماذا تحتاج المساعدة؟",
         notes: "هل هناك شيء آخر يجب أن نعرفه؟ (اختياري)",
         choose: "اختر واحدًا",
      },
      situations: {
         highSchoolSenior: "طالب في السنة الأخيرة من الثانوية",
         currentStudent: "طالب حالي في Dallas College",
         parent: "أحد الوالدين",
         refugee: "لاجئ / جديد في الولايات المتحدة",
         eslLearner: "متعلّم للغة الإنجليزية",
         other: "أخرى",
      },
      helpTopics: {
         admissions: "القبول",
         esl: "صفوف اللغة الإنجليزية",
         financialAid: "المساعدة المالية / الرسوم الدراسية",
         childcare: "رعاية الأطفال",
         transportation: "المواصلات",
         counseling: "الإرشاد",
         other: "أخرى",
      },
      errors: {
         fullNameRequired: "يرجى كتابة اسمك.",
         contactRequired: "يرجى إعطاؤنا بريدًا إلكترونيًا أو رقم هاتف.",
         emailInvalid: "يبدو أن البريد الإلكتروني غير مكتمل. تأكّد من وجود @ ونقطة.",
         choose: "يرجى اختيار واحد.",
         generic: "حدث خطأ من جهتنا. يرجى المحاولة مرة أخرى.",
      },
      submit: "أرسل طلبي",
      sending: "جارٍ الإرسال…",
      thankYouTitle: "شكرًا لك!",
      thankYouBody: "سيتواصل معك شخص من Dallas College قريبًا.",
      ptkContact: {
         title: "تواصل مع PTK",
         body: "هل لديك سؤال لطلاب PTK الذين صنعوا هذا الموقع؟ أرسل لنا بريدًا إلكترونيًا.",
         emailButton: "راسل PTK",
      },
      peerMentor: {
         title: "مرشدون من الطلاب",
         body: "تحدّث مع طالب مرّ بما تمرّ به.",
      },
   },
   esl: {
      title: "تعلّم الإنجليزية",
      description: "برامج المساء ونهاية الأسبوع، وخطوات التسجيل، والمواقع.",
      intro: "صفوف في المساء وفي نهاية الأسبوع، وكيفية التسجيل، وأين تذهب.",
      sections: {
         nightsWeekends: {
            title: "برامج المساء ونهاية الأسبوع",
            body: "صفوف مسائية وأيام السبت للبالغين العاملين.",
         },
         registration: {
            title: "خطوات التسجيل",
            body: "خطوات التسجيل في الصفوف ودفع تكاليفها.",
         },
         locations: {
            title: "المواقع",
            body: "ابحث عن الحرم الجامعية والمراكز القريبة منك.",
         },
      },
      links: {
         nightsWeekends: { label: "اطّلع على برامج المساء ونهاية الأسبوع" },
         registration: { label: "اطّلع على خطوات التسجيل" },
         locations: { label: "اطّلع على جميع المواقع" },
      },
      englishNote: "موقع Dallas College باللغة الإنجليزية. هل تحتاج مساعدة؟",
   },
   home: {
      welcome: "أهلًا بك",
      howCanWeHelp: "كيف يمكننا مساعدتك؟",
      askLabel: "اطرح سؤالًا بلغتك",
      askPlaceholder: "اكتب سؤالك",
      askButton: "اسأل",
      popular: "الأكثر طلبًا:",
      popularQuestions: [
         { label: "صفوف الإنجليزية المسائية", question: "كيف أسجّل في صفوف اللغة الإنجليزية المسائية؟" },
         { label: "المنح الدراسية", question: "ما المنح الدراسية التي يمكنني التقدّم لها؟" },
         { label: "بطاقة حافلات مجانية", question: "كيف أحصل على بطاقة الحافلات المجانية للطلاب؟" },
      ],
      aiNotice: "الإجابات من مصادر جمعتها PTK. تأكّد دائمًا من التفاصيل المهمة مع Dallas College.",
      illustrationAlt: "فقاعات حوار تقول مرحبًا بالإنجليزية والإسبانية والعربية والبورمية والسواحيلية",
      startButton: "لا تعرف من أين تبدأ؟ أجب عن سؤالين سريعين",
      whatDoYouNeed: "ماذا تحتاج؟",
      cards: {
         learnEnglish: { title: "تعلّم الإنجليزية (ESL)", description: "صفوف الإنجليزية في المساء وفي نهاية الأسبوع" },
         startCollege: { title: "ابدأ الدراسة", description: "الخطوات من التقديم حتى أول صف" },
         payForCollege: { title: "تكاليف الدراسة", description: "المساعدة المالية والمنح وخطط الدفع" },
         talkToSomeone: { title: "تحدّث مع شخص", description: "سيساعدك شخص حقيقي" },
      },
      moreHelp: "مساعدة إضافية",
      moreHelpItems: {
         childcare: { label: "رعاية الأطفال", question: "ما المساعدة المتوفرة لرعاية أطفال الطلاب؟" },
         busPass: { label: "بطاقة الحافلات", question: "كيف أحصل على بطاقة الحافلات المجانية للطلاب؟" },
         counseling: { label: "الإرشاد", question: "كيف أحجز موعدًا للإرشاد؟" },
      },
   },
   privacy: {
      title: "الخصوصية",
      description: "كيف يحمي هذا الموقع خصوصيتك: ما نطلبه، وما لا نطلبه أبدًا، وأين تذهب معلوماتك.",
      intro: [
         "كثير من الذين يستخدمون هذا الموقع يتعلّمون الإنجليزية، أو وصلوا حديثًا إلى الولايات المتحدة، أو يربّون أسرة أثناء الدراسة. يجب أن تتمكّن من الحصول على المساعدة دون أن تتخلّى عن خصوصيتك.",
         "لذلك صمّمنا هذا الموقع ليطلب أقل قدر ممكن من المعلومات، وليخبرك بوضوح بما يحدث لأي شيء تشاركه.",
      ],
      sections: [
         {
            title: "نهجنا في الخصوصية",
            items: [
               "نطلب فقط ما نحتاجه لمساعدتك.",
               "لا نسألك أبدًا عن وضع الهجرة.",
               "أنت تختار ما تشاركه. استخدام كل نموذج وسؤال في هذا الموقع اختياري.",
               "لا نعرض إعلانات، ولا نستخدم أدوات تتبّع، ولا نبيع معلوماتك أبدًا.",
            ],
         },
         {
            title: "إذا استخدمت «تحدّث مع شخص»",
            items: [
               "يطلب النموذج اسمك، وبريدًا إلكترونيًا أو رقم هاتف، ولغتك المفضلة، وما يصفك، وبماذا تحتاج المساعدة، وأي ملاحظات تريد إضافتها.",
               "تُرسَل هذه المعلومات بالبريد الإلكتروني إلى فريق PTK والمرشدين (Success Coaches) في Dallas College، ليتواصل معك شخص حقيقي. وتُستخدم فقط لمساعدتك.",
            ],
         },
         {
            title: "إذا استخدمت روبوت المحادثة",
            items: [
               "لكتابة الإجابة، تُرسَل أسئلتك إلى خدمة ذكاء اصطناعي (عبر OpenRouter). يرجى عدم كتابة تفاصيل خاصة، مثل رقم الطالب أو عنوانك.",
               "إذا أجبت عن أسئلة «لا تعرف من أين تبدأ؟»، تُرسَل إجاباتك أيضًا، لتكون الإجابة أنسب لك.",
               "لا نحفظ محادثتك. تختفي عند إغلاق الصفحة. قد تحتفظ خدمة الذكاء الاصطناعي بالرسائل وفق قواعدها الخاصة.",
            ],
         },
         {
            title: "مواقع أخرى",
            items: [
               "هذا مشروع طلابي من Phi Theta Kappa (PTK) ونادي الذكاء الاصطناعي في Dallas College. وهو ليس موقعًا رسميًا لـ Dallas College.",
               "عند فتح رابط إلى Dallas College أو إنستغرام، تُطبَّق قواعد الخصوصية الخاصة بهما.",
            ],
         },
      ],
   },
   chatbot: {
      title: "اطرح سؤالًا",
      subtitle: "اسأل بلغتك",
      botName: "روبوت محادثة PTK",
      greeting: "مرحبًا! اسألني أي شيء عن Dallas College. يمكنك الكتابة بلغتك.",
      tapAQuestion: "أو اضغط على سؤال:",
      starterQuestions: [
         "كيف أسجّل في صفوف اللغة الإنجليزية المسائية؟",
         "ما المنح الدراسية التي يمكنني التقدّم لها؟",
         "كيف أحصل على بطاقة الحافلات المجانية للطلاب؟",
         "ما المساعدة المتوفرة لرعاية أطفال الطلاب؟",
      ],
      conversationLabel: "المحادثة",
      youSaid: "قلتَ:",
      thinking: "جارٍ البحث عن إجابة…",
      source: "المصدر:",
      helpful: "هل كان هذا مفيدًا؟",
      yes: "نعم",
      no: "لا",
      thanksForFeedback: "شكرًا لإخبارنا.",
      talkToPerson: "تحدّث مع شخص حقيقي",
      talkToPersonBody: "سيساعدك شخص من Dallas College",
      inputLabel: "اكتب سؤالك",
      askAnother: "اطرح سؤالًا آخر",
      send: "أرسل السؤال",
      askButton: "اسأل",
      error: "عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى، أو التحدّث مع شخص حقيقي.",
      tooManyQuestions: "لقد طرحت أسئلة كثيرة بسرعة. يرجى الانتظار دقيقة ثم المحاولة مرة أخرى.",
      tryAgain: "حاول مرة أخرى",
   },
   onboarding: {
      title: "اعثر على ما تحتاجه",
      intro: "أجب عن سؤالين سريعين ليساعدك روبوت المحادثة بشكل أسرع. لا يُحفظ أي شيء.",
      // {step} and {total} are replaced with numbers.
      progress: "الخطوة {step} من {total}",
      steps: {
         needs: {
            title: "بماذا تحتاج المساعدة؟",
            hint: "اضغط على خيار واحد أو أكثر.",
            error: "اضغط على إجابة واحدة على الأقل، أو «لست متأكدًا».",
         },
         about: {
            title: "هل هناك شيء آخر عنك؟",
            hint: "اختياري. اضغط على ما ينطبق عليك، أو تخطَّ هذه الخطوة.",
         },
      },
      options: {
         esl: { label: "صفوف الإنجليزية", question: "كيف أسجّل في صفوف اللغة الإنجليزية المسائية؟" },
         college: { label: "ابدأ الدراسة", question: "كيف أتقدّم بطلب وأسجّل في الصفوف؟" },
         pay: { label: "تكاليف الدراسة", question: "كيف أحصل على مساعدة في دفع تكاليف الدراسة؟" },
         childcare: { label: "رعاية الأطفال", question: "ما المساعدة المتوفرة لرعاية أطفال الطلاب؟" },
         transit: { label: "بطاقة الحافلات", question: "كيف أحصل على بطاقة الحافلات المجانية للطلاب؟" },
         counseling: { label: "الإرشاد", question: "كيف أحجز موعدًا للإرشاد؟" },
         "not-sure": { label: "لست متأكدًا" },
         parent: { label: "أنا أحد الوالدين" },
         "works-days": { label: "أعمل خلال النهار" },
         new: { label: "أنا جديد في الكلية" },
      },
      back: "رجوع",
      next: "التالي",
      skip: "تخطَّ",
      startChatting: "ابدأ المحادثة",
      chatGreeting: "إليك أسئلة عمّا اخترته. اضغط على سؤال، أو اكتب سؤالك.",
      yourAnswers: "اخترتَ:",
      change: "تغيير",
   },
};
