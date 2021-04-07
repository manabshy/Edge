export interface StaffMember {
  staffMemberId: number;
  firstName: string;
  surname: string;
  fullName: string;
  jobTitle: string;
  email: string;
  exchangeUsername?: string;
  username: string;
  phone: string;
  mobile: string;
  roles: Role[];
  permissions: Permission[];
  dashboardMode: string;
  impersonations: Impersonation[];
  homeOffice: Office;
  activeDepartments: Department[];
  officeId: number;
  departmentId: number;
  thumbnailUrl: string;
  photoUrl: string;
  canImpersonate: boolean;
}

export interface Impersonation {
  staffMemberId: number;
  fullName: string;
}
export interface Permission {
  permissionId: number;
  description: PermissionDescription;
}

export enum PermissionDescription {
  CreateFeedback = 'Create Feedback',
  CreateInspection = 'Create Inspection Report',
  CreateValuation = 'Create Valuation'
}

export interface Office {
  phone: string;
  mobile: string;
  name: string;
  officeId: number;
}

export interface Role {
  roleId: number;
  roleName: RoleName;
  departments: Department[];
}

export interface Permissions {
  canEditStaffMembers: StaffPermission[];
  canViewStaffMembers: StaffPermission[];
}

export interface StaffPermission {
  staffMemberId: number;
  firstName: string;
  surname: string;
  fullName: string;
}

export interface Department {
  departmentId: number;
  staffMemberId: number;
  officeId: number;
  roleId: number;
  emailAddress?: string;
}
export enum PermissionEnum {
  CsBoardAccess = 72,
  GdprRemoval = 75,
}

export enum DefaultViews {
  CreateAppointment = 'appointment',
  CreateCallback = 'callback',
  PropertySearch = 'propertySearch',
  Portfolio = 'portfolio'
}

export enum RoleName {
  Negotiator = 'Negotiator',
  Manager = 'Manager',
  Broker = 'Broker'
}

export enum RoleDepartment {
  Sales = 'Sales',
  Lettings = 'Lettings'
}

export enum OrderRole {
  SalesManager,
  LettingsManager,
  SalesNegotiator,
  LettingsNegotiator
}

export enum ApiRole {
  NotApplicable = 'NotApplicable',
  SalesManager = 'SalesManager',
  LettingsManager = 'LettingsManager',
  SalesNegotiator = 'SalesNegotiator',
  LettingsNegotiator = 'LettingsNegotiator'
}

export interface StaffMemberResult {
  result: StaffMember;
}

export interface StaffMemberListResult {
  result: StaffMember[];
}

export interface OfficeListResult {
  result: Office[];
}
