import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable, startWith, map } from 'rxjs';
import { IUser } from '../../core/interfaces/user.interface';
import { RecommendationsService } from '../../core/services/recommendations/recommendations.service';
import { FavoritesService } from '../../core/services/favorites/favorites.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { GenresService } from '../../core/services/genres/genres.service';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { IRecommendation } from '../../core/interfaces/recommendation.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit, OnDestroy {
  genres: string[] = [];
  userInfo: IUser | undefined;
  favoritesUser: string[] = [];
  recommendation: IRecommendation | undefined;
  subscriptionAuth$: Subscription | undefined;
  subscriptionGenres$: Subscription | undefined;
  subscriptionFavorites$: Subscription | undefined;
  subscriptionRecommendations$: Subscription | undefined;
  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('auto', { static: false }) matAutocomplete:
    | MatAutocomplete
    | undefined;

  searchGenreControl = new FormControl();
  filteredGenres!: Observable<string[]>;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private genresService: GenresService,
    private favoritesService: FavoritesService,
    private recommendationsService: RecommendationsService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public sanitizer: DomSanitizer
  ) {
    this.filteredGenres = this.searchGenreControl.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) =>
        genre ? this._filter(genre) : this.genres!.slice()
      )
    );
  }

  ngOnInit() {
    this.loadGenres();
    this.loadFavoriteMusic();
  }

  ngOnDestroy() {
    if (this.subscriptionAuth$) this.subscriptionAuth$.unsubscribe();
    if (this.subscriptionGenres$) this.subscriptionGenres$.unsubscribe();
    if (this.subscriptionFavorites$) this.subscriptionFavorites$.unsubscribe();
    if (this.subscriptionRecommendations$)
      this.subscriptionRecommendations$.unsubscribe();
  }

  loadFavoriteMusic() {
    this.subscriptionAuth$ = this.authService
      .getUserInfo()
      .subscribe((user: IUser) => {
        if (user) this.userInfo = user;
        if (user.favorites) this.favoritesUser = user.favorites;
        this.getRecommendations();
      });
  }

  loadGenres() {
    this.subscriptionGenres$ = this.genresService
      .getGenres()
      .subscribe((genres: string[]) => (this.genres = genres));
  }

  getRecommendations() {
    this.subscriptionRecommendations$ = this.recommendationsService
      .getRecomnedations(this.favoritesUser.join(','))
      .subscribe((recommendation: IRecommendation) => {
        if (recommendation) this.recommendation = recommendation;
        console.log(this.recommendation);
      });
  }

  get principalName() {
    return this.recommendation?.principalTrack?.name;
  }

  get getPrincipalArtists() {
    return this.recommendation?.principalTrack?.artists
      ?.map((artist) => artist.name)
      .join(', ');
  }

  get getPrincipalImage() {
    return this.recommendation!.principalTrack!.album!.images![0].url;
  }

  get getPrincipalAlbums() {
    return this.recommendation?.principalTrack?.album?.name;
  }

  get getPrincipalReleaseDate() {
    return this.recommendation?.principalTrack?.album?.release_date;
  }

  getArtistName(index: number) {
    return this.recommendation!.tracks![index].artists!.map(
      (artist) => artist.name
    ).join(', ');
  }

  getImage(index: number) {
    if (this.recommendation!.tracks![index].album!.images![0]) {
      return this.recommendation!.tracks![index].album!.images![0].url;
    } else {
      return 'https://i0.wp.com/elfutbolito.mx/wp-content/uploads/2019/04/image-not-found.png?ssl=1s';
    }
  }

  get getErrorMessage() {
    return 'Select maximum 5 genres';
  }

  logout() {
    AuthService.removeToken();
    this.router.navigate(['/auth']);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.genres!.filter((genre) =>
      genre.toLowerCase().includes(filterValue)
    );
  }

  genreSelected(event: MatAutocompleteSelectedEvent) {
    if (this.favoritesUser.length < 5) {
      if (!this.favoritesUser.includes(event.option.viewValue.toLowerCase())) {
        this.favoritesUser.push(event.option.viewValue.toLowerCase());
        this.subscriptionFavorites$ = this.favoritesService
          .updateFavorites(this.userInfo!.id, this.favoritesUser)
          .subscribe((user: IUser) => {
            if (user) this.userInfo = user;
            if (user.favorites) this.favoritesUser = user.favorites;
            this.getRecommendations();
          });
      } else {
        this.matSnackBar.open('Preference is already selected', 'Close', {
          duration: 3000,
        });
      }
    } else {
      this.matSnackBar.open(this.getErrorMessage, 'Close', { duration: 3000 });
    }
    this.genreInput!.nativeElement.value = '';
    this.searchGenreControl.setValue(null);
  }

  removeFavorite(event: any) {
    this.favoritesUser = this.favoritesUser.filter(
      (favorite) => favorite !== event
    );
    this.subscriptionFavorites$ = this.favoritesService
      .updateFavorites(this.userInfo!.id, this.favoritesUser)
      .subscribe((user: IUser) => {
        if (user) this.userInfo = user;
        if (user.favorites) this.favoritesUser = user.favorites;
        this.getRecommendations();
      });
  }

  addFavorite(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) this.genres!.push(value);
    event.chipInput!.clear();
    this.searchGenreControl.setValue(null);
  }
}
