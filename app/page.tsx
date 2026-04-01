 "use client";

import Link from "next/link";
import { useState } from "react";
import { HomeHeroPreview } from "@/components/marketing/home-hero-preview";

type Language = "tr" | "en";

const content = {
  tr: {
    brandTagline: "Konaklama işletmeleri için yapay zeka rezervasyon asistanı",
    headerDemo: "Canlı Demoyu Gör",
    headerBook: "Demo Planla",
    heroPill: "Yüksek niyetli misafirleri geç yanıtlar ve OTA kaybı yüzünden kaçırmayın",
    heroTitleStart: "Misafir mesajlarını",
    heroTitleAccent: " premium direkt rezervasyonlara",
    heroTitleEnd: " dönüştürün.",
    heroDescription:
      "Tugobo AI, WhatsApp, Instagram DM ve web chat üzerinden anında yanıt verir, rezervasyon niyetini yakalar ve talepler OTA'lara ya da rakip işletmelere gitmeden ekibinizin daha fazla dönüşüm almasına yardımcı olur.",
    requestDemo: "Demo Talep Et",
    viewLiveDemo: "Canlı Demoyu Gör",
    floatingTags: ["WhatsApp", "Yapay zeka yanıtı", "Direkt rezervasyon", "Sea View upsell"],
    heroSignals: [
      ["7/24", "Rezervasyon yanıt kapsaması"],
      ["3 kanal", "WhatsApp, Instagram DM, Web Chat"],
      ["1 sistem", "Yapay zeka nitelendirir, ekip rezervasyonu kapatır"],
    ],
    language: { tr: "TR", en: "EN" },
  },
  en: {
    brandTagline: "AI reservation assistant for accommodation businesses",
    headerDemo: "View Live Demo",
    headerBook: "Book a Demo",
    heroPill: "Stop losing high-intent guests to slow replies and OTA leakage",
    heroTitleStart: "Turn guest messages into",
    heroTitleAccent: " premium direct bookings",
    heroTitleEnd: ", not missed revenue.",
    heroDescription:
      "Tugobo AI replies instantly on WhatsApp, Instagram DM, and website chat, captures booking intent, and helps your team convert more inquiries before they disappear to OTAs or competing properties.",
    requestDemo: "Request Demo",
    viewLiveDemo: "View Live Demo",
    floatingTags: ["WhatsApp", "AI reply", "Direct booking", "Sea View upsell"],
    heroSignals: [
      ["24/7", "Booking response coverage"],
      ["3 channels", "WhatsApp, Instagram DM, Web Chat"],
      ["1 system", "AI qualifies, staff closes bookings"],
    ],
    language: { tr: "TR", en: "EN" },
  },
} as const;

