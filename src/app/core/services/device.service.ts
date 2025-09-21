import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Device } from '../../core/models/device';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Device[]> {
    return this.http.get<Device[]>('assets/mock/devices.json').pipe(
      map(list => list.sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1)))
    );
  }

  getById(id: string): Observable<Device | undefined> {
    return this.getAll().pipe(map(list => list.find(d => d.id === id)));
  }
}
