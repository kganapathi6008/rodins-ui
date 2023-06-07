import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  public getRecords(formdata: FormData){
    return this.httpClient.post(`${environment.apiUrl}/importer/rodins/get-records`, formdata, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }

  public getFile(payload: any){
    return this.httpClient.post(`${environment.apiUrl}/importer/rodins/get-file`, payload, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }

  public processZip(formdata: FormData){
    return this.httpClient.post(`${environment.apiUrl}/process_zip`, formdata, {
      responseType: 'arraybuffer', observe: 'response',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }
}
