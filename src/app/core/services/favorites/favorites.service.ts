import { Observable, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { IUser } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  apiUrl: string = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  updateFavorites(idUser: string, favorites: string[]): Observable<IUser> {
    console.log('favorites', favorites);
    return this.http.patch<IUser>(`${this.apiUrl}/users/${idUser}`, {
      favorites,
    });
  }
}
