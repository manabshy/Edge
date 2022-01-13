import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { BehaviorSubject, Subject } from 'rxjs';
import { AppConstants } from '../shared/app-constants';

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

  private connectionStatusSubject =new BehaviorSubject(null);
  public connectionStatus$ = this.connectionStatusSubject.asObservable();


  public hubConnection: signalR.HubConnection;
  numOfRetries = 10;
  timeOut = 1 * 60 * 1000;
  public isConnectionLost = true;



  public hubConnectionOnclose = (error: any, staffMember: any) => {
    this.isConnectionLost = true;
    this.setConnectionStatus(this.isConnectionLost);
    this.reconnect(staffMember);
  }

  public startConnection = (staffMember) => {

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

        this.addGetBonusListener(staffMember);
        this.addStreakDataListener(staffMember);
        this.addSwagBagDataListener(staffMember);

      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        this.setConnectionStatus(this.isConnectionLost);
        this.reconnect(staffMember);
      });
  }

  public reconnect(staffMember) {
    console.log('reconnecting... at', new Date(), 'isConnectionLost', this.isConnectionLost);
    if (this.isConnectionLost) {
      setTimeout(() => {
        this.startConnection(staffMember);
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

      this.getBonusesStream.next(data.content);
    });
  }

  public addStreakDataListener = (currentStaffMember) => {
    this.hubConnection.on('get-streak', (data) => {
      if (data.staffMemberId != currentStaffMember.staffMemberId)
        return;

      this.getStreakStream.next(data.content);
    });
  }

  public addSwagBagDataListener = (currentStaffMember) => {
    this.hubConnection.on('get-swag-bag', (data) => {
      if (data.staffMemberId != currentStaffMember.staffMemberId)
        return;

      this.getSwagBagStream.next(data.content);
    });
  }
}

