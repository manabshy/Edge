import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { BehaviorSubject, Subject } from 'rxjs';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { AppConstants } from '../shared/app-constants';
import { StaffMemberService } from './staff-member.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private getBonusesStream: BehaviorSubject<any> = new BehaviorSubject(null);
  public getBonusesStream$ = this.getBonusesStream.asObservable();

  private getStreakStream: BehaviorSubject<any> = new BehaviorSubject(null);
  public getStreakStream$ = this.getStreakStream.asObservable();

  private getSwagBagStream: BehaviorSubject<any> = new BehaviorSubject(null);
  public getSwagBagStream$ = this.getSwagBagStream.asObservable();

  private connectionStatusSubject = new Subject<boolean>();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();


  public hubConnection: signalR.HubConnection;
  numOfRetries = 10;
  timeOut = 1 * 60 * 1000;
  public isConnectionLost = true;


  constructor(private staffMemberService: StaffMemberService) { 
   
   }


  public hubConnectionOnclose = (error: any) => {
    this.isConnectionLost = true;
    this.setConnectionStatus(this.isConnectionLost);
    this.reconnect();
  }

  public startConnection = () => {

    this.staffMemberService.getCurrentStaffMember().subscribe(staffMember => {
      if(staffMember) {

        this.addGetBonusListener(staffMember);
        this.addStreakDataListener(staffMember);
        this.addSwagBagDataListener(staffMember);
      }
    });

    const url = `${AppConstants.baseRewardsHubUrl}`;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.isConnectionLost = false;
        this.setConnectionStatus(this.isConnectionLost);
        console.log('Connection started');
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        this.setConnectionStatus(this.isConnectionLost);
        this.reconnect();
      });




  }

  public reconnect() {
    console.log('reconnecting... at', new Date(), 'isConnectionLost', this.isConnectionLost);
    if (this.isConnectionLost) {
      setTimeout(() => {
        this.startConnection();
        this.numOfRetries++;
        console.log('retries within 5  minutes', this.numOfRetries);
      }, this.timeOut);
    }
    console.log('retries after timeout', this.numOfRetries);
  }

  public disconnect() {
    this.hubConnection.stop();
  }

  public setConnectionStatus(status: boolean) {
    this.connectionStatusSubject.next(status);
  }


  public addGetBonusListener = (currentStaffMember) => {
    this.hubConnection.on('get-bonuses', (data) => {

      if (data.staffMemberId != currentStaffMember.staffMemberId)
        return;

        console.log('get-bonuses content', data.content);
      this.getBonusesStream.next(data.content);
    });
  }

  public addStreakDataListener = (currentStaffMember) => {
    this.hubConnection.on('get-streak', (data) => {
      console.log('get-streak', data);
      console.log('staffMemberId', currentStaffMember.staffMemberId);

      if (data.staffMemberId != currentStaffMember.staffMemberId)
        return;

      console.log('get-streak content', data.content);
      this.getStreakStream.next(data.content);
    });
  }

  public addSwagBagDataListener = (currentStaffMember) => {
    this.hubConnection.on('get-swag-bag', (data) => {
      console.log('get-swag-bag', data);
      console.log('staffMemberId', currentStaffMember.staffMemberId);
      if (data.staffMemberId != currentStaffMember.staffMemberId)
        return;

      console.log('get-swag-bag content', data.content);
      this.getSwagBagStream.next(data.content);
    });
  }
}

