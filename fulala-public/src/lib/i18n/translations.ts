export type Lang = 'cs' | 'en' | 'zh';

export interface TranslationStrings {
  // Navigation
  navHome: string;
  navMenu: string;
  navReservations: string;
  navStory: string;
  navContact: string;

  // Home page
  heroTagline1: string;
  heroTagline2: string;
  heroDescription: string;
  viewMenu: string;
  ourStory: string;
  tigerTagline: string;
  featureHandmadeTitle: string;
  featureHandmadeDesc: string;
  featureFreshTitle: string;
  featureFreshDesc: string;
  featureLoveTitle: string;
  featureLoveDesc: string;
  ctaTitle: string;
  ctaDescription: string;
  exploreMenu: string;
  findUs: string;

  // Story page
  storyPageTitle: string;
  storySubtitle: string;
  storyIntroTitle: string;
  storyIntroContent: string;
  storyOriginTitle: string;
  storyOriginContent: string;
  storyMascotTitle: string;
  storyMascotContent: string;
  storyValuesTitle: string;
  storyValuesContent: string;
  storyBtsTitle: string;
  storyBtsContent: string;
  storyCtaTitle: string;
  storyCtaContent: string;

  // Contact page
  findUsTitle: string;
  findUsSubtitle: string;
  contactInfo: string;
  sendMessage: string;
  commonQuestions: string;
  directions: string;

  // Contact info labels
  address: string;
  hours: string;
  email: string;

  // Contact info values
  addressValue: string;
  addressSubtext: string;
  hoursValue: string;
  hoursClosed: string;
  emailValue: string;

  // Form
  yourName: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subject: string;
  selectTopic: string;
  message: string;
  messagePlaceholder: string;
  sendBtn: string;
  sending: string;

  // Select options
  optGeneral: string;
  optReservation: string;
  optCatering: string;
  optFeedback: string;
  optOther: string;

  // Success
  messageSent: string;
  messageSentDesc: string;
  sendAnother: string;

  // FAQ
  faq1q: string;
  faq1a: string;
  faq2q: string;
  faq2a: string;
  faq3q: string;
  faq3a: string;
  faq4q: string;
  faq4a: string;

  // Reservations page
  reserveTable: string;
  reserveSpace: string;
  reserveTableDesc: string;
  reserveSpaceDesc: string;
  reserveDate: string;
  reservePartySize: string;
  reserveTime: string;
  reserveGuest: string;
  reserveGuestLabel: string;
  reserveNoSlots: string;
  reserveContactInfo: string;
  reserveName: string;
  reservePhone: string;
  reserveEmail: string;
  reserveSpecialRequests: string;
  reserveSubmit: string;
  reserveSubmitting: string;
  reserveConfirmed: string;
  reserveConfirmedDesc: string;
  reserveArriveNote: string;
  reserveAnother: string;
  reserveCancelPolicy: string;

  // Space booking
  reserveTimeBlock: string;
  reserveEventType: string;
  reserveEventParty: string;
  reserveEventMeeting: string;
  reserveEventDinner: string;
  reserveEventWorkshop: string;
  reserveEventOther: string;
  reserveSelectEventType: string;
  reserveSpaceCapacity: string;
  reserveSpaceBooked: string;

  // Manage reservation
  manageReservation: string;
  manageDesc: string;
  manageLookup: string;
  managePhonePlaceholder: string;
  manageNoResults: string;
  manageCancelBtn: string;
  manageCancelConfirm: string;
  manageCancelled: string;
  manageUpcoming: string;
  manageStatusPending: string;
  manageStatusConfirmed: string;
  manageStatusCancelled: string;

  // Footer
  footerTagline: string;
  footerCopyright: string;

  // Language label
  langLabel: string;

  // Idle helper messages
  idleMsg1: string;
  idleMsg2: string;
  idleMsg3: string;
  idleMsg4: string;
  idleMsg5: string;
}

