import { Property } from 'src/app/property/shared/property';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';

export interface Valuation {
  valuationEventId: number;
  valuationStatus: number;
  property: Property;
  valuer: BaseStaffMember;
}

