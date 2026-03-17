export type CreatedReservationSummary = {
  reservationId: string;
  guestName: string;
  room: string | null;
  checkIn: string;
  checkOut: string;
  estimatedPrice: number;
  currency: string;
  status: string;
};

export type CreateReservationActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  reservationId: string | null;
  summary: CreatedReservationSummary | null;
};

export const initialCreateReservationActionState: CreateReservationActionState = {
  status: "idle",
  message: null,
  reservationId: null,
  summary: null,
};
