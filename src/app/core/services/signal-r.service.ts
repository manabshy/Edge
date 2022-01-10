import { Injectable } from '@angular/core';
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

  private currentStaffMember: StaffMember;

  private hubConnection: signalR.HubConnection;
  numOfRetries = 10;
  timeOut = 1 * 60 * 1000;
  isConnectionLost = true;


  constructor(private staffMemberService: StaffMemberService) {
    this.startConnection();
    this.staffMemberService.getCurrentStaffMember().subscribe(data => this.currentStaffMember = data);
  }

  public startConnection = () => {
    const url = `${AppConstants.baseRewardsHubUrl}`;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .configureLogging({
        log(logLevel, message) {
          console.log(new Date().toISOString() + ': my message ' + message);
        }
      })
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


    this.addGetBonusListener();
    this.addStreakDataListener();
    this.addSwagBagDataListener();

    this.hubConnection.onclose((err: Error) => {
      console.log('connection closed', { err });

      this.isConnectionLost = true;
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

  private setConnectionStatus(status: boolean) {
    this.connectionStatusSubject.next(status);
  }


  public addGetBonusListener = () => {
    this.hubConnection.on('get-bonuses', (data) => {
      if (data.staffMemberId != this.currentStaffMember.staffMemberId)
        return;

      this.getBonusesStream.next(data.content);
    });
  }

  public addStreakDataListener = () => {
    this.hubConnection.on('get-streak', (data) => {
      if (data.staffMemberId != this.currentStaffMember.staffMemberId)
        return;

      this.getStreakStream.next(data.content);
    });
  }

  public addSwagBagDataListener = () => {
    this.hubConnection.on('get-swag-bag', (data) => {
      if (data.staffMemberId != this.currentStaffMember.staffMemberId)
        return;

      this.getSwagBagStream.next(data.content);
    });
  }
}

