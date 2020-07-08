import { InMemoryDbService } from 'angular-in-memory-web-api';
import { TeamMember, Record } from './models/team-member';


export class AdminPanelInMemoryData implements InMemoryDbService {

  createDb() {
    const memberRecords: Record[] = [
      {
        date: '21/06/2020',
        reason: 'Inbound Valuation',
        points: 200
      }
    ];

    const teamMembers: TeamMember[] = [
      {
        id: 1,
        firstName: 'Melissa',
        surname: 'D\'angelo',
        fullName: 'Melissa D\'Angelo',
        position: 1,
        points: 200,
        photoUrl: 'assets/images/leaf_rake.png',
        records: memberRecords
      }
    ];
    return {teamMembers};
  }
}
