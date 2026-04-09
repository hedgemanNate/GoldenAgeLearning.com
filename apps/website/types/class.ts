export type ClassStatus = "upcoming" | "archived" | "deleted";

export interface Class {
  name: string;
  description: string;
  category: string;
  date: number;
  duration: number;
  location: string;
  price: number;
  seatLimit: number;
  seatsBooked: number;
  sponsorId: string | null;
  instructorId: string | null;
  status: ClassStatus;
  archivedAt: number | null;
  createdAt: number;
  createdBy: string;
}

export interface ClassWithId extends Class {
  id: string;
}
