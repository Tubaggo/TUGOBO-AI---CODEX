import type { PricingRule, RoomType } from "../domain";
import type { NightlyPriceItem } from "./types";

function eachNight(checkIn: string, checkOut: string): Date[] {
  const nights: Date[] = [];
  const current = new Date(checkIn);
  const end = new Date(checkOut);

  while (current < end) {
    nights.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return nights;
}

function findRuleForNight(date: Date, rules: PricingRule[], roomTypeId: string): PricingRule | null {
  return (
    rules.find((rule) => {
      if (!rule.isActive || rule.roomTypeId !== roomTypeId) {
        return false;
      }

      const start = new Date(rule.startDate);
      const end = new Date(rule.endDate);
      return date >= start && date <= end;
    }) ?? null
  );
}

export function calculatePricing(input: {
  roomType: RoomType;
  pricingRules: PricingRule[];
  checkIn: string;
  checkOut: string;
}): { breakdown: NightlyPriceItem[]; total: number; appliedRule: PricingRule | null } {
  const nights = eachNight(input.checkIn, input.checkOut);
  let appliedRule: PricingRule | null = null;

  const breakdown = nights.map((night) => {
    const rule = findRuleForNight(night, input.pricingRules, input.roomType.id);
    if (rule) {
      appliedRule = rule;
    }

    return {
      date: night.toISOString(),
      nightlyRate: rule?.pricePerNight ?? input.roomType.basePrice,
      currency: input.roomType.currency,
    };
  });

  return {
    breakdown,
    total: breakdown.reduce((sum, item) => sum + item.nightlyRate, 0),
    appliedRule,
  };
}
