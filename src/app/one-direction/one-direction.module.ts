import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneDirectionComponent } from './one-direction.component';
import { SharedModule } from '../shared/shared.module';
// import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    OneDirectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [],

})

export class OneDirectionModule {
}
