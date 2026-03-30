import type { PricingRule, RoomType } from "../domain/types";
import type { NightlyPriceItem } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MIN_SEASONAL_MULTIPLIER = 1;
const MAX_SEASONAL_MULTIPLIER = 1.5;
const MAX_REALISTIC_TOTAL = 5000;

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

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

function roundCurrency(value: number): number {
  return Number(value.toFixed(2));
}

function getNightCount(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (!isValidDate(start) || !isValidDate(end) || end <= start) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
}

function getSeasonalNightlyRate(roomType: RoomType, rule: PricingRule | null): number {
  const baseRate = Math.max(0, roomType.basePrice);

  if (!rule) {
    return baseRate;
  }

  const rawMultiplier = baseRate > 0 ? rule.pricePerNight / baseRate : MIN_SEASONAL_MULTIPLIER;
  const safeMultiplier = Math.min(
    MAX_SEASONAL_MULTIPLIER,
    Math.max(MIN_SEASONAL_MULTIPLIER, rawMultiplier),
  );

  return roundCurrency(baseRate * safeMultiplier);
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
  const nightCount = getNightCount(input.checkIn, input.checkOut);

  if (nightCount === 0) {
    return {
      breakdown: [],
      total: 0,
      appliedRule: null,
    };
  }

  const nights = eachNight(input.checkIn, input.checkOut);
  let appliedRule: PricingRule | null = null;

  const breakdown = nights.map((night) => {
    const rule = findRuleForNight(night, input.pricingRules, input.roomType.id);
    if (rule) {
      appliedRule = rule;
    }

    return {
      date: night.toISOString(),
      nightlyRate: getSeasonalNightlyRate(input.roomType, rule),
      currency: input.roomType.currency,
    };
  });

  const rawTotal = breakdown.reduce((sum, item) => sum + item.nightlyRate, 0);
  const total = roundCurrency(Math.min(MAX_REALISTIC_TOTAL, Math.max(0, rawTotal)));

  return {
    breakdown,
    total,
    appliedRule,
  };
}
