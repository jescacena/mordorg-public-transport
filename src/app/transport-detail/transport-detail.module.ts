import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TransportDetailComponent } from './transport-detail.component';

import { SharedModule } from '../shared/shared.module';
// import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    TransportDetailComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
  exports: [
  ],
  providers: [],

})

export class TransportDetailModule {
}
