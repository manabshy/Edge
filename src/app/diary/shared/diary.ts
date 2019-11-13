import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AppUtils } from 'src/app/core/shared/utils';
import { isArray } from 'util';
import { Address, newPropertyAddress } from 'src/app/core/models/address';
import { PhoneNumber, Person } from 'src/app/core/models/person';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Property } from 'src/app/property/shared/property';

  export enum DiaryEventTypesEnum {
    ViewingSales = 'Viewing - Sales',
    ViewingLettings = 'Viewing - Lettings',
    ValuationSales = 'Valuation - Sales',
    ValuationLettings = 'Valuation - Lettings',
    PropertyManagement = 'Property Management',
    Meeting = 'Meeting',
    NoAppointments = 'No Appointments',
    Training = 'Training',
    Personal = 'Personal',
    Review = 'Review',
    Other = 'Other',
    Reminder = 'Reminder'
  }

  /**
   * Event types shared between all users
   */
  export const baseUserEventTypes: string[] = [
    'Meeting',
    'NoAppointments',
    'Training',
    'Personal'
  ];

  /**
   * Non-user event types
   */
  export const baseNoUserEventTypes: string[] = ['Review', 'Other'];

  /**
   * Event types for feedback (Negotiator) permission
   */
  export const feedbackEventTypes: string[] = [
    'ViewingSales',
    'ViewingLettings'
  ];

  /**
   * Event types for inspection (Property Manager) permission
   */
  export const inspectionEventTypes: string[] = ['PropertyManagement'];

  /**
   * Event types for reminder permission
   */

  export const reminderEventTypes: string[] = ['Reminder'];

  /**
   * Event types for valuation (Broker) permission
   */

  export const valuationEventTypes: string[] = [
    'ValuationSales',
    'ValuationLettings'
  ];

  export const ManagedValuationOptions: string[] = ['Yes', 'No', 'Either'];

  export const baseDiaryEventTypes = [
    {
      id: DiaryEventTypesEnum.Meeting,
      name: DiaryEventTypesEnum.Meeting
    },

    {
      id: DiaryEventTypesEnum.NoAppointments,
      name: DiaryEventTypesEnum.NoAppointments
    },

    {
      id: DiaryEventTypesEnum.Training,
      name: DiaryEventTypesEnum.Training
    },

    {
      id: DiaryEventTypesEnum.Personal,
      name: DiaryEventTypesEnum.Personal
    },

    {
      id: DiaryEventTypesEnum.Review,
      name: DiaryEventTypesEnum.Review
    },

    {
      id: DiaryEventTypesEnum.Other,
      name: DiaryEventTypesEnum.Other
    }
  ];

  export const feedbackDiaryEventTypes = [
    {
      id: DiaryEventTypesEnum.ViewingSales,
      name: DiaryEventTypesEnum.ViewingSales
    },

    {
      id: DiaryEventTypesEnum.ViewingLettings,
      name: DiaryEventTypesEnum.ViewingLettings
    }
  ];

  export const inspectionDiaryEventTypes = [
    {
      id: DiaryEventTypesEnum.PropertyManagement,
      name: DiaryEventTypesEnum.PropertyManagement
    }
  ];

  export const valuationDiaryEventTypes = [
    {
      id: DiaryEventTypesEnum.ValuationSales,
      name: DiaryEventTypesEnum.ValuationSales
    },

    {
      id: DiaryEventTypesEnum.ValuationLettings,
      name: DiaryEventTypesEnum.ValuationLettings
    }
  ];

  export enum CallbackReminderEnum {
    Sales = 'sales',
    Lettings = 'lettings'
  }

  export interface CallbackReminderTypes {
    id: string;
    name: string;
  }

  export const CallbackReminderTypes = <CallbackReminderTypes[]>[
    { id: CallbackReminderEnum.Sales, name: 'Reminder - Sales' },
    { id: CallbackReminderEnum.Lettings, name: 'Reminder - Lettings' }
  ];

  export interface DiaryResult {
    results: DiaryEvent[];
  }

  export interface CallbackReminder {
    diaryEventId: number;
    notes: string;
    startDateTime: Date;
    endDateTime: Date;
    eventColour: string;
    contactGroups: ContactGroup[];
    properties: Property[];
    eventType: string;
    isConfirmed: boolean;
    isCancelled: boolean;
    staffMembers: Staff[];
    smsMessage: string;
  }

  export interface DiaryEvent {
    diaryEventId: number;
    businessDevelopmentId: number;
    notes: string;
    startDateTime: Date;
    endDateTime: Date;
    eventColour: string;
    contactGroups: ContactGroup[];
    properties: Property[];
    eventType: DiaryEventTypesEnum;
    isConfirmed: boolean;
    isCancelled: boolean;
    staffMembers: Staff[];
    smsMessage: string;
    noSmsReminder: boolean;
  }

  export interface EventQuery {
    staffMembers: number[];
    propertyId: number;
    diaryEventId?: number;
    startDate: Date | string | number;
    endDate: Date | string | number;
    searchTerm: string;
    pageSize: number;
    eventTypes?: string[];
    sort?: string;
    isAssociatedWithContactGroup?: boolean;
  }

  export interface HistoricEvent {
    status: string;
    diaryEventId: number;
    startDateTime: string;
    endDateTime: string;
    eventType: string;
    properties: Property[];
    staffMembers: Staff[];
  }

  export interface DiaryProperty extends Property {
    propertyLettingId: number;
    propertySaleId: number;
    contactGroups?: ContactGroup[];
  }


  export interface Staff {
    staffMemberId: number;
    firstName: string;
    surname: string;
    nextAlertStartTime: string;
    nextAlertExpiryTime: string;
    hasReminder: boolean;
    reminderUnitsIndex: string;
    reminderUnitTypeIndex: string;
  }

  export interface ToolbarButton {
    icon: string;
    text: string;
    disabled: Function;
    action: ActionTypes;
  }

  export function newEventForm(data?) {
    const form = new FormGroup({
      diaryEventId: new FormControl(0),
      notes: new FormControl('', [Validators.maxLength(200)]),
      startDateTime: new FormControl(AppUtils.getMomentDate(new Date()), [
        Validators.required
      ]),

      endDateTime: new FormControl(AppUtils.getMomentDate(new Date()), [
        Validators.required
      ]),
      eventColour: new FormControl('', [Validators.maxLength(8)]),
      contactGroups: new FormArray([]),
      properties: new FormArray([]),
      eventType: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),

      reminderType: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      isConfirmed: new FormControl(null),
      staffMembers: new FormArray([]),
      smsMessage: new FormControl('', [Validators.maxLength(500)]),
      noSmsReminder: new FormControl(true)
    });

    if (data) {
      form.patchValue(data);
      const contactGroups = form.get('contactGroups') as FormArray,
        properties = form.get('properties') as FormArray,
        staffMembers = form.get('staffMembers') as FormArray;
      if (isArray(data.contactGroups)) {
        data.contactGroups.map(cg => {
          contactGroups.push(newContactGroupForm(cg));
        });
      }
      if (isArray(data.properties)) {
        data.properties.map(prop => {
          properties.push(newPropertyForm(prop));
        });
      }
      if (isArray(data.staffMembers)) {
        data.staffMembers.map(staff => {
          staffMembers.push(newStaffMembersForm(staff));
        });
      }
    }
    return form;
  }

  export function newContactGroupForm(data?: ContactGroup) {
    const form = new FormGroup({
      contactGroupId: new FormControl(0),
      addressee: new FormControl('', [Validators.maxLength(255)])
    });
    if (data) {
      form.patchValue(data);
    }
    return form;
  }


  export function newPropertyForm(data?: Property) {
    const form = new FormGroup({
      propertyId: new FormControl(0),
      propertyLettingId: new FormControl(0),
      propertySaleId: new FormControl(0),
      address:
        data && data.address
          ? newPropertyAddress(data.address)
          : newPropertyAddress(null)
    });

    if (data) {
      form.patchValue(data);
    }
    return form;
  }

  export function newStaffMembersForm(data?: Staff) {
    const form = new FormGroup({
      staffMemberId: new FormControl(0),
      firstName: new FormControl(''),
      surname: new FormControl(''),
      nextAlertStartTime: new FormControl(''),
      nextAlertExpiryTime: new FormControl(''),
      hasReminder: new FormControl(true),
      reminderUnitsIndex: new FormControl(''),
      reminderUnitTypeIndex: new FormControl('')
    });

    if (data) {
      form.patchValue(data);
    }
    return form;
  }

  export enum ActionTypes {
    NEW,
    EDIT,
    REBOOK,
    PROPERTY_ACTION,
    FEEDBACK,
    DELETE,
    CANCEL,
    INSPECTION,
    VALUATION,
    REGISTER_OFFER,
    CALL,
    DISMISS
  }
