import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { BehaviorSubject } from 'rxjs';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { AppConstants } from '../shared/app-constants';
import { StaffMemberService } from './staff-member.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {


  private hubConnection: signalR.HubConnection
  private messageStream: BehaviorSubject<any> = new BehaviorSubject(null);
  public messageStream$ = this.messageStream.asObservable();
  private currentStaffMember: StaffMember;

  constructor(private staffMemberService: StaffMemberService) {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => this.currentStaffMember = data);
  }

  public startConnection = () => {
    const url = `${AppConstants.baseRewardsHubUrl}`;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }


  public addRewardsDataListener = () => {
    this.hubConnection.on('rewardsdata', (data) => {
      if (data.staffMemberId != this.currentStaffMember.staffMemberId)
        return;

      this.messageStream.next(data);
    });
  }
}
