import { Property } from 'src/app/property/shared/property';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
import { DiaryEvent } from 'src/app/diary/shared/diary';
import { Person } from 'src/app/shared/models/person';
import { BaseRequestOption } from 'src/app/shared/models/base-request-option';

export interface Valuation {
  valuationEventId: number;
  valuationStatus: number;
  property: Property;
  valuer: BaseStaffMember;
  valuationDate?: Date;
  propertyOwner?: Person;
  diaryEvent: DiaryEvent;
  suggestedAskingPrice?: number;
  suggestedAskingRentLongLet: number;
  suggestedAskingRentShortLet: number;
  createdDate: Date;
  createdBy: BaseStaffMember;
}

export interface ValuationRequestOption extends BaseRequestOption {
  valuationStatus?: number;
}

export enum ValuationStatus {
  Incomplete,
  Invited,
  Valued
}

export function getValuationStatuses() {
  return Object.keys(ValuationStatus).filter(
    (type) => isNaN(<any>type)
  );
}
