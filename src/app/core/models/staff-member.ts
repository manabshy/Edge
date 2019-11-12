export interface StaffMember {
  jobTitle: string;
  email: string;
  username: string;
  phone: string;
  mobile: string;
  roles: Role[];
  permissions: Permission[];
  impersonations: Impersonation[];
  homeOffice: Office;
  staffMemberId: number;
  firstName: string;
  surname: string;
  fullName: string;
  thumbnailUrl: string;
  photoUrl: string;
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
  departmentName: RoleDepartment;
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