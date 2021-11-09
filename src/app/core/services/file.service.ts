import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { tap, map } from 'rxjs/operators'
import { AppConstants } from '../shared/app-constants'

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) {}

  saveFileTemp(fileArr: any[]): Observable<File[] | any> {
    const url = `${AppConstants.baseFileUrl}` + '/upload'

    const formData = new FormData()
    fileArr.forEach((x) => {
      formData.append('files', x, x.name)
    })

    return this.http.post<any>(url, formData).pipe(
      tap((data) => console.log('saveFileTemp result...', JSON.stringify(data))),
      map((response) => response.result)
    )
  }
}

export enum FileTypeEnum {
  OnlyDocument = 1,
  OnlyImage = 2,
  ImageAndDocument = 3,
  All = 4
}
