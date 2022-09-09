import { AuthComponent } from './modules/auth/auth.component';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'favorite',
        loadChildren: () =>
          import('./modules/favorite/favorite.module').then(
            (m) => m.FavoriteModule
          ),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'AngularMaterial',
    loadChildren: () =>
      import('./material/angular-material.module').then(
        (m) => m.AngularMaterialModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
