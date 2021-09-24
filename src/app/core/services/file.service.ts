import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import { BaseEmail } from "src/app/shared/models/base-email";
import { AppConstants } from "../shared/app-constants";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private http: HttpClient, private storage: StorageMap) {}

  saveFileTemp(fileArr: FormData): Observable<File[] | any> {
    const url = `${AppConstants.baseFileUrl}` + "/upload";

    return this.http.post<any>(url, fileArr).pipe(
      tap((data) => console.log("sent...", JSON.stringify(data))),
      map((response) => response.result)
    );
  }
}

export enum FileTypeEnum {
  OnlyDocument = 1,
  OnlyImage = 2,
  ImageAndDocument = 3,
  All = 4,
}
