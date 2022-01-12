import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigsLoaderService {
  private httpClient: HttpClient;
  private configs: Configs;
  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }
  get ApiEndpoint() {
    const apiEndpoint = this.configs.apiEndpoint;
    console.log('ApiEndpoint requested', apiEndpoint);
    return this.configs.apiEndpoint;
  }

  get AppEndpoint() {
    return this.configs.appEndpoint;
  }

  get ConfigsLoadedFrom() {
    return this.configs.configsLoadedFrom;
  }

  public async loadConfigs(): Promise<any> {
    return this.httpClient.get('assets/configs.json').pipe(settings => settings)
      .toPromise()
      .then(settings => {
        this.configs = settings as Configs;
        console.log('configs here to be replaced', this.configs);
        console.log('origin:', window.location.origin);

      });
  }
}


export interface Configs {
  apiEndpoint: string;
  appEndpoint: string;
  configsLoadedFrom: string;
}
