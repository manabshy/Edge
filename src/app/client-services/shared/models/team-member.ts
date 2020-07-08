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

export enum PointTypesEnum {
  InboundInstruction = 1,
  OutboundInstruction = 2,
  InboundVal = 3,
  OutboundVal = 4,
}

export interface PointType {
  name: string;
  value: number;
  type: PointTypesEnum;
}

export const PointTypes: PointType[] = [
  {
    name: 'Inbound Valuation',
    value: 250,
    type: PointTypesEnum.InboundInstruction
  },
  {
    name: 'Outbound Valuation',
    value: 200,
    type: PointTypesEnum.OutboundVal
  }
]