import type { CurrencyCode, PricingRule, Property, RoomType } from "../domain";

export interface AvailabilityPricingRequest {
  checkIn: string | null;
  checkOut: string | null;
  guestCount: number | null;
  childCount: number | null;
  roomTypePreference: string | null;
  budget: number | null;
}

export interface NightlyPriceItem {
  date: string;
  nightlyRate: number;
  currency: CurrencyCode;
}

export interface RoomAvailabilityOption {
  property: Property;
  roomType: RoomType;
  pricingRule: PricingRule | null;
  nightlyBreakdown: NightlyPriceItem[];
  estimatedTotal: number;
  fitsBudget: boolean;
  matchesPreference: boolean;
  availabilityConfidence: number;
  unavailableReason: string | null;
}

export interface AvailabilityPricingResult {
  availableRoomOptions: RoomAvailabilityOption[];
  suggestedBestFit: RoomAvailabilityOption | null;
  fallbackOption: RoomAvailabilityOption | null;
  estimatedTotalPrice: number | null;
  priceBreakdown: NightlyPriceItem[];
  availabilityConfidence: number;
  reasonIfUnavailable: string | null;
  pricingNote: string;
}
