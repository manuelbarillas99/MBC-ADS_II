export interface Reservation {
  id?: number;
  spaceId: number;
  spaceName?: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  title: string;
  createdBy?: string;
}