const sectionContent = {
  tr: {
    problem: {
      eyebrow: "Problem",
      title: "Çoğu işletme talep olmadığı için değil, geç yanıt verdiği için rezervasyon kaybeder.",
      description:
        "Misafir tarihler, fiyat ya da oda seçenekleri sorar. Yanıt geciktiğinde rezervasyon çoğu zaman bir OTA'ya ya da başka bir işletmeye gider. Konaklama işletmeleri için yavaş mesajlaşma, her gün sessizce direkt geliri azaltır.",
      items: [
        "Geç yanıtlar, rezervasyona hazır misafirlerin başka bir işletmeye yönelmesine neden olur.",
        "Gece gelen talepler yanıtsız kalırken direkt gelir sessizce kaybolur.",
        "Manuel mesajlaşma, talebin en yoğun olduğu anda ekibi yavaşlatır.",
        "Gelen sohbetler dönüşmezse ücretli trafik maliyeti hızla artar.",
        "Direkt talepler hızlı kapanmadığında OTA bağımlılığı büyür.",
        "Ekipler kanal, vardiya ve personel değişiminde rezervasyon bağlamını kaybeder.",
      ],
    },
    solution: {
      eyebrow: "Çözüm",
      title: "Tugobo AI, konaklama işletmeleri için bir rezervasyon dönüşüm sistemidir.",
      description:
        "Anında yanıt verir, önemli detayları toplar, doğru teklifi önerir ve ekibinize direkt rezervasyonları daha hızlı kapatmak için daha net bir akış sunar.",
      items: [
        "WhatsApp, Instagram DM ve web chat mesajlarını karşılar",
        "İşletmenize uygun, misafirperver bir tonla anında yanıt verir",
        "Tarihleri, misafir sayısını, oda tercihini ve bütçeyi anlar",
        "Doğru odayı ya da daha uygun bir alternatif teklifi önerir",
        "Dağınık sohbetler yerine rezervasyona hazır konuşmalar oluşturur",
        "Ekibinizin daha fazla direkt rezervasyon kapatmasına tam bağlamla yardımcı olur",
      ],
    },
    channels: {
      eyebrow: "Kanallar",
      title: "Tüm misafir konuşmaları tek bir yapay zeka destekli akışta.",
      description:
        "Farklı uygulamalar arasında mesaj kovalamak yerine, ekibiniz misafirlerin zaten kullandığı kanallarda tek bir tutarlı rezervasyon akışıyla çalışır.",
      items: [
        ["WhatsApp", "Mobil öncelikli misafirlerden gelen yüksek niyetli rezervasyon taleplerini yakalayın."],
        ["Instagram DM", "Sosyal medya trafiğini gerçek rezervasyon görüşmelerine dönüştürün."],
        ["Web Chat", "Web sitesi ziyaretçilerini direkt rezervasyon fırsatlarına çevirin."],
      ],
    },
    benefits: {
      eyebrow: "Faydalar",
      title: "Sadece yanıtları otomatikleştirmek için değil, direkt rezervasyon dönüşümünü artırmak için tasarlandı.",
      description:
        "Tugobo AI, işletmelerin daha hızlı yanıt vermesine, daha az talep kaçırmasına, OTA bağımlılığını azaltmasına ve daha fazla görüşmeyi onaylı rezervasyona yaklaştırmasına yardımcı olur.",
      items: [
        "Gece vardiyası eklemeden 7/24 yanıt verin",
        "Geç yanıt kaynaklı direkt rezervasyon kayıplarını azaltın",
        "İlk mesajdan rezervasyon onayına daha hızlı ilerleyin",
        "Rezervasyon ekibini degistirmek yerine yapay zeka ile guclendirin",
        "Tüm misafir taleplerini tek bir rezervasyon akışında düzenli tutun",
      ],
    },
    howItWorks: {
      eyebrow: "Nasıl Çalışır",
      title: "Daha hızlı rezervasyon dönüşümü için 3 adımlı net bir akış.",
      description:
        "Akış özellikle net tutulur; böylece konaklama ekipleri yapay zekanın yanıt hızını nasıl desteklediğini, ekibin ise kapanışı nasıl kontrol ettiğini açıkça görür.",
      items: [
        ["1", "Misafir mesaj gonderir", "Talep WhatsApp, Instagram DM ya da web chat uzerinden gelir."],
        ["2", "Yapay zeka yanıt verir ve niyeti analiz eder", "Tarihler, misafir sayısı, bütçe ve oda tercihi gerçek zamanlı olarak yakalanır."],
        ["3", "Ekip onaylar ya da rezervasyonu olusturur", "Ekibiniz baglam, teklif detaylari ve daha hizli kapanis yoluyla devreye girer."],
      ],
    },
    positioning: {
      eyebrow: "Konumlandırma",
      title: "Yapay zeka rezervasyon asistanı, dijital resepsiyonist, rezervasyon dönüşüm sistemi.",
      description:
        "Tugobo AI bir yapay zeka rezervasyon asistani ve dijital resepsiyonist gibi calisir, ancak is sonucu daha nettir: daha fazla direkt rezervasyon konusmasini gelire yaklastirir.",
      testimonials: [
        "Gece gelen rezervasyon kayıplarını nasıl durduracağını ilk anda görebildik.",
        "Bir chatbot gibi degil, ekibimiz icin calisan bir rezervasyon asistani gibi hissettiriyor.",
      ],
      authors: ["Butik Otel Sahibi", "Villa Operasyon Muduru"],
      fitLabel: "Uyum",
      fit: "OTA'lara bağımlı kalmadan daha fazla direkt rezervasyon dönüşümü isteyen işletmeler için güçlü bir yapı sunar.",
    },
    faq: {
      eyebrow: "SSS",
      title: "Demo görüşmeleri için net yanıtlar.",
      description: "Bunlar, bir otel sahibinin demo planlamadan once sormasi en olasi sorular.",
      items: [
        {
          question: "Tugobo AI kimler için uygun?",
          answer:
            "Tugobo AI; oteller, butik oteller, villalar, bungalow işletmeleri ve direkt rezervasyon taleplerini yöneten diğer konaklama işletmeleri için tasarlanmıştır.",
        },
        {
          question: "Rezervasyon ekibimin yerini alir mi?",
          answer:
            "Hayır. İlk yanıtı veren, rezervasyon detaylarını toplayan ve ekibin geliri daha kolay kapatmasını sağlayan dijital bir resepsiyonist gibi çalışır.",
        },
        {
          question: "Hangi kanalları destekliyor?",
          answer:
            "Mevcut ürün deneyimi, WhatsApp, Instagram DM ve web chat üzerinde tek bir yapay zeka destekli akış etrafında tasarlanmıştır.",
        },
      ],
    },
    cta: {
      eyebrow: "Demo Talep Et",
      title: "Ekibiniz yanıt vermeden önce işletmenizin kaç rezervasyon kaçırdığını görün.",
      description:
        "Tugobo AI'ın nasıl anında yanıt verdiğini, kaçan talepleri nasıl azalttığını ve işletmenizin OTA bağımlılığını düşürerek daha fazla direkt rezervasyon dönüşümü elde etmesine nasıl yardımcı olduğunu görmek için demo talep edin.",
      request: "Demo Talep Et",
      view: "Canlı Demoyu Gör",
    },
    mobile: {
      title: "Tugobo AI",
      description: "İşletmeniz için nasıl çalıştığını görün",
    },
    preview: {
      liveConversationDemo: "Canlı konuşma demosu",
      guestConversation: "Misafir konusmasi",
      guestName: "Anna Muller",
      guestMeta: "WhatsApp talebi • Deluxe Sea View ilgisi",
      aiReply: "Yapay zeka yanıtı",
      guestIntentDetected: "Misafir niyeti algilandi",
      aiIsReplying: "Yapay zeka yanıtlıyor",
      reservationSummary: "Rezervasyon ozeti",
      reservationReady: "Rezervasyona hazir",
      inProgress: "Isleniyor",
      stay: "Konaklama",
      stayValue: "21 Tem - 24 Tem • 2 yetişkin",
      suggestedRoom: "Onerilen oda",
      suggestedRoomValue: "Deluxe Sea View Room",
      estimatedValue: "Tahmini değer",
      nextAction: "Sıradaki adım",
      nextActionReady: "Son teklifi gonderin ve rezervasyonu olusturun.",
      nextActionPending: "Yapay zeka oda tercihi ve butce bilgilerini topluyor.",
      confirmationStatus: "Onay durumu",
      confirmationReady: "Rezervasyon onayı için hazır",
      confirmationPending: "Son yapay zeka önerisi bekleniyor",
      openLiveDemo: "Canlı demoyu aç",
      footerText: "Tek bir misafir talebinin rezervasyon onayına nasıl ilerlediğini gösteren odaklı bir demo.",
      steps: [
        { id: "guest-1", type: "guest" as const, content: "Merhaba, 21-24 Temmuz arasında iki yetişkin için odanız var mı?" },
        { id: "typing-1", type: "typing" as const },
        { id: "assistant-1", type: "assistant" as const, content: "Evet, bu tarihler için müsaitliğimiz var. Deniz manzaralı oda ister misiniz? Rezervasyon 2 yetişkin için mi?" },
        { id: "guest-2", type: "guest" as const, content: "Deniz manzarası harika olur. Bütçem yaklaşık 750 EUR." },
        { id: "typing-2", type: "typing" as const },
        { id: "assistant-2", type: "assistant" as const, content: "Harika. 21-24 Temmuz için Deluxe Sea View Room öneriyorum. İsterseniz rezervasyon onayı için hazırlayabilirim." },
      ],
    },
  },
  en: {
    problem: {
      eyebrow: "Problem",
      title: "Most properties do not lose demand because of lack of interest. They lose it because they reply too late.",
      description:
        "A guest asks about dates, price, or room options. If the reply comes late, the booking often moves to an OTA or another property. For accommodation operators, slow messaging quietly reduces direct revenue every day.",
      items: [
        "Late replies let ready-to-book guests move on to another property.",
        "Late-night inquiries sit unanswered while direct revenue slips away.",
        "Manual messaging slows staff down exactly when demand is highest.",
        "Paid traffic gets expensive when inbound chats do not convert.",
        "OTA dependency grows when direct inquiries are not closed fast enough.",
        "Teams lose booking context across channels, shifts, and staff handoffs.",
      ],
    },
    solution: {
      eyebrow: "Solution",
      title: "Tugobo AI is a booking conversion system for accommodation businesses.",
      description:
        "It responds instantly, collects the details that matter, recommends the right offer, and gives your staff a cleaner path to close direct reservations faster.",
      items: [
        "Receives guest messages from WhatsApp, Instagram DM, and web chat",
        "Replies instantly with a property-ready hospitality tone",
        "Understands dates, guest count, room preference, and budget",
        "Suggests the right room or a higher-fit alternative offer",
        "Prepares reservation-ready conversations instead of loose chat threads",
        "Helps your team close more direct bookings with full context",
      ],
    },
    channels: {
      eyebrow: "Channels",
      title: "All guest conversations in one AI-powered flow.",
      description:
        "Instead of chasing messages across apps, your team gets one consistent booking intake flow across the channels guests already use.",
      items: [
        ["WhatsApp", "Capture high-intent reservation requests from mobile-first guests."],
        ["Instagram DM", "Convert social traffic into real booking conversations."],
        ["Web Chat", "Turn website visitors into direct reservation opportunities."],
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "Built to increase direct booking conversion, not just automate replies.",
      description:
        "Tugobo AI helps properties respond faster, miss fewer inquiries, reduce OTA dependence, and move more guest conversations toward confirmed reservations.",
      items: [
        "Reply 24/7 without adding overnight staffing",
        "Reduce missed direct bookings caused by delayed replies",
        "Move faster from first message to confirmed stay",
        "Support reservation staff with AI instead of replacing them",
        "Keep all guest inquiries organized in one booking flow",
      ],
    },
    howItWorks: {
      eyebrow: "How It Works",
      title: "A simple 3-step flow for faster booking conversion.",
      description:
        "The handoff is intentionally clear so accommodation teams see exactly how AI supports response speed while staff stays in control of the close.",
      items: [
        ["1", "Guest sends message", "The inquiry arrives from WhatsApp, Instagram DM, or website chat."],
        ["2", "AI responds and analyzes intent", "Dates, guests, budget, and room preference are captured in real time."],
        ["3", "Staff confirms or creates reservation", "Your team steps in with context, offer details, and a faster close path."],
      ],
    },
    positioning: {
      eyebrow: "Positioning",
      title: "AI reservation assistant, digital receptionist, booking conversion system.",
      description:
        "Tugobo AI acts like an AI reservation assistant and digital receptionist, but the business outcome is clearer: more direct booking conversations moved toward revenue.",
      testimonials: [
        "We could immediately see how this would stop late-night booking leakage.",
        "It feels less like a chatbot and more like a reservation assistant for our team.",
      ],
      authors: ["Boutique Hotel Owner", "Villa Operations Manager"],
      fitLabel: "Fit",
      fit: "Best for properties that want more direct booking conversion without depending only on OTAs.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Clear answers for demo conversations.",
      description: "These are the questions a hotel owner is likely to ask before booking a walkthrough.",
      items: [
        {
          question: "Who is Tugobo AI for?",
          answer:
            "Tugobo AI is built for hotels, boutique hotels, villas, bungalow operators, and other accommodation businesses handling direct reservation inquiries.",
        },
        {
          question: "Does it replace my reservation team?",
          answer:
            "No. It works as a digital receptionist that handles first-response intake, collects booking details, and gives your team a cleaner path to close revenue.",
        },
        {
          question: "Which channels does it support?",
          answer:
            "The current product experience is designed around WhatsApp, Instagram DM, and website chat in one AI-powered workflow.",
        },
      ],
    },
    cta: {
      eyebrow: "Request Demo",
      title: "See how many bookings your property may be missing before your team even replies.",
      description:
        "Request a demo to see how Tugobo AI can respond instantly, reduce missed inquiries, and help your property convert more direct bookings with less dependence on OTAs.",
      request: "Request Demo",
      view: "View Live Demo",
    },
    mobile: {
      title: "Tugobo AI",
      description: "See how it works for your property",
    },
    preview: {
      liveConversationDemo: "Live conversation demo",
      guestConversation: "Guest conversation",
      guestName: "Anna Muller",
      guestMeta: "WhatsApp inquiry • Deluxe Sea View interest",
      aiReply: "AI reply",
      guestIntentDetected: "Guest intent detected",
      aiIsReplying: "AI is replying",
      reservationSummary: "Reservation summary",
      reservationReady: "Reservation ready",
      inProgress: "In progress",
      stay: "Stay",
      stayValue: "21 Jul - 24 Jul • 2 adults",
      suggestedRoom: "Suggested room",
      suggestedRoomValue: "Deluxe Sea View Room",
      estimatedValue: "Estimated value",
      nextAction: "Next action",
      nextActionReady: "Send the final offer and create the reservation.",
      nextActionPending: "AI is collecting room preference and budget.",
      confirmationStatus: "Confirmation status",
      confirmationReady: "Ready for reservation confirmation",
      confirmationPending: "Waiting for final AI suggestion",
      openLiveDemo: "Open live demo",
      footerText: "A focused demo of one guest inquiry moving toward reservation confirmation.",
      steps: [
        { id: "guest-1", type: "guest" as const, content: "Hi, do you have a room from July 21 to July 24 for two adults?" },
        { id: "typing-1", type: "typing" as const },
        { id: "assistant-1", type: "assistant" as const, content: "Yes. We have availability for those dates. Would you prefer sea view, and is this for 2 adults only?" },
        { id: "guest-2", type: "guest" as const, content: "Sea view is perfect. Budget is around 750 EUR." },
        { id: "typing-2", type: "typing" as const },
        { id: "assistant-2", type: "assistant" as const, content: "Perfect. I recommend the Deluxe Sea View Room for 21-24 July. I can prepare it for reservation confirmation." },
      ],
    },
  },
} as const;

function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  invert?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-xs font-semibold uppercase tracking-[0.28em] ${
          invert ? "text-cyan-300" : "text-sky-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.85rem] ${
          invert ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p className={`mt-5 max-w-2xl text-[1.05rem] leading-8 ${invert ? "text-slate-300" : "text-slate-600"}`}>
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("tr");
  const copy = content[language];
  const sectionCopy = sectionContent[language];

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f7fb] text-slate-900">
      <div className="sticky top-0 z-40 border-b border-white/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Tugobo AI</p>
            <p className="mt-1 text-sm text-slate-300">{copy.brandTagline}</p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              {(["tr", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    language === lang ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {copy.language[lang]}
                </button>
              ))}
            </div>
            <Link
              href="/conversations"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/50 hover:bg-white/10"
            >
              {copy.headerDemo}
            </Link>
            <Link
              href="#request-demo"
              className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_-16px_rgba(56,189,248,0.9)] transition hover:brightness-105"
            >
              {copy.headerBook}
            </Link>
          </div>
        </div>
      </div>

      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.02fr_minmax(440px,1fr)] lg:items-start lg:pb-28 lg:pt-24">
          <div className="relative z-10 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-cyan-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
              <span className="live-dot inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              {copy.heroPill}
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl xl:text-7xl">
              {copy.heroTitleStart}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                {copy.heroTitleAccent}
              </span>
              {copy.heroTitleEnd}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{copy.heroDescription}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="#request-demo"
                className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_22px_40px_-22px_rgba(56,189,248,0.95)] transition hover:scale-[1.01] hover:brightness-105"
              >
                {copy.requestDemo}
              </Link>
              <Link
                href="/conversations"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/10"
              >
                {copy.viewLiveDemo}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {copy.floatingTags.map((tag, index) => (
                <div
                  key={tag}
                  className="floating-badge rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-slate-100 backdrop-blur"
                  style={{ animationDelay: `${index * 0.45}s` }}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {copy.heroSignals.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur"
                >
                  <p className="text-3xl font-semibold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <HomeHeroPreview copy={sectionCopy.preview} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff,#eef4fb)]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="section-accent absolute left-6 top-14 h-28 w-28 rounded-full bg-rose-200/30 blur-3xl" />
          <SectionHeading
            eyebrow={sectionCopy.problem.eyebrow}
            title={sectionCopy.problem.title}
            description={sectionCopy.problem.description}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sectionCopy.problem.items.map((point) => (
            <div
              key={point}
              className="interactive-card premium-card rounded-[30px] border border-white/80 bg-white/88 p-7 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-lg font-semibold text-rose-600 shadow-sm">
                -
              </div>
              <p className="mt-5 text-base leading-7 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-slate-200/70 bg-[linear-gradient(180deg,#ffffff,#f5f9ff)]">
        <div className="section-accent absolute right-0 top-8 h-48 w-48 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <SectionHeading
            eyebrow={sectionCopy.solution.eyebrow}
            title={sectionCopy.solution.title}
            description={sectionCopy.solution.description}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionCopy.solution.items.map((item, index) => (
              <div
                key={item}
                className="interactive-card premium-card rounded-[28px] border border-slate-200/80 bg-white/92 p-6"
              >
                <p className="text-sm font-semibold text-sky-700">0{index + 1}</p>
                <p className="mt-3 text-base leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f7fb,#ffffff)]">
        <div className="section-accent absolute left-1/3 top-0 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow={sectionCopy.channels.eyebrow}
            title={sectionCopy.channels.title}
            description={sectionCopy.channels.description}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sectionCopy.channels.items.map(([title, description], index) => (
              <div
                key={title}
                className="interactive-card premium-card rounded-[30px] border border-slate-200/80 bg-white/92 p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      index === 0
                        ? "bg-emerald-50 text-emerald-700"
                        : index === 1
                          ? "bg-fuchsia-50 text-fuchsia-700"
                          : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {title}
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.16)]" />
                </div>
                <p className="mt-5 text-base leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-slate-200 bg-slate-950">
        <div className="section-accent absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            eyebrow={sectionCopy.benefits.eyebrow}
            title={sectionCopy.benefits.title}
            description={sectionCopy.benefits.description}
            invert
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {sectionCopy.benefits.items.map((benefit) => (
              <div
                key={benefit}
                className="interactive-card rounded-[28px] border border-white/10 bg-white/6 p-6 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_40px_-34px_rgba(8,145,178,0.28)]"
              >
                <p className="text-base leading-7">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff,#eff5fb)]">
        <div className="section-accent absolute right-8 top-8 h-40 w-40 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow={sectionCopy.howItWorks.eyebrow}
            title={sectionCopy.howItWorks.title}
            description={sectionCopy.howItWorks.description}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {sectionCopy.howItWorks.items.map(([step, title, description]) => (
              <div
                key={step}
                className="interactive-card premium-card relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/92 p-7"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">
                  {step}
                </div>
                <h3 className="mt-5 text-[1.35rem] font-semibold tracking-tight text-slate-950">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-[linear-gradient(180deg,#f8fbfd,#eef5fb)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow={sectionCopy.positioning.eyebrow}
              title={sectionCopy.positioning.title}
              description={sectionCopy.positioning.description}
            />
          </div>
          <div className="grid gap-4">
            {sectionCopy.positioning.testimonials.map((item, index) => (
              <div
                key={sectionCopy.positioning.authors[index]}
                className="interactive-card premium-card rounded-[30px] border border-slate-200/80 bg-white/92 p-7"
              >
                <p className="text-xl leading-8 text-slate-700">&ldquo;{item}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-slate-500">{sectionCopy.positioning.authors[index]}</p>
              </div>
            ))}
            <div className="interactive-card premium-card rounded-[30px] border border-sky-100 bg-[linear-gradient(135deg,#eff6ff,#ecfeff)] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{sectionCopy.positioning.fitLabel}</p>
              <p className="mt-3 text-base leading-7 text-slate-700">{sectionCopy.positioning.fit}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f4f8fc)]">
        <div className="section-accent absolute left-10 top-8 h-36 w-36 rounded-full bg-sky-100/50 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow={sectionCopy.faq.eyebrow}
            title={sectionCopy.faq.title}
            description={sectionCopy.faq.description}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {sectionCopy.faq.items.map((item) => (
              <div
                key={item.question}
                className="interactive-card premium-card rounded-[30px] border border-slate-200/80 bg-white/94 p-7"
              >
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.question}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request-demo" className="relative overflow-hidden bg-slate-950">
        <div className="hero-orb hero-orb-left opacity-60" />
        <div className="hero-orb hero-orb-right opacity-45" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{sectionCopy.cta.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{sectionCopy.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">{sectionCopy.cta.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="mailto:demo@tugobo.ai?subject=Request%20Demo"
              className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_22px_40px_-22px_rgba(56,189,248,0.95)] transition hover:brightness-105"
            >
              {sectionCopy.cta.request}
            </Link>
            <Link
              href="/conversations"
              className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/10"
            >
              {sectionCopy.cta.view}
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 sm:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-full border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)] backdrop-blur">
          <div>
            <p className="text-sm font-semibold text-slate-900">{sectionCopy.mobile.title}</p>
            <p className="text-xs text-slate-500">{sectionCopy.mobile.description}</p>
          </div>
          <Link
            href="#request-demo"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            {copy.requestDemo}
          </Link>
        </div>
      </div>
    </main>
  );
}
