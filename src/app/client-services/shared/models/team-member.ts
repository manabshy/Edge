export interface TeamMember {
  staffMemberId: number;
  name: string;
  totalPoints?: number;
  photoUrl: string;
  position?: number;
  points?: TeamMemberPoint[];
  badges?: Badge[];
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

export interface TeamMemberPoint {
  pointId?: number;
  staffMemberId: number;
  badgeId?: number;
  pointTypeId?: number;
  type?: string;
  points: number;
  createdBy?: string;
  reason: string;
  dateTime?: Date;
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

export interface ResponseData {
  message: null;
  requestId: string;
  result: string[];
  status: boolean;
  technicalDetails: string;
}
