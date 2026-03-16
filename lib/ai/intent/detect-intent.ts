import type { AiDetectedIntent } from "../types/ai-reservation.types";

const intentMatchers: Array<{ intent: AiDetectedIntent; patterns: RegExp[] }> = [
  { intent: "human_handoff", patterns: [/\bhuman\b/i, /\bagent\b/i, /someone from your team/i, /staff/i] },
  { intent: "cancellation_change", patterns: [/cancel/i, /change my booking/i, /modify reservation/i] },
  { intent: "property_info", patterns: [/location/i, /breakfast/i, /parking/i, /check-?in/i, /amenities/i] },
  { intent: "room_preference", patterns: [/sea view/i, /villa/i, /suite/i, /bungalow/i, /room type/i] },
  { intent: "price_request", patterns: [/price/i, /rate/i, /cost/i, /budget/i, /offer/i] },
  { intent: "availability_check", patterns: [/availability/i, /available/i, /free room/i, /vacancy/i] },
  { intent: "reservation_request", patterns: [/book/i, /reservation/i, /stay/i, /check in/i, /check-out/i] },
];

export function detectIntent(message: string): AiDetectedIntent {
  for (const matcher of intentMatchers) {
    if (matcher.patterns.some((pattern) => pattern.test(message))) {
      return matcher.intent;
    }
  }

  return "other";
}
