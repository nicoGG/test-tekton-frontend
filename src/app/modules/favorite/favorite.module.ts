import { CapitalizePipe } from './../../shared/pipes/capitalize.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../../material/angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [FavoriteComponent, CapitalizePipe],
  imports: [
    CommonModule,
    FavoriteRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [CapitalizePipe],
})
export class FavoriteModule {}
