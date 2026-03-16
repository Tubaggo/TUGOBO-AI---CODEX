import type { RoomType } from "../domain";
import { mockProperties, mockRoomBlackouts, mockRoomTypes } from "./pricing-rules";
import type { AvailabilityPricingRequest, RoomAvailabilityOption } from "./types";

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA <= endB && endA >= startB;
}

function isBlackout(roomTypeId: string, checkIn: string, checkOut: string) {
  const windows = mockRoomBlackouts[roomTypeId] ?? [];
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  return windows.some((window) =>
    overlaps(start, end, new Date(window.start), new Date(window.end)),
  );
}

function matchesCapacity(roomType: RoomType, request: AvailabilityPricingRequest) {
  const adultsOkay = request.guestCount ? roomType.capacityAdults >= request.guestCount : true;
  const childrenOkay =
    typeof request.childCount === "number"
      ? roomType.capacityChildren >= request.childCount
      : true;

  return adultsOkay && childrenOkay;
}

export function evaluateAvailability(
  request: AvailabilityPricingRequest,
): Array<Omit<RoomAvailabilityOption, "nightlyBreakdown" | "estimatedTotal" | "pricingRule">> {
  if (!request.checkIn || !request.checkOut) {
    return [];
  }

  const checkIn = request.checkIn;
  const checkOut = request.checkOut;

  return mockRoomTypes.map((roomType) => {
    const property = mockProperties.find((item) => item.id === roomType.propertyId)!;
    const matchesPreference =
      request.roomTypePreference
        ? roomType.name.toLowerCase().includes(request.roomTypePreference.toLowerCase())
        : false;
    const fitsCapacity = matchesCapacity(roomType, request);
    const unavailableReason = !fitsCapacity
      ? "Capacity does not fit the requested guest mix."
      : isBlackout(roomType.id, checkIn, checkOut)
        ? "Preferred dates overlap with mock inventory blackout dates."
        : null;

    return {
      property,
      roomType,
      fitsBudget: typeof request.budget === "number" ? roomType.basePrice <= request.budget : true,
      matchesPreference,
      availabilityConfidence: unavailableReason ? 0.25 : matchesPreference ? 0.94 : 0.78,
      unavailableReason,
    };
  });
}
