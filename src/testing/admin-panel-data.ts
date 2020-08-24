import { TeamMemberPoint, TeamMember } from 'src/app/client-services/shared/models/team-member';

export const MemberPoints: TeamMemberPoint[] = [
  {
    badgeId: 1,
    createdBy: 'System',
    dateTime: new Date('2020-07-23T16:00:22.847'),
    pointId: 91,
    pointTypeId: 9,
    points: 500,
    reason: 'Golden Stag',
    staffMemberId: 2430
  },
  {
    badgeId: null,
    createdBy: 'System',
    dateTime: new Date('2020-07-27T14:38:55.373'),
    pointId: 296,
    pointTypeId: 2,
    points: 20,
    reason: '60 Abbeville Road, London SW4 9NE',
    staffMemberId: 2430
  }
];

export const NewPoint = { pointTypeId: 9, points: 100, reason: 'Test', animate: false, createdBy: 'Rebecca Davies' } as unknown as TeamMemberPoint;
export const TeamMembers: TeamMember[] = [
  {
    staffMemberId: 2430,
    name: 'Shanil Khagram',
    photoUrl: 'https://dandglive.blob.core.windows.net/staffmembers-public%5Cs-2430%5Cstaff_2430_90e73db2af0c4b1f97c4f4266a89c82f_Shanil+Khagram.png',
    points: MemberPoints
  },
  {
    staffMemberId: 2622,
    name: 'Rebecca Davies',
    photoUrl: 'https://dandglive.blob.core.windows.net/staffmembers-public%5Cs-2622%5Cstaff_2622_4ddb3f08db664ad99c0d060942f9f917_REBECCA+DAVIES+150px+x+150px+Grey.jpg',
    points: MemberPoints
  }
];