export const translations: Record<Lang, TranslationStrings> = {
  cs: {
    // Navigation
    navHome: 'Domů',
    navMenu: 'Menu',
    navReservations: 'Rezervace',
    navStory: 'Náš příběh',
    navContact: 'Kontakt',

    // Home page
    heroTagline1: 'Old School',
    heroTagline2: 'New Soul',
    heroDescription: 'Čínská jídla s láskou. Ručně dělaná jídla podle receptů předávaných po generace.',
    viewMenu: 'Zobrazit menu',
    ourStory: 'Náš příběh',
    tigerTagline: 'Poznejte našeho tygra — odvážný, temperamentní a vždy hladový po skvělém jídle.',
    featureHandmadeTitle: 'Ručně děláno',
    featureHandmadeDesc: 'Každý knedlíček s péčí',
    featureFreshTitle: 'Denně čerstvé',
    featureFreshDesc: 'Suroviny čerstvé každé ráno',
    featureLoveTitle: 'S láskou',
    featureLoveDesc: 'Rodinné recepty, autentická chuť',
    ctaTitle: 'Už máte hlad?',
    ctaDescription: 'Přijďte ochutnat rituály radosti. Naše kuchyně na vás čeká.',
    exploreMenu: 'Prozkoumat menu',
    findUs: 'Najít nás',

    // Story page
    storyPageTitle: 'NÁŠ PŘÍBĚH',
    storySubtitle: 'Z rodinné kuchyně do srdce Prahy',
    storyIntroTitle: 'Old School New Soul',
    storyIntroContent: 'Ve FULALA věříme v kouzlo ručně dělaných knedlíčků. Každý je vytvořen s láskou, podle receptů předávaných po generace. Naše jméno "FULALA" zachycuje hravou radost, kterou chceme přinést ke každému jídlu.',
    storyOriginTitle: 'Zrozeno v Praze',
    storyOriginContent: 'Naše cesta začala v srdci Prahy, kde jsme se rozhodli přinést autentickou čínskou kuchyni do České republiky. Chtěli jsme vytvořit místo, kde se tradiční chutě setkávají s moderní pohostinností — místo, kde se každý návštěvník cítí jako doma.',
    storyMascotTitle: 'Poznejte tygra',
    storyMascotContent: 'Náš hravý maskot tygr zosobňuje odvážnou a temperamentní povahu naší kuchyně. V čínské kultuře tygr symbolizuje odvahu, sílu a štěstí. Pro nás je to také připomínka přistupovat k vaření s vášní a nebojácností.',
    storyValuesTitle: 'Rituály radosti',
    storyValuesContent: 'Věříme, že jídlo by mělo být radostným rituálem. Čerstvé suroviny nakupované denně, tradiční techniky pečlivě dodržované a spousta srdce jde do každého jídla, které servírujeme. Tohle není jen jídlo — je to zážitek.',
    storyBtsTitle: 'Zákulisí',
    storyBtsContent: 'Každé ráno se náš tým sejde, aby připravil čerstvé suroviny, ručně skládal knedlíčky a oživil ducha autentické čínské kuchyně.',
    storyCtaTitle: 'Připraveni ochutnat příběh?',
    storyCtaContent: 'Přijďte nás navštívit a staňte se součástí rodiny FULALA.',

    // Contact page
    findUsTitle: 'NAJDĚTE NÁS',
    findUsSubtitle: 'Rádi vás uvidíme!',
    contactInfo: 'Kontaktní informace',
    sendMessage: 'Pošlete zprávu',
    commonQuestions: 'Časté dotazy',
    directions: 'Navigace',

    address: 'Adresa',
    hours: 'Otevírací doba',
    email: 'E-mail',

    addressValue: 'Kostečná 121/3, 110 00 Staré Město',
    addressSubtext: 'Praha, Česká republika',
    hoursValue: 'Po – Ne: 11:00 – 22:00',
    hoursClosed: 'Otevřeno každý den',
    emailValue: 'hello@fulala.cz',

    yourName: 'Vaše jméno',
    namePlaceholder: 'Jan Novák',
    emailLabel: 'E-mail',
    emailPlaceholder: 'jan@example.com',
    subject: 'Předmět',
    selectTopic: 'Vyberte téma...',
    message: 'Zpráva',
    messagePlaceholder: 'Napište nám, co máte na srdci...',
    sendBtn: 'Odeslat zprávu',
    sending: 'Odesílání...',

    optGeneral: 'Obecný dotaz',
    optReservation: 'Rezervace',
    optCatering: 'Catering',
    optFeedback: 'Zpětná vazba',
    optOther: 'Jiné',

    messageSent: 'Zpráva odeslána!',
    messageSentDesc: 'Děkujeme za zprávu! Ozveme se vám co nejdříve.',
    sendAnother: 'Poslat další',

    faq1q: 'Přijímáte rezervace?',
    faq1a: 'Ano! Stůl si můžete zarezervovat e-mailem nebo telefonicky. Vítáni jsou i hosté bez rezervace.',
    faq2q: 'Máte vegetariánské možnosti?',
    faq2a: 'Samozřejmě! Naše vegetariánské knedlíčky a mnoho příloh jsou vhodné pro vegetariány.',
    faq3q: 'Nabízíte catering?',
    faq3a: 'Ano! Kontaktujte nás ohledně cateringu a připravíme vám menu na míru.',
    faq4q: 'Mohu si koupit knedlíčky domů?',
    faq4a: 'Ano, mražené knedlíčky jsou k dispozici s sebou. Zeptejte se našeho týmu!',

    // Reservations
    reserveTable: 'Rezervovat stůl',
    reserveSpace: 'Pronájem dolního prostoru',
    reserveTableDesc: 'Zarezervujte si stůl pro nezapomenutelný zážitek',
    reserveSpaceDesc: 'Pronajměte si náš soukromý prostor v suterénu pro akce a oslavy',
    reserveDate: 'Datum',
    reservePartySize: 'Počet hostů',
    reserveTime: 'Čas',
    reserveGuest: 'host',
    reserveGuestLabel: 'hostů',
    reserveNoSlots: 'Žádné volné termíny pro toto datum. Zkuste prosím jiný den.',
    reserveContactInfo: 'Kontaktní údaje',
    reserveName: 'Jméno',
    reservePhone: 'Telefon',
    reserveEmail: 'E-mail (nepovinný)',
    reserveSpecialRequests: 'Speciální požadavky (nepovinné)',
    reserveSubmit: 'Dokončit rezervaci',
    reserveSubmitting: 'Rezervuji...',
    reserveConfirmed: 'Rezervace potvrzena!',
    reserveConfirmedDesc: 'Těšíme se na vás',
    reserveArriveNote: 'Potvrzení bylo odesláno na váš telefon. Přijďte prosím 10 minut předem.',
    reserveAnother: 'Další rezervace',
    reserveCancelPolicy: 'Vytvořením rezervace souhlasíte s našimi podmínkami. Prosíme o zrušení alespoň 2 hodiny předem.',

    // Space booking
    reserveTimeBlock: 'Časový blok',
    reserveEventType: 'Typ akce',
    reserveEventParty: 'Oslava / Párty',
    reserveEventMeeting: 'Schůzka / Meeting',
    reserveEventDinner: 'Soukromá večeře',
    reserveEventWorkshop: 'Workshop',
    reserveEventOther: 'Jiné',
    reserveSelectEventType: 'Vyberte typ akce...',
    reserveSpaceCapacity: 'Kapacita: až 30 osob',
    reserveSpaceBooked: 'Obsazeno',

    // Manage reservation
    manageReservation: 'Správa rezervace',
    manageDesc: 'Vyhledejte svou rezervaci podle telefonního čísla',
    manageLookup: 'Vyhledat',
    managePhonePlaceholder: '+420 XXX XXX XXX',
    manageNoResults: 'Žádné rezervace nenalezeny pro toto číslo.',
    manageCancelBtn: 'Zrušit rezervaci',
    manageCancelConfirm: 'Opravdu chcete zrušit tuto rezervaci?',
    manageCancelled: 'Rezervace byla zrušena.',
    manageUpcoming: 'Vaše nadcházející rezervace',
    manageStatusPending: 'Čeká na potvrzení',
    manageStatusConfirmed: 'Potvrzeno',
    manageStatusCancelled: 'Zrušeno',

    // Footer
    footerTagline: 'Old School New Soul',
    footerCopyright: 'FULALA. Uděláno s knedlíčky.',

    langLabel: 'CZ',

    idleMsg1: 'Nespěchejte, jsme tu pro vás...',
    idleMsg2: 'Dnešní nabídka: ručně dělaná jídla!',
    idleMsg3: 'Stolky se rychle plní, rezervujte si!',
    idleMsg4: 'Přes 100 spokojených hostů tento týden!',
    idleMsg5: 'Hlad? Naše menu vás potěší!',
  },

  en: {
    // Navigation
    navHome: 'Home',
    navMenu: 'Menu',
    navReservations: 'Reservations',
    navStory: 'Our Story',
    navContact: 'Contact',

    // Home page
    heroTagline1: 'Old School',
    heroTagline2: 'New Soul',
    heroDescription: 'Comfort Chinese dishes made with love. Handmade dumplings following recipes passed down through generations.',
    viewMenu: 'View Menu',
    ourStory: 'Our Story',
    tigerTagline: 'Meet our tiger — bold, spirited, and always hungry for great food.',
    featureHandmadeTitle: 'Handmade',
    featureHandmadeDesc: 'Every dumpling crafted with care',
    featureFreshTitle: 'Fresh Daily',
    featureFreshDesc: 'Ingredients sourced each morning',
    featureLoveTitle: 'Made with Love',
    featureLoveDesc: 'Family recipes, authentic taste',
    ctaTitle: 'Hungry Yet?',
    ctaDescription: 'Come taste the rituals of joy. Our kitchen is waiting for you.',
    exploreMenu: 'Explore Menu',
    findUs: 'Find Us',

    // Story page
    storyPageTitle: 'OUR STORY',
    storySubtitle: 'From family kitchen to Prague\'s heart',
    storyIntroTitle: 'Old School New Soul',
    storyIntroContent: 'At FULALA, we believe in the magic of handmade dumplings. Each one is crafted with love, following recipes passed down through generations. Our name "FULALA" captures the whimsical joy we want to bring to every meal.',
    storyOriginTitle: 'Born in Prague',
    storyOriginContent: 'Our journey began in the heart of Prague, where we set out to bring authentic Chinese comfort food to the Czech Republic. We wanted to create a space where traditional flavors meet modern hospitality — a place where every visitor feels like family.',
    storyMascotTitle: 'Meet the Tiger',
    storyMascotContent: 'Our playful tiger mascot embodies the bold, spirited nature of our kitchen. In Chinese culture, the tiger represents courage, power, and good fortune. For us, it\'s also a reminder to approach cooking with passion and fearlessness.',
    storyValuesTitle: 'Rituals of Joy',
    storyValuesContent: 'We believe eating should be a joyful ritual. Fresh ingredients sourced daily, traditional techniques honored carefully, and a whole lot of heart goes into every dish we serve. This isn\'t just food — it\'s an experience.',
    storyBtsTitle: 'Behind the Scenes',
    storyBtsContent: 'Every morning, our team gathers to prepare fresh ingredients, fold dumplings by hand, and bring the spirit of authentic Chinese cooking to life.',
    storyCtaTitle: 'Ready to taste the story?',
    storyCtaContent: 'Come visit us and become part of the FULALA family.',

    // Contact page
    findUsTitle: 'FIND US',
    findUsSubtitle: "We'd love to see you!",
    contactInfo: 'Contact Info',
    sendMessage: 'Send a Message',
    commonQuestions: 'Common Questions',
    directions: 'Directions',

    address: 'Address',
    hours: 'Hours',
    email: 'Email',

    addressValue: 'Kostečná 121/3, 110 00 Staré Město',
    addressSubtext: 'Prague, Czech Republic',
    hoursValue: 'Mon - Sun: 11:00 - 22:00',
    hoursClosed: 'Open every day',
    emailValue: 'hello@fulala.cz',

    yourName: 'Your Name',
    namePlaceholder: 'Tiger McTigerface',
    emailLabel: 'Email',
    emailPlaceholder: 'tiger@example.com',
    subject: 'Subject',
    selectTopic: 'Select a topic...',
    message: 'Message',
    messagePlaceholder: 'Tell us what\'s on your mind...',
    sendBtn: 'Send Message',
    sending: 'Sending...',

    optGeneral: 'General Inquiry',
    optReservation: 'Reservation',
    optCatering: 'Catering',
    optFeedback: 'Feedback',
    optOther: 'Other',

    messageSent: 'Message Sent!',
    messageSentDesc: "Thanks for reaching out! We'll get back to you soon.",
    sendAnother: 'Send Another',

    faq1q: 'Do you take reservations?',
    faq1a: 'Yes! You can book a table by email or phone. Walk-ins are also welcome.',
    faq2q: 'Are there vegetarian options?',
    faq2a: 'Absolutely! Our vegetarian dumplings and many sides are vegetarian-friendly.',
    faq3q: 'Do you offer catering?',
    faq3a: "We do! Contact us for catering inquiries and we'll create a custom menu.",
    faq4q: 'Can I buy dumplings to take home?',
    faq4a: 'Yes, frozen dumplings are available for takeaway. Ask our team!',

    // Reservations
    reserveTable: 'Reserve a Table',
    reserveSpace: 'Book the Downstairs Space',
    reserveTableDesc: 'Book your spot for an unforgettable dumpling experience',
    reserveSpaceDesc: 'Rent our private downstairs area for events and parties',
    reserveDate: 'Date',
    reservePartySize: 'Party Size',
    reserveTime: 'Time',
    reserveGuest: 'guest',
    reserveGuestLabel: 'guests',
    reserveNoSlots: 'No available time slots for this date. Please try a different day.',
    reserveContactInfo: 'Contact Information',
    reserveName: 'Name',
    reservePhone: 'Phone',
    reserveEmail: 'Email (optional)',
    reserveSpecialRequests: 'Special Requests (optional)',
    reserveSubmit: 'Complete Reservation',
    reserveSubmitting: 'Booking...',
    reserveConfirmed: 'Reservation Confirmed!',
    reserveConfirmedDesc: "We can't wait to see you",
    reserveArriveNote: 'A confirmation has been sent to your phone. Please arrive 10 minutes before your reservation.',
    reserveAnother: 'Make Another Reservation',
    reserveCancelPolicy: 'By making a reservation, you agree to our cancellation policy. Please cancel at least 2 hours in advance.',

    // Space booking
    reserveTimeBlock: 'Time Block',
    reserveEventType: 'Event Type',
    reserveEventParty: 'Party / Celebration',
    reserveEventMeeting: 'Meeting / Corporate',
    reserveEventDinner: 'Private Dinner',
    reserveEventWorkshop: 'Workshop',
    reserveEventOther: 'Other',
    reserveSelectEventType: 'Select event type...',
    reserveSpaceCapacity: 'Capacity: up to 30 guests',
    reserveSpaceBooked: 'Booked',

    // Manage reservation
    manageReservation: 'Manage Reservation',
    manageDesc: 'Look up your reservation by phone number',
    manageLookup: 'Look up',
    managePhonePlaceholder: '+420 XXX XXX XXX',
    manageNoResults: 'No reservations found for this number.',
    manageCancelBtn: 'Cancel Reservation',
    manageCancelConfirm: 'Are you sure you want to cancel this reservation?',
    manageCancelled: 'Reservation has been cancelled.',
    manageUpcoming: 'Your upcoming reservations',
    manageStatusPending: 'Pending',
    manageStatusConfirmed: 'Confirmed',
    manageStatusCancelled: 'Cancelled',

    // Footer
    footerTagline: 'Old School New Soul',
    footerCopyright: 'FULALA. Made with dumplings.',

    langLabel: 'EN',

    idleMsg1: "Take your time, we're here when you're ready...",
    idleMsg2: "Today's special: handmade dumplings!",
    idleMsg3: 'Tables filling up fast tonight!',
    idleMsg4: 'Join 100+ happy guests this week!',
    idleMsg5: "Hungry? Our menu won't disappoint!",
  },

  zh: {
    // Navigation
    navHome: '首页',
    navMenu: '菜单',
    navReservations: '预订',
    navStory: '我们的故事',
    navContact: '联系',

    // Home page
    heroTagline1: 'Old School',
    heroTagline2: 'New Soul',
    heroDescription: '用心烹制的中式美食。手工饺子，传承几代人的家传秘方。',
    viewMenu: '查看菜单',
    ourStory: '我们的故事',
    tigerTagline: '认识我们的老虎——勇敢、充满活力，永远对美食充满热情。',
    featureHandmadeTitle: '手工制作',
    featureHandmadeDesc: '每一个饺子都精心制作',
    featureFreshTitle: '每日新鲜',
    featureFreshDesc: '每天早晨采购新鲜食材',
    featureLoveTitle: '用心烹制',
    featureLoveDesc: '家传秘方，正宗味道',
    ctaTitle: '饿了吗？',
    ctaDescription: '来品尝快乐的仪式吧。我们的厨房在等你。',
    exploreMenu: '探索菜单',
    findUs: '找到我们',

    // Story page
    storyPageTitle: '我们的故事',
    storySubtitle: '从家庭厨房到布拉格的心脏',
    storyIntroTitle: 'Old School New Soul',
    storyIntroContent: '在FULALA，我们相信手工饺子的魔力。每一个都是用爱制作的，遵循代代相传的食谱。我们的名字"FULALA"捕捉了我们想要带给每一餐的奇妙快乐。',
    storyOriginTitle: '诞生于布拉格',
    storyOriginContent: '我们的旅程始于布拉格的心脏地带，在那里我们决定将正宗的中式家常菜带到捷克共和国。我们想创造一个传统风味与现代待客之道相遇的空间——一个让每位客人都感到宾至如归的地方。',
    storyMascotTitle: '认识老虎',
    storyMascotContent: '我们活泼的老虎吉祥物体现了我们厨房大胆而充满活力的精神。在中国文化中，老虎象征着勇气、力量和好运。对我们来说，它也提醒我们要以热情和无畏的态度对待烹饪。',
    storyValuesTitle: '快乐的仪式',
    storyValuesContent: '我们相信吃饭应该是一个快乐的仪式。每天采购新鲜食材，精心遵循传统技艺，每一道菜都倾注了满满的心意。这不仅仅是食物——这是一种体验。',
    storyBtsTitle: '幕后花絮',
    storyBtsContent: '每天早晨，我们的团队聚在一起准备新鲜食材，手工包饺子，将正宗中式烹饪的精髓带入生活。',
    storyCtaTitle: '准备好品尝故事了吗？',
    storyCtaContent: '来拜访我们，成为FULALA大家庭的一员。',

    // Contact page
    findUsTitle: '找到我们',
    findUsSubtitle: '期待您的光临！',
    contactInfo: '联系方式',
    sendMessage: '发送消息',
    commonQuestions: '常见问题',
    directions: '导航',

    address: '地址',
    hours: '营业时间',
    email: '电子邮件',

    addressValue: 'Kostečná 121/3, 110 00 Staré Město',
    addressSubtext: '布拉格，捷克共和国',
    hoursValue: '周一至周日：11:00 - 22:00',
    hoursClosed: '每天营业',
    emailValue: 'hello@fulala.cz',

    yourName: '您的姓名',
    namePlaceholder: '张三',
    emailLabel: '电子邮件',
    emailPlaceholder: 'zhangsan@example.com',
    subject: '主题',
    selectTopic: '请选择主题...',
    message: '留言',
    messagePlaceholder: '请告诉我们您想说的...',
    sendBtn: '发送消息',
    sending: '发送中...',

    optGeneral: '一般咨询',
    optReservation: '预订',
    optCatering: '宴会服务',
    optFeedback: '反馈',
    optOther: '其他',

    messageSent: '消息已发送！',
    messageSentDesc: '感谢您的来信！我们会尽快回复您。',
    sendAnother: '再发一条',

    faq1q: '接受预订吗？',
    faq1a: '是的！您可以通过电子邮件或电话预订座位。也欢迎直接到店。',
    faq2q: '有素食选择吗？',
    faq2a: '当然！我们的素菜饺子和许多配菜都适合素食者。',
    faq3q: '提供宴会服务吗？',
    faq3a: '是的！联系我们了解宴会服务详情，我们将为您定制菜单。',
    faq4q: '可以买饺子带回家吗？',
    faq4a: '可以，冷冻饺子可以外带。请咨询我们的工作人员！',

    // Reservations
    reserveTable: '预订座位',
    reserveSpace: '预订地下空间',
    reserveTableDesc: '预订座位，享受难忘的饺子体验',
    reserveSpaceDesc: '租用我们的私人地下空间，举办活动和派对',
    reserveDate: '日期',
    reservePartySize: '人数',
    reserveTime: '时间',
    reserveGuest: '位客人',
    reserveGuestLabel: '位客人',
    reserveNoSlots: '该日期没有可用时段。请尝试其他日期。',
    reserveContactInfo: '联系信息',
    reserveName: '姓名',
    reservePhone: '电话',
    reserveEmail: '电子邮件（选填）',
    reserveSpecialRequests: '特殊要求（选填）',
    reserveSubmit: '确认预订',
    reserveSubmitting: '预订中...',
    reserveConfirmed: '预订已确认！',
    reserveConfirmedDesc: '我们期待您的光临',
    reserveArriveNote: '确认信息已发送至您的手机。请在预订时间前10分钟到达。',
    reserveAnother: '再次预订',
    reserveCancelPolicy: '预订即表示您同意我们的取消政策。如需取消，请至少提前2小时通知。',

    // Space booking
    reserveTimeBlock: '时间段',
    reserveEventType: '活动类型',
    reserveEventParty: '派对 / 庆典',
    reserveEventMeeting: '会议 / 商务',
    reserveEventDinner: '私人晚宴',
    reserveEventWorkshop: '工作坊',
    reserveEventOther: '其他',
    reserveSelectEventType: '请选择活动类型...',
    reserveSpaceCapacity: '容量：最多30位客人',
    reserveSpaceBooked: '已预订',

    // Manage reservation
    manageReservation: '管理预订',
    manageDesc: '通过手机号查询您的预订',
    manageLookup: '查询',
    managePhonePlaceholder: '+420 XXX XXX XXX',
    manageNoResults: '未找到该号码的预订。',
    manageCancelBtn: '取消预订',
    manageCancelConfirm: '您确定要取消此预订吗？',
    manageCancelled: '预订已取消。',
    manageUpcoming: '您的即将到来的预订',
    manageStatusPending: '待确认',
    manageStatusConfirmed: '已确认',
    manageStatusCancelled: '已取消',

    // Footer
    footerTagline: 'Old School New Soul',
    footerCopyright: 'FULALA。用饺子做的。',

    langLabel: '中',

    idleMsg1: '不着急，我们随时为您服务...',
    idleMsg2: '今日特色：手工饺子！',
    idleMsg3: '今晚座位快满了，快来预订！',
    idleMsg4: '本周已有100多位满意的客人！',
    idleMsg5: '饿了吗？我们的菜单不会让您失望！',
  },
};
