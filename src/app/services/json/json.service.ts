import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(
    private http: HttpClient
  ) { }

  public readJsonFile<T>(filePath: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(filePath));
  }
}
