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

export interface Badge {
  badgeId: number;
  name: string;
  photoUrl: string;
  instructions: number;
  valuations: number;
  mortgageReferrals: number;
  legalReferrals: number;
  insuranceReferrals: number;
  recurrence: number;
  bonusPoints: number;
}

export interface Record {
  pointId: number;
  staffMemberId: number;
  pointTypeId: number;
  points: number;
  reason: string;
  dateTime: Date;
  propertyEventId: number;
}

export interface PointType {
  pointTypeId: number;
  name: string;
  points: number;
  animate?: boolean;
}

export enum PointTypesEnum {
  InboundInstruction = 1,
  OutboundInstruction = 2,
  InboundVal = 3,
  OutboundVal = 4,
}
