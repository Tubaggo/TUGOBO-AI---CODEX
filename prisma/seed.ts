import {
  AutomationFlowType,
  BillingCycle,
  BusinessType,
  ChannelStatus,
  ChannelType,
  ConversationIntent,
  ConversationStatus,
  KnowledgeBaseCategory,
  LeadPriority,
  LeadStatus,
  LeadTemperature,
  MembershipRole,
  MessageSenderType,
  MessageType,
  PlanCode,
  PlatformRoleType,
  PropertyType,
  ReservationStatus,
  ResponseStyle,
  SubscriptionStatus,
  Prisma,
  UsageMetricType,
} from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.automationFlow.deleteMany();
  await prisma.internalNote.deleteMany();
  await prisma.message.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.knowledgeBaseEntry.deleteMany();
  await prisma.assistantConfig.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.property.deleteMany();
  await prisma.usageMetric.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  const superAdmin = await prisma.user.create({
    data: {
      fullName: "Tugobo Platform Admin",
      email: "admin@tugobo.ai",
      phone: "+90 212 000 0000",
      passwordHash: "demo-super-admin-hash",
      roleType: PlatformRoleType.SUPER_ADMIN,
      isActive: true,
    },
  });

  const [tenantA, tenantB] = await Promise.all([
    prisma.tenant.create({
      data: {
        name: "Blue Cove Hotel",
        slug: "blue-cove-hotel",
        businessType: BusinessType.BOUTIQUE_HOTEL,
        phone: "+90 252 111 2233",
        email: "info@bluecovehotel.com",
        website: "https://bluecovehotel.example",
        country: "Turkey",
        city: "Fethiye",
        address: "Karagozler Mah. 18, Fethiye",
        timezone: "Europe/Istanbul",
        currency: "EUR",
      },
    }),
    prisma.tenant.create({
      data: {
        name: "Sunset Valley Bungalows",
        slug: "sunset-valley-bungalows",
        businessType: BusinessType.BUNGALOW,
        phone: "+90 242 444 5566",
        email: "hello@sunsetvalleybungalows.com",
        website: "https://sunsetvalley.example",
        country: "Turkey",
        city: "Kas",
        address: "Cukurbag Yarimadasi, Kas",
        timezone: "Europe/Istanbul",
        currency: "EUR",
      },
    }),
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        fullName: "Deniz Arslan",
        email: "deniz@bluecovehotel.com",
        phone: "+90 533 111 0001",
        passwordHash: "demo-owner-hash",
        roleType: PlatformRoleType.OWNER,
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Selin Kaya",
        email: "selin@bluecovehotel.com",
        phone: "+90 533 111 0002",
        passwordHash: "demo-manager-hash",
        roleType: PlatformRoleType.MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Mert Demir",
        email: "mert@bluecovehotel.com",
        phone: "+90 533 111 0003",
        passwordHash: "demo-staff-hash",
        roleType: PlatformRoleType.RESERVATION_STAFF,
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Ece Yildiz",
        email: "ece@sunsetvalleybungalows.com",
        phone: "+90 533 222 0001",
        passwordHash: "demo-owner-2-hash",
        roleType: PlatformRoleType.OWNER,
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Kaan Guler",
        email: "kaan@sunsetvalleybungalows.com",
        phone: "+90 533 222 0002",
        passwordHash: "demo-staff-2-hash",
        roleType: PlatformRoleType.RESERVATION_STAFF,
      },
    }),
  ]);

  await prisma.membership.createMany({
    data: [
      { tenantId: tenantA.id, userId: users[0].id, role: MembershipRole.OWNER },
      { tenantId: tenantA.id, userId: users[1].id, role: MembershipRole.MANAGER },
      { tenantId: tenantA.id, userId: users[2].id, role: MembershipRole.RESERVATION_STAFF },
      { tenantId: tenantB.id, userId: users[3].id, role: MembershipRole.OWNER },
      { tenantId: tenantB.id, userId: users[4].id, role: MembershipRole.RESERVATION_STAFF },
    ],
  });

  await prisma.subscription.createMany({
    data: [
      {
        tenantId: tenantA.id,
        planName: "Growth",
        planCode: PlanCode.GROWTH,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        startedAt: new Date("2026-01-01T00:00:00.000Z"),
        stripeCustomerId: "cus_blue_cove_demo",
        stripeSubscriptionId: "sub_blue_cove_demo",
      },
      {
        tenantId: tenantB.id,
        planName: "Starter",
        planCode: PlanCode.STARTER,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.TRIALING,
        startedAt: new Date("2026-03-01T00:00:00.000Z"),
        endsAt: new Date("2026-03-31T23:59:59.000Z"),
        stripeCustomerId: "cus_sunset_demo",
        stripeSubscriptionId: "sub_sunset_demo",
      },
    ],
  });

  const [blueCoveMain, blueCoveVilla, sunsetValley] = await Promise.all([
    prisma.property.create({
      data: {
        tenantId: tenantA.id,
        name: "Blue Cove Main House",
        propertyType: PropertyType.BOUTIQUE_HOTEL,
        description: "Seafront boutique hotel with marina access.",
        city: "Fethiye",
        country: "Turkey",
        address: "Karagozler Mah. 18, Fethiye",
        latitude: new Prisma.Decimal("36.6212345"),
        longitude: new Prisma.Decimal("29.1154321"),
        phone: "+90 252 111 2233",
        email: "stay@bluecovehotel.com",
        checkInTime: "14:00",
        checkOutTime: "11:00",
        amenitiesJson: ["pool", "breakfast", "wifi", "marina-shuttle"],
      },
    }),
    prisma.property.create({
      data: {
        tenantId: tenantA.id,
        name: "Blue Cove Hillside Villas",
        propertyType: PropertyType.VILLA,
        description: "Private villas for families and long-stay guests.",
        city: "Fethiye",
        country: "Turkey",
        address: "Kayakoy Yolu 9, Fethiye",
        latitude: new Prisma.Decimal("36.5900000"),
        longitude: new Prisma.Decimal("29.0800000"),
        phone: "+90 252 111 2244",
        email: "villas@bluecovehotel.com",
        checkInTime: "15:00",
        checkOutTime: "11:00",
        amenitiesJson: ["private-pool", "kitchen", "wifi"],
      },
    }),
    prisma.property.create({
      data: {
        tenantId: tenantB.id,
        name: "Sunset Valley Riverside",
        propertyType: PropertyType.BUNGALOW,
        description: "Nature-focused bungalows with river and mountain views.",
        city: "Kas",
        country: "Turkey",
        address: "Cukurbag Yarimadasi, Kas",
        latitude: new Prisma.Decimal("36.1980000"),
        longitude: new Prisma.Decimal("29.6350000"),
        phone: "+90 242 444 5566",
        email: "bookings@sunsetvalleybungalows.com",
        checkInTime: "14:00",
        checkOutTime: "11:30",
        amenitiesJson: ["garden", "wifi", "parking", "breakfast"],
      },
    }),
  ]);

  const roomTypes = await Promise.all([
    prisma.roomType.create({
      data: {
        propertyId: blueCoveMain.id,
        name: "Deluxe Sea View Room",
        code: "DLX-SV",
        description: "Sea view room with balcony and breakfast included.",
        capacityAdults: 2,
        capacityChildren: 1,
        basePrice: new Prisma.Decimal("185.00"),
        currency: "EUR",
        amenitiesJson: ["balcony", "sea-view", "breakfast"],
      },
    }),
    prisma.roomType.create({
      data: {
        propertyId: blueCoveVilla.id,
        name: "Family Villa",
        code: "FAM-VILLA",
        description: "Two-bedroom villa for families and small groups.",
        capacityAdults: 4,
        capacityChildren: 2,
        basePrice: new Prisma.Decimal("420.00"),
        currency: "EUR",
        amenitiesJson: ["private-pool", "kitchen", "terrace"],
      },
    }),
    prisma.roomType.create({
      data: {
        propertyId: sunsetValley.id,
        name: "Riverfront Bungalow",
        code: "RIV-BNG",
        description: "Romantic bungalow with river-facing terrace.",
        capacityAdults: 2,
        capacityChildren: 1,
        basePrice: new Prisma.Decimal("145.00"),
        currency: "EUR",
        amenitiesJson: ["terrace", "river-view", "breakfast"],
      },
    }),
  ]);

  await prisma.pricingRule.createMany({
    data: [
      {
        propertyId: blueCoveMain.id,
        roomTypeId: roomTypes[0].id,
        name: "Summer Peak 2026",
        seasonName: "Summer",
        startDate: new Date("2026-06-15T00:00:00.000Z"),
        endDate: new Date("2026-09-15T00:00:00.000Z"),
        minNights: 2,
        pricePerNight: new Prisma.Decimal("220.00"),
        currency: "EUR",
      },
      {
        propertyId: sunsetValley.id,
        roomTypeId: roomTypes[2].id,
        name: "Spring Escape",
        seasonName: "Spring",
        startDate: new Date("2026-04-01T00:00:00.000Z"),
        endDate: new Date("2026-05-31T00:00:00.000Z"),
        minNights: 2,
        pricePerNight: new Prisma.Decimal("160.00"),
        currency: "EUR",
      },
    ],
  });

  const channels = await Promise.all([
    prisma.channel.create({
      data: {
        tenantId: tenantA.id,
        type: ChannelType.WHATSAPP,
        displayName: "Blue Cove WhatsApp",
        status: ChannelStatus.CONNECTED,
        externalAccountId: "wa_blue_cove_001",
        webhookUrl: "https://hooks.example.com/blue-cove/whatsapp",
        metadataJson: { phoneNumber: "+90 252 111 2233" },
        connectedAt: new Date("2026-01-05T09:00:00.000Z"),
      },
    }),
    prisma.channel.create({
      data: {
        tenantId: tenantA.id,
        type: ChannelType.INSTAGRAM,
        displayName: "Blue Cove Instagram",
        status: ChannelStatus.CONNECTED,
        externalAccountId: "ig_blue_cove_001",
        webhookUrl: "https://hooks.example.com/blue-cove/instagram",
        metadataJson: { handle: "@bluecovehotel" },
        connectedAt: new Date("2026-01-05T09:10:00.000Z"),
      },
    }),
    prisma.channel.create({
      data: {
        tenantId: tenantB.id,
        type: ChannelType.WEBCHAT,
        displayName: "Sunset Valley Webchat",
        status: ChannelStatus.CONNECTED,
        externalAccountId: "web_sunset_001",
        webhookUrl: "https://hooks.example.com/sunset/webchat",
        metadataJson: { widgetId: "widget_sunset_main" },
        connectedAt: new Date("2026-03-02T10:00:00.000Z"),
      },
    }),
  ]);

  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        tenantId: tenantA.id,
        channelId: channels[0].id,
        assignedUserId: users[2].id,
        guestName: "Anna Muller",
        guestPhone: "+49 151 234 5678",
        guestEmail: "anna.muller@example.com",
        guestLanguage: "en",
        status: ConversationStatus.OPEN,
        source: ChannelType.WHATSAPP,
        intent: ConversationIntent.AVAILABILITY_CHECK,
        aiEnabled: true,
        humanHandoff: false,
        tagsJson: ["High Budget", "Returning Guest"],
        firstMessageAt: new Date("2026-03-12T08:05:00.000Z"),
        lastMessageAt: new Date("2026-03-12T08:10:00.000Z"),
      },
    }),
    prisma.conversation.create({
      data: {
        tenantId: tenantA.id,
        channelId: channels[1].id,
        assignedUserId: users[1].id,
        guestName: "Lina Torres",
        guestLanguage: "en",
        status: ConversationStatus.WAITING,
        source: ChannelType.INSTAGRAM,
        intent: ConversationIntent.PRICE_REQUEST,
        aiEnabled: false,
        humanHandoff: true,
        tagsJson: ["Group Booking"],
        firstMessageAt: new Date("2026-03-11T14:20:00.000Z"),
        lastMessageAt: new Date("2026-03-11T14:38:00.000Z"),
      },
    }),
    prisma.conversation.create({
      data: {
        tenantId: tenantB.id,
        channelId: channels[2].id,
        assignedUserId: users[4].id,
        guestName: "Ahmet Kaya",
        guestPhone: "+90 555 778 8899",
        guestLanguage: "tr",
        status: ConversationStatus.RESOLVED,
        source: ChannelType.WEBCHAT,
        intent: ConversationIntent.RESERVATION_REQUEST,
        aiEnabled: true,
        humanHandoff: false,
        tagsJson: ["Weekend Stay"],
        firstMessageAt: new Date("2026-03-10T19:00:00.000Z"),
        lastMessageAt: new Date("2026-03-10T19:14:00.000Z"),
      },
    }),
  ]);

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        tenantId: tenantA.id,
        conversationId: conversations[0].id,
        assignedUserId: users[2].id,
        fullName: "Anna Muller",
        email: "anna.muller@example.com",
        phone: "+49 151 234 5678",
        language: "en",
        checkIn: new Date("2026-07-15T00:00:00.000Z"),
        checkOut: new Date("2026-07-18T00:00:00.000Z"),
        guestCount: 2,
        childCount: 0,
        roomTypePreference: "Deluxe Sea View Room",
        budget: new Prisma.Decimal("700.00"),
        estimatedValue: new Prisma.Decimal("660.00"),
        currency: "EUR",
        sourceChannel: ChannelType.WHATSAPP,
        status: LeadStatus.QUALIFIED,
        priority: LeadPriority.HIGH,
        temperature: LeadTemperature.HOT,
        tagsJson: ["VIP", "Returning Guest"],
        lastActivityAt: new Date("2026-03-12T08:10:00.000Z"),
      },
    }),
    prisma.lead.create({
      data: {
        tenantId: tenantA.id,
        conversationId: conversations[1].id,
        assignedUserId: users[1].id,
        fullName: "Lina Torres",
        email: "lina.torres@example.com",
        language: "en",
        checkIn: new Date("2026-08-03T00:00:00.000Z"),
        checkOut: new Date("2026-08-07T00:00:00.000Z"),
        guestCount: 5,
        childCount: 1,
        roomTypePreference: "Family Villa",
        budget: new Prisma.Decimal("1800.00"),
        estimatedValue: new Prisma.Decimal("1680.00"),
        currency: "EUR",
        sourceChannel: ChannelType.INSTAGRAM,
        status: LeadStatus.OFFER_SENT,
        priority: LeadPriority.HIGH,
        temperature: LeadTemperature.HOT,
        tagsJson: ["Group Booking"],
        lastActivityAt: new Date("2026-03-11T14:38:00.000Z"),
      },
    }),
    prisma.lead.create({
      data: {
        tenantId: tenantB.id,
        conversationId: conversations[2].id,
        assignedUserId: users[4].id,
        fullName: "Ahmet Kaya",
        phone: "+90 555 778 8899",
        language: "tr",
        checkIn: new Date("2026-04-18T00:00:00.000Z"),
        checkOut: new Date("2026-04-20T00:00:00.000Z"),
        guestCount: 2,
        childCount: 0,
        roomTypePreference: "Riverfront Bungalow",
        estimatedValue: new Prisma.Decimal("320.00"),
        currency: "EUR",
        sourceChannel: ChannelType.WEBCHAT,
        status: LeadStatus.WON,
        priority: LeadPriority.MEDIUM,
        temperature: LeadTemperature.WARM,
        tagsJson: ["Weekend Stay"],
        lastActivityAt: new Date("2026-03-10T19:14:00.000Z"),
      },
    }),
  ]);

  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        tenantId: tenantA.id,
        leadId: leads[1].id,
        propertyId: blueCoveVilla.id,
        roomTypeId: roomTypes[1].id,
        reservationCode: "BCV-2026-0811",
        guestName: "Lina Torres",
        guestEmail: "lina.torres@example.com",
        checkIn: new Date("2026-08-03T00:00:00.000Z"),
        checkOut: new Date("2026-08-07T00:00:00.000Z"),
        adultCount: 5,
        childCount: 1,
        totalPrice: new Prisma.Decimal("1680.00"),
        currency: "EUR",
        status: ReservationStatus.PENDING,
        notes: "Guest requested airport transfer pricing.",
      },
    }),
    prisma.reservation.create({
      data: {
        tenantId: tenantB.id,
        leadId: leads[2].id,
        propertyId: sunsetValley.id,
        roomTypeId: roomTypes[2].id,
        reservationCode: "SVB-2026-0442",
        guestName: "Ahmet Kaya",
        guestPhone: "+90 555 778 8899",
        checkIn: new Date("2026-04-18T00:00:00.000Z"),
        checkOut: new Date("2026-04-20T00:00:00.000Z"),
        adultCount: 2,
        childCount: 0,
        totalPrice: new Prisma.Decimal("320.00"),
        currency: "EUR",
        status: ReservationStatus.CONFIRMED,
        notes: "Deposit received via bank transfer.",
      },
    }),
  ]);

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversations[0].id,
        senderType: MessageSenderType.GUEST,
        messageType: MessageType.TEXT,
        content: "Hi, do you have availability from July 15 to July 18 for two adults?",
        createdAt: new Date("2026-03-12T08:05:00.000Z"),
      },
      {
        conversationId: conversations[0].id,
        senderType: MessageSenderType.ASSISTANT,
        messageType: MessageType.TEXT,
        content: "Yes, I can help with that. Are you interested in our sea view room options?",
        createdAt: new Date("2026-03-12T08:06:00.000Z"),
      },
      {
        conversationId: conversations[0].id,
        senderType: MessageSenderType.GUEST,
        messageType: MessageType.TEXT,
        content: "Yes, preferably with a balcony. My budget is around 700 EUR.",
        createdAt: new Date("2026-03-12T08:10:00.000Z"),
      },
      {
        conversationId: conversations[1].id,
        senderType: MessageSenderType.GUEST,
        messageType: MessageType.TEXT,
        content: "Hello, we are 5 adults and 1 child. What is the price for a villa in August?",
        createdAt: new Date("2026-03-11T14:20:00.000Z"),
      },
      {
        conversationId: conversations[1].id,
        senderType: MessageSenderType.HUMAN,
        senderUserId: users[1].id,
        messageType: MessageType.TEXT,
        content: "I have prepared an offer for a 4-night stay and will send the breakdown shortly.",
        createdAt: new Date("2026-03-11T14:38:00.000Z"),
      },
      {
        conversationId: conversations[2].id,
        senderType: MessageSenderType.GUEST,
        messageType: MessageType.TEXT,
        content: "Merhaba, 18 Nisan giris 20 Nisan cikis 2 kisi icin bungalow uygun mu?",
        createdAt: new Date("2026-03-10T19:00:00.000Z"),
      },
      {
        conversationId: conversations[2].id,
        senderType: MessageSenderType.ASSISTANT,
        messageType: MessageType.TEXT,
        content: "Merhaba, belirtilen tarihler icin uygunluk mevcut. Iletisim numaranizi paylasabilir misiniz?",
        createdAt: new Date("2026-03-10T19:03:00.000Z"),
      },
      {
        conversationId: conversations[2].id,
        senderType: MessageSenderType.GUEST,
        messageType: MessageType.TEXT,
        content: "Tabii, numaram 05557788899.",
        createdAt: new Date("2026-03-10T19:06:00.000Z"),
      },
    ],
  });

  await prisma.internalNote.createMany({
    data: [
      {
        tenantId: tenantA.id,
        conversationId: conversations[1].id,
        leadId: leads[1].id,
        authorUserId: users[1].id,
        content: "Group booking. Offer should include breakfast and private transfer upsell.",
      },
      {
        tenantId: tenantB.id,
        conversationId: conversations[2].id,
        leadId: leads[2].id,
        authorUserId: users[4].id,
        content: "Confirmed guest asked for a quiet bungalow near the garden side.",
      },
    ],
  });

  await prisma.knowledgeBaseEntry.createMany({
    data: [
      {
        tenantId: tenantA.id,
        propertyId: blueCoveMain.id,
        category: KnowledgeBaseCategory.CHECKIN_CHECKOUT,
        title: "Check-in and Check-out",
        content: "Check-in starts at 14:00 and check-out is at 11:00.",
        language: "en",
        sortOrder: 1,
      },
      {
        tenantId: tenantA.id,
        propertyId: blueCoveMain.id,
        category: KnowledgeBaseCategory.AMENITIES,
        title: "Breakfast Service",
        content: "Breakfast is served daily between 07:30 and 10:30 on the terrace.",
        language: "en",
        sortOrder: 2,
      },
      {
        tenantId: tenantB.id,
        propertyId: sunsetValley.id,
        category: KnowledgeBaseCategory.GENERAL,
        title: "Nature Experience",
        content: "Our bungalows are surrounded by nature and offer a quiet riverside setting.",
        language: "tr",
        sortOrder: 1,
      },
    ],
  });

  await prisma.assistantConfig.createMany({
    data: [
      {
        tenantId: tenantA.id,
        tone: "professional, friendly, concise",
        welcomeMessage: "Welcome to Blue Cove Hotel. How can I help with your stay?",
        fallbackMessage: "I will connect you with our reservation team for confirmation.",
        supportedLanguagesJson: ["en", "tr", "de"],
        handoffRulesJson: {
          humanRequestKeywords: ["agent", "human", "staff"],
          lowConfidenceThreshold: 0.55,
          groupBookingMinGuests: 5,
          enableComplaintEscalation: true,
        },
        businessHoursJson: {
          timezone: "Europe/Istanbul",
          weekdays: [
            { day: 1, start: "08:00", end: "22:00", enabled: true },
            { day: 2, start: "08:00", end: "22:00", enabled: true },
            { day: 3, start: "08:00", end: "22:00", enabled: true },
            { day: 4, start: "08:00", end: "22:00", enabled: true },
            { day: 5, start: "08:00", end: "22:00", enabled: true },
            { day: 6, start: "08:00", end: "22:00", enabled: true },
            { day: 0, start: "09:00", end: "20:00", enabled: true }
          ]
        },
        responseStyle: ResponseStyle.BALANCED,
        collectPhone: true,
        collectEmail: true,
        collectDates: true,
      },
      {
        tenantId: tenantB.id,
        tone: "friendly, hospitality-oriented, concise",
        welcomeMessage: "Sunset Valley Bungalows'a hos geldiniz. Tarihlerinizi paylasabilir misiniz?",
        fallbackMessage: "Size en dogru bilgiyi vermek icin ekibimize yonlendiriyorum.",
        supportedLanguagesJson: ["tr", "en"],
        handoffRulesJson: {
          humanRequestKeywords: ["temsilci", "insan", "gorevli"],
          lowConfidenceThreshold: 0.6,
          groupBookingMinGuests: 4,
          enableComplaintEscalation: true,
        },
        businessHoursJson: {
          timezone: "Europe/Istanbul",
          weekdays: [
            { day: 1, start: "09:00", end: "21:00", enabled: true },
            { day: 2, start: "09:00", end: "21:00", enabled: true },
            { day: 3, start: "09:00", end: "21:00", enabled: true },
            { day: 4, start: "09:00", end: "21:00", enabled: true },
            { day: 5, start: "09:00", end: "21:00", enabled: true },
            { day: 6, start: "10:00", end: "20:00", enabled: true },
            { day: 0, start: "10:00", end: "18:00", enabled: true }
          ]
        },
        responseStyle: ResponseStyle.CONCISE,
        collectPhone: true,
        collectEmail: false,
        collectDates: true,
      },
    ],
  });

  await prisma.automationFlow.createMany({
    data: [
      {
        tenantId: tenantA.id,
        name: "Reservation Intake",
        flowType: AutomationFlowType.RESERVATION_INTAKE,
        description: "Collect stay dates, guest count, and preferred room type.",
        configJson: { requiredFields: ["checkIn", "checkOut", "guestCount"] },
        isActive: true,
      },
      {
        tenantId: tenantA.id,
        name: "Human Handoff",
        flowType: AutomationFlowType.HUMAN_HANDOFF,
        description: "Escalate low confidence and group reservation cases.",
        configJson: { triggerTags: ["Group Booking", "Complaint"] },
        isActive: true,
      },
      {
        tenantId: tenantB.id,
        name: "Follow-up",
        flowType: AutomationFlowType.FOLLOW_UP,
        description: "Send follow-up prompt to incomplete reservation inquiries.",
        configJson: { delayMinutes: 30 },
        isActive: true,
      },
    ],
  });

  await prisma.usageMetric.createMany({
    data: [
      {
        tenantId: tenantA.id,
        metricType: UsageMetricType.CONVERSATIONS_COUNT,
        value: 126,
        periodStart: new Date("2026-03-01T00:00:00.000Z"),
        periodEnd: new Date("2026-03-31T23:59:59.000Z"),
      },
      {
        tenantId: tenantA.id,
        metricType: UsageMetricType.LEADS_COUNT,
        value: 34,
        periodStart: new Date("2026-03-01T00:00:00.000Z"),
        periodEnd: new Date("2026-03-31T23:59:59.000Z"),
      },
      {
        tenantId: tenantB.id,
        metricType: UsageMetricType.RESERVATIONS_COUNT,
        value: 12,
        periodStart: new Date("2026-03-01T00:00:00.000Z"),
        periodEnd: new Date("2026-03-31T23:59:59.000Z"),
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: tenantA.id,
        userId: users[1].id,
        entityType: "lead",
        entityId: leads[1].id,
        action: "lead_status_changed",
        metadataJson: { from: "qualified", to: "offer_sent" },
      },
      {
        tenantId: tenantB.id,
        userId: users[4].id,
        entityType: "reservation",
        entityId: reservations[1].id,
        action: "reservation_created",
        metadataJson: { reservationCode: "SVB-2026-0442" },
      },
      {
        tenantId: tenantA.id,
        userId: superAdmin.id,
        entityType: "subscription",
        entityId: tenantA.id,
        action: "subscription_updated",
        metadataJson: { plan: "growth" },
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
