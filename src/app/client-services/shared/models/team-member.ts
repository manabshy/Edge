export interface TeamMember {
  id: number;
  firstName: string;
  surname: string;
  fullName: string;
  position: number;
  points: number;
  photoUrl: string;
  records: Record[];
}

export interface Record {
  date: string;
  reason: string;
  points: number;
}
