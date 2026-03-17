"use server";

import { revalidatePath } from "next/cache";
import { createReservationFromDraftSuggestion } from "../mocks/reservations-module";
import type { CreateReservationActionState } from "./conversation-reservation-action-state";

export async function createReservationFromConversationDraftAction(
  _previousState: CreateReservationActionState,
  formData: FormData,
): Promise<CreateReservationActionState> {
  const tenantId = formData.get("tenantId");
  const actorUserId = formData.get("actorUserId");
  const leadId = formData.get("leadId");
  const conversationId = formData.get("conversationId");
  const candidateRoomType = formData.get("candidateRoomType");
  const checkIn = formData.get("checkIn");
  const checkOut = formData.get("checkOut");
  const adultCount = Number(formData.get("adultCount"));
  const childCount = Number(formData.get("childCount"));
  const estimatedTotalPrice = Number(formData.get("estimatedTotalPrice"));
  const currency = formData.get("currency");
  const notes = formData.get("notes");

  if (
    typeof tenantId !== "string" ||
    typeof actorUserId !== "string" ||
    typeof leadId !== "string" ||
    typeof checkIn !== "string" ||
    typeof checkOut !== "string" ||
    Number.isNaN(adultCount) ||
    Number.isNaN(childCount) ||
    Number.isNaN(estimatedTotalPrice) ||
    typeof currency !== "string" ||
    typeof notes !== "string"
  ) {
    return {
      status: "error",
      message: "Reservation draft is incomplete. Refresh the page and try again.",
      reservationId: null,
      summary: null,
    };
  }

  try {
    const result = await createReservationFromDraftSuggestion({
      tenantId,
      actorUserId,
      leadId,
      conversationId: typeof conversationId === "string" ? conversationId : null,
      candidateRoomType:
        typeof candidateRoomType === "string" && candidateRoomType.length > 0
          ? candidateRoomType
          : null,
      checkIn,
      checkOut,
      adultCount,
      childCount,
      estimatedTotalPrice,
      currency,
      notes,
    });

    revalidatePath("/conversations");
    revalidatePath("/reservations");

    return {
      status: "success",
      message: result.message,
      reservationId: result.reservationId,
      summary: result.summary,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create reservation.";

    return {
      status: "error",
      message,
      reservationId: null,
      summary: null,
    };
  }
}
