import { InMemoryDbService } from 'angular-in-memory-web-api';
import { TeamMember, TeamMemberPoint } from './models/team-member';


export class AdminPanelInMemoryData implements InMemoryDbService {

  createDb() {
    const memberRecords: any[] = [
      {
        date: '21/06/2020',
        reason: 'Inbound Valuation',
        points: 200
      }
    ];

    const teamMembers: any[] = [
      {
        id: 1,
        firstName: 'Melissa',
        surname: 'D\'angelo',
        fullName: 'Melissa D\'Angelo',
        position: 1,
        photoUrl: 'assets/images/leaf_rake.png',
        points: memberRecords
      }
    ];
    return {teamMembers};
  }
}
