import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Space } from '../models/space.model';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(`${this.base}/spaces`);
  }

  getReservations(spaceId: number, date: string) {
    const params = new HttpParams()
      .set('spaceId', String(spaceId))
      .set('date', date);
    return this.http.get<Reservation[]>(`${this.base}/reservations`, { params });
  }

  createReservation(payload: Reservation) {
    return this.http.post<Reservation>(`${this.base}/reservations`, payload);
  }
}
