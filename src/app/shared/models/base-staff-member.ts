export interface BaseStaffMember {
  staffMemberId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  emailAddress: null;
  hasReminder: boolean;
  reminderUnits?: number;
  reminderUnitType?: number;
  exchangeGUID: string;
}
