import { evaluateAvailability } from "./availability-engine";
import { calculatePricing } from "./pricing-engine";
import { mockPricingRules } from "./pricing-rules";
import type { AvailabilityPricingRequest, AvailabilityPricingResult, RoomAvailabilityOption } from "./types";

function sortOptions(options: RoomAvailabilityOption[]) {
  return options.sort((left, right) => {
    const preferenceDelta = Number(right.matchesPreference) - Number(left.matchesPreference);
    if (preferenceDelta !== 0) {
      return preferenceDelta;
    }

    const budgetDelta = Number(right.fitsBudget) - Number(left.fitsBudget);
    if (budgetDelta !== 0) {
      return budgetDelta;
    }

    return left.estimatedTotal - right.estimatedTotal;
  });
}

export function suggestRoomOptions(request: AvailabilityPricingRequest): AvailabilityPricingResult | null {
  if (!request.checkIn || !request.checkOut || !request.guestCount) {
    return null;
  }

  const availableRoomOptions = evaluateAvailability(request)
    .filter((option) => !option.unavailableReason)
    .map((option) => {
      const pricing = calculatePricing({
        roomType: option.roomType,
        pricingRules: mockPricingRules,
        checkIn: request.checkIn!,
        checkOut: request.checkOut!,
      });

      return {
        ...option,
        pricingRule: pricing.appliedRule,
        nightlyBreakdown: pricing.breakdown,
        estimatedTotal: pricing.total,
        fitsBudget:
          typeof request.budget === "number" ? pricing.total <= request.budget : option.fitsBudget,
      };
    });

  const sorted = sortOptions(availableRoomOptions);
  const suggestedBestFit = sorted[0] ?? null;
  const fallbackOption = sorted.find((option) => option.roomType.id !== suggestedBestFit?.roomType.id) ?? null;

  if (!suggestedBestFit) {
    return {
      availableRoomOptions: [],
      suggestedBestFit: null,
      fallbackOption: null,
      estimatedTotalPrice: null,
      priceBreakdown: [],
      availabilityConfidence: 0.2,
      reasonIfUnavailable: "No mock room option satisfies the requested dates and guest mix.",
      pricingNote: "Try adjusting dates, guest count, or room preference.",
    };
  }

  return {
    availableRoomOptions: sorted,
    suggestedBestFit,
    fallbackOption,
    estimatedTotalPrice: suggestedBestFit.estimatedTotal,
    priceBreakdown: suggestedBestFit.nightlyBreakdown,
    availabilityConfidence: suggestedBestFit.availabilityConfidence,
    reasonIfUnavailable: null,
    pricingNote: suggestedBestFit.pricingRule
      ? `Seasonal pricing applied: ${suggestedBestFit.pricingRule.name}.`
      : "Base room pricing applied.",
  };
}
