import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IRecommendation } from '../../interfaces/recommendation.interface';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  apiUrl: string = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getRecomnedations(genres: string): Observable<IRecommendation> {
    return this.http.get(`${this.apiUrl}/recommendations?genres=${genres}`);
  }
}
